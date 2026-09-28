import { db, type Prisma, type ProjectStatus } from "@/db";
import { adminNextAction, clientNextAction } from "@/domain/next-action";
import { calculateProgress, projectPhases } from "@/domain/progress";
import { ACTIVE_STATUSES, AWAITING_CLIENT_STATUSES, PROJECT_STATUSES } from "@/domain/project-status";
import { isAdmin, type Actor } from "./actor";
import { assertProjectAccess, projectScope, requireAdmin } from "./authz";

/** Messages the viewer hasn't read yet (sent by the other side). */
function unreadForViewer(actor: Actor): Prisma.ProjectMessageWhereInput {
  return isAdmin(actor)
    ? { readAt: null, sender: { role: "CLIENT" } }
    : { readAt: null, OR: [{ senderId: null }, { sender: { role: "ADMIN" } }] };
}

// ---------------------------------------------------------------------------
// Project detail (client + admin)
// ---------------------------------------------------------------------------

export async function getProjectDetail(actor: Actor, projectId: string) {
  await assertProjectAccess(db, actor, projectId);
  const admin = isAdmin(actor);

  const project = await db.project.findUniqueOrThrow({
    where: { id: projectId },
    include: {
      business: true,
      organization: {
        select: {
          id: true,
          name: true,
          members: {
            select: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  clientProfile: { select: { phone: true } },
                },
              },
            },
          },
        },
      },
      services: { include: { service: { select: { name: true, slug: true } } } },
      tasks: {
        where: admin ? {} : { clientVisible: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: { assignee: { select: { id: true, firstName: true, lastName: true } } },
      },
      designReviews: {
        where: admin ? {} : { status: { not: "DRAFT" } },
        orderBy: [{ createdAt: "desc" }],
        select: { id: true, title: true, version: true, status: true, requestedAt: true },
      },
      approvals: {
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        select: { id: true, type: true, createdAt: true },
      },
      _count: {
        select: {
          files: true,
          messages: true,
          revisionRequests: { where: { status: "OPEN" } },
        },
      },
    },
  });

  const unreadMessages = await db.projectMessage.count({ where: { projectId, ...unreadForViewer(actor) } });
  const reviewsAwaiting = project.designReviews.filter((r) => r.status === "IN_REVIEW");
  const nextTask = project.tasks.find((t) => t.status !== "DONE");

  return {
    ...project,
    progress: calculateProgress(project),
    phases: projectPhases(project.status, project.statusBeforeHold),
    unreadMessages,
    reviewsAwaiting,
    clientAction: clientNextAction({
      projectId,
      status: project.status,
      reviewsAwaiting,
      approvalsAwaiting: project.approvals,
      unreadMessages: admin ? 0 : unreadMessages,
    }),
    adminNextAction: adminNextAction({
      status: project.status,
      openRevisions: project._count.revisionRequests,
      pendingApprovals: project.approvals.length,
      reviewsAwaitingClient: reviewsAwaiting.length,
      hasUnreadClientMessages: admin && unreadMessages > 0,
      nextTaskTitle: nextTask?.title,
    }),
  };
}

export type ProjectDetail = Awaited<ReturnType<typeof getProjectDetail>>;

/** Studio-only extras: invite state, briefs, internal notes count. */
export async function getAdminProjectExtras(actor: Actor, projectId: string) {
  requireAdmin(actor);
  const [project, briefs] = await Promise.all([
    db.project.findUniqueOrThrow({
      where: { id: projectId },
      select: {
        organization: { select: { inviteEmail: true } },
        leads: { select: { id: true, name: true, createdAt: true } },
        _count: { select: { notes: true } },
      },
    }),
    db.projectBrief.findMany({ where: { projectId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  return { inviteEmail: project.organization.inviteEmail, leads: project.leads, notesCount: project._count.notes, briefs };
}

export async function listProjectRequirements(actor: Actor, projectId: string) {
  await assertProjectAccess(db, actor, projectId);
  return db.projectRequirement.findMany({ where: { projectId }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });
}

// ---------------------------------------------------------------------------
// Client dashboard
// ---------------------------------------------------------------------------

export async function listClientProjects(actor: Actor) {
  const projects = await db.project.findMany({
    where: projectScope(actor),
    orderBy: [{ updatedAt: "desc" }],
    select: {
      id: true,
      number: true,
      name: true,
      status: true,
      statusBeforeHold: true,
      createdAt: true,
      submittedAt: true,
      business: { select: { name: true } },
      tasks: { where: { clientVisible: true }, select: { status: true } },
    },
  });
  return projects.map((p) => ({ ...p, progress: calculateProgress(p) }));
}

export async function getClientDashboard(actor: Actor) {
  const projects = await listClientProjects(actor);
  const current =
    projects.find((p) => !["CANCELLED", "COMPLETED", "DRAFT"].includes(p.status)) ??
    projects.find((p) => p.status === "DRAFT") ??
    projects[0] ??
    null;

  const organization = await db.organizationMember.findFirst({
    where: { userId: actor.id },
    orderBy: { createdAt: "asc" },
    select: { organization: { select: { name: true, businesses: { select: { name: true }, take: 1 } } } },
  });

  if (!current) {
    return { projects, current: null, organization: organization?.organization ?? null };
  }

  const [detail, recentMessages, recentFiles] = await Promise.all([
    getProjectDetail(actor, current.id),
    db.projectMessage.findMany({
      where: { projectId: current.id },
      orderBy: { createdAt: "desc" },
      take: 3,
      include: { sender: { select: { firstName: true, lastName: true, role: true } } },
    }),
    db.projectFile.findMany({
      where: { projectId: current.id, category: { not: "DESIGN" } },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: { id: true, originalName: true, mimeType: true, size: true, createdAt: true, category: true },
    }),
  ]);

  return { projects, current: detail, recentMessages, recentFiles, organization: organization?.organization ?? null };
}

// ---------------------------------------------------------------------------
// Admin: projects list and overview
// ---------------------------------------------------------------------------

export const PROJECT_SORTS = ["activity", "created", "name", "status"] as const;
export type ProjectSort = (typeof PROJECT_SORTS)[number];

export interface AdminProjectListParams {
  q?: string;
  status?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}

export async function listAdminProjects(actor: Actor, params: AdminProjectListParams) {
  requireAdmin(actor);
  const pageSize = params.pageSize ?? 20;
  const page = Math.max(1, params.page ?? 1);
  const q = params.q?.trim().slice(0, 100);

  const where: Prisma.ProjectWhereInput = {};
  if (params.status === "active") where.status = { in: ACTIVE_STATUSES };
  else if (params.status === "awaiting-client") where.status = { in: AWAITING_CLIENT_STATUSES };
  else if ((PROJECT_STATUSES as readonly string[]).includes(params.status ?? "")) {
    where.status = params.status as ProjectStatus;
  }
  if (q) {
    const numeric = Number(q.replace(/^p-?/i, ""));
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { business: { name: { contains: q, mode: "insensitive" } } },
      { organization: { name: { contains: q, mode: "insensitive" } } },
      {
        organization: {
          members: {
            some: {
              user: {
                OR: [
                  { firstName: { contains: q, mode: "insensitive" } },
                  { lastName: { contains: q, mode: "insensitive" } },
                  { email: { contains: q, mode: "insensitive" } },
                ],
              },
            },
          },
        },
      },
      ...(Number.isInteger(numeric) && numeric > 0 ? [{ number: numeric }] : []),
    ];
  }

  const sort = (PROJECT_SORTS as readonly string[]).includes(params.sort ?? "") ? params.sort : "activity";
  const orderBy: Prisma.ProjectOrderByWithRelationInput =
    sort === "created"
      ? { createdAt: "desc" }
      : sort === "name"
        ? { name: "asc" }
        : sort === "status"
          ? { status: "asc" }
          : { lastActivityAt: "desc" };

  const [rows, total] = await Promise.all([
    db.project.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        number: true,
        name: true,
        status: true,
        createdAt: true,
        lastActivityAt: true,
        business: { select: { name: true } },
        organization: {
          select: {
            name: true,
            members: { take: 1, select: { user: { select: { firstName: true, lastName: true, email: true } } } },
          },
        },
        tasks: {
          where: { status: { not: "DONE" } },
          orderBy: { sortOrder: "asc" },
          take: 1,
          select: { title: true },
        },
        approvals: { where: { status: "PENDING" }, select: { id: true } },
        designReviews: { where: { status: "IN_REVIEW" }, select: { id: true } },
        _count: {
          select: {
            revisionRequests: { where: { status: "OPEN" } },
            messages: { where: { readAt: null, sender: { role: "CLIENT" } } },
          },
        },
      },
    }),
    db.project.count({ where }),
  ]);

  const items = rows.map((p) => ({
    ...p,
    client: p.organization.members[0]?.user ?? null,
    nextAction: adminNextAction({
      status: p.status,
      openRevisions: p._count.revisionRequests,
      pendingApprovals: p.approvals.length,
      reviewsAwaitingClient: p.designReviews.length,
      hasUnreadClientMessages: p._count.messages > 0,
      nextTaskTitle: p.tasks[0]?.title,
    }),
  }));

  return { items, total, page, pageSize };
}

export async function getAdminOverview(actor: Actor) {
  requireAdmin(actor);
  const [
    active,
    newRequests,
    awaitingClient,
    inDevelopment,
    awaitingApproval,
    completed,
    newLeads,
    recentProjects,
    upcomingTasks,
  ] = await Promise.all([
    db.project.count({ where: { status: { in: ACTIVE_STATUSES } } }),
    db.project.count({ where: { status: "NEW" } }),
    db.project.count({ where: { status: { in: AWAITING_CLIENT_STATUSES } } }),
    db.project.count({ where: { status: { in: ["DEVELOPMENT", "TESTING"] } } }),
    db.project.count({
      where: {
        OR: [{ approvals: { some: { status: "PENDING" } } }, { designReviews: { some: { status: "IN_REVIEW" } } }],
      },
    }),
    db.project.count({ where: { status: { in: ["LAUNCHED", "MAINTENANCE", "COMPLETED"] } } }),
    db.lead.count({ where: { status: "NEW" } }),
    db.project.findMany({
      where: { status: { not: "DRAFT" } },
      orderBy: { lastActivityAt: "desc" },
      take: 6,
      select: {
        id: true,
        number: true,
        name: true,
        status: true,
        lastActivityAt: true,
        business: { select: { name: true } },
      },
    }),
    db.projectTask.findMany({
      where: { status: { not: "DONE" }, project: { status: { in: ACTIVE_STATUSES } } },
      orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { createdAt: "asc" }],
      take: 8,
      include: { project: { select: { id: true, name: true, business: { select: { name: true } } } } },
    }),
  ]);

  return {
    metrics: { active, newRequests, awaitingClient, inDevelopment, awaitingApproval, completed, newLeads },
    recentProjects,
    upcomingTasks,
  };
}

/** Sidebar badge counts for a client across their projects. */
export async function getClientBadges(actor: Actor) {
  const scope = projectScope(actor);
  const [unreadMessages, reviewsAwaiting] = await Promise.all([
    db.projectMessage.count({ where: { project: scope, ...unreadForViewer(actor) } }),
    db.designReview.count({ where: { project: scope, status: "IN_REVIEW" } }),
  ]);
  return { unreadMessages, reviewsAwaiting };
}

/** Client-facing stages for the studio pipeline chart, in workflow order. */
export const PIPELINE_STAGES: { key: string; label: string; statuses: ProjectStatus[] }[] = [
  { key: "requirements", label: "Requirements", statuses: ["NEW", "INFORMATION_REQUIRED", "REQUIREMENTS_REVIEW"] },
  { key: "discovery", label: "Discovery", statuses: ["DISCOVERY"] },
  { key: "design", label: "Design", statuses: ["DESIGN"] },
  { key: "review", label: "Review", statuses: ["CLIENT_REVIEW", "REVISION"] },
  { key: "development", label: "Build", statuses: ["DEVELOPMENT"] },
  { key: "testing", label: "Testing", statuses: ["TESTING"] },
  { key: "approval", label: "Approval", statuses: ["CLIENT_APPROVAL", "READY_TO_LAUNCH"] },
  { key: "live", label: "Live", statuses: ["LAUNCHED", "MAINTENANCE"] },
];

/** Real project counts per pipeline stage (drafts, on-hold, completed and cancelled excluded). */
export async function getPipeline(actor: Actor) {
  requireAdmin(actor);
  const rows = await db.project.groupBy({ by: ["status"], _count: { _all: true } });
  const counts = new Map(rows.map((r) => [r.status, r._count._all]));
  return PIPELINE_STAGES.map((stage) => ({
    key: stage.key,
    label: stage.label,
    count: stage.statuses.reduce((sum, s) => sum + (counts.get(s) ?? 0), 0),
  }));
}
