import { db, type ProjectStatus, type Tx } from "@/db";
import { canTransition, STATUS_LABELS } from "@/domain/project-status";
import {
  parseDraft,
  stepSchema,
  validateForSubmission,
  type DataStepKey,
  type QuestionnaireDraft,
} from "@/domain/questionnaire";
import { buildProjectSummary, buildRequirementRows } from "@/domain/requirements";
import { selectTaskTemplates } from "@/domain/task-templates";
import { AppError, conflict, forbidden, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import { sendEmail, type EmailMessage } from "@/providers/email";
import { emailTemplates } from "@/providers/email/templates";
import { z } from "zod";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, requireAdmin, requireClient } from "./authz";
import { notifyAdmins, notifyProjectClients } from "./notifications";

// ---------------------------------------------------------------------------
// Status transitions
// ---------------------------------------------------------------------------

interface TransitionTarget {
  id: string;
  status: ProjectStatus;
  statusBeforeHold: ProjectStatus | null;
}

/**
 * The only place project status changes. Validates the transition against the
 * workflow state machine and records activity + client notifications.
 */
export async function transitionProjectStatus(
  tx: Tx,
  project: TransitionTarget,
  to: ProjectStatus,
  actorId: string,
  note?: string,
) {
  if (!canTransition(project.status, to, project.statusBeforeHold)) {
    throw new AppError(
      "INVALID_TRANSITION",
      `A project can't move from "${STATUS_LABELS[project.status]}" to "${STATUS_LABELS[to]}".`,
    );
  }

  const now = new Date();
  const updated = await tx.project.update({
    where: { id: project.id },
    data: {
      status: to,
      statusBeforeHold: to === "ON_HOLD" ? project.status : null,
      launchedAt: to === "LAUNCHED" ? now : undefined,
      completedAt: to === "COMPLETED" ? now : undefined,
    },
    select: { id: true, name: true },
  });

  await recordActivity(tx, {
    type: "STATUS_CHANGED",
    projectId: project.id,
    actorId,
    message: `Status changed to ${STATUS_LABELS[to]}`,
    metadata: { from: project.status, to, ...(note ? { note } : {}) },
  });
  await notifyProjectClients(tx, project.id, {
    type: "STATUS_CHANGED",
    title: `Project status: ${STATUS_LABELS[to]}`,
    body: updated.name,
    href: `/dashboard/project/${project.id}`,
  });
  return updated;
}

async function completeTemplateTask(tx: Tx, projectId: string, templateKey: string) {
  await tx.projectTask.updateMany({
    where: { projectId, templateKey, status: { not: "DONE" } },
    data: { status: "DONE", completedAt: new Date() },
  });
}

// ---------------------------------------------------------------------------
// Client: draft + questionnaire
// ---------------------------------------------------------------------------

/** Resumes the client's current draft or starts a new one. */
export async function startDraftProject(actor: Actor) {
  requireClient(actor);
  const membership = await db.organizationMember.findFirst({
    where: { userId: actor.id },
    orderBy: { createdAt: "asc" },
    include: { organization: { include: { businesses: { orderBy: { createdAt: "asc" }, take: 1 } } } },
  });
  if (!membership) throw forbidden("Your account isn't linked to a business yet.");

  const existing = await db.project.findFirst({
    where: { organizationId: membership.organizationId, status: "DRAFT" },
    orderBy: { updatedAt: "desc" },
    select: { id: true },
  });
  if (existing) return existing;

  const business = membership.organization.businesses[0];
  const businessName = business?.name ?? membership.organization.name;
  const prefill: QuestionnaireDraft = {
    business: {
      // Accounts created via Google have no business yet; don't prefill the person's name.
      businessName: business?.name ?? "",
      businessType: business?.businessType ?? "",
      industry: undefined,
      description: business?.description ?? "",
      address: business?.address ?? "",
      phone: business?.phone ?? "",
      email: business?.email ?? "",
      existingWebsite: business?.existingWebsite ?? "",
      domain: business?.domain ?? "",
      socialLinks: (business?.socialLinks ?? []).join("\n"),
    },
  };

  return db.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        organizationId: membership.organizationId,
        businessId: business?.id,
        createdById: actor.id,
        name: `${businessName} website`,
        status: "DRAFT",
        questionnaire: prefill,
      },
      select: { id: true },
    });
    await recordActivity(tx, {
      type: "PROJECT_CREATED",
      projectId: project.id,
      actorId: actor.id,
      message: "Project started",
    });
    return project;
  });
}

async function loadDraft(actor: Actor, projectId: string) {
  requireClient(actor);
  const access = await assertProjectAccess(db, actor, projectId);
  if (access.status !== "DRAFT" || access.submittedAt) {
    throw conflict("This project has already been submitted.");
  }
  const project = await db.project.findUniqueOrThrow({
    where: { id: projectId },
    select: { questionnaire: true },
  });
  return { access, draft: parseDraft(project.questionnaire) };
}

/** Saves one questionnaire step. Lenient validation — required fields are checked at submission. */
export async function saveQuestionnaireStep(actor: Actor, projectId: string, step: DataStepKey, data: unknown) {
  const { draft } = await loadDraft(actor, projectId);
  const parsed = stepSchema(step).safeParse(data);
  if (!parsed.success) {
    throw validation(undefined, fieldErrorsOf(parsed.error));
  }
  const next = { ...draft, [step]: parsed.data };
  await db.project.update({
    where: { id: projectId },
    data: { questionnaire: next, questionnaireStep: step },
  });
  return next;
}

export async function getQuestionnaire(actor: Actor, projectId: string) {
  const access = await assertProjectAccess(db, actor, projectId);
  const project = await db.project.findUniqueOrThrow({
    where: { id: projectId },
    select: { questionnaire: true, questionnaireStep: true },
  });
  return { project: access, draft: parseDraft(project.questionnaire), step: project.questionnaireStep };
}

// ---------------------------------------------------------------------------
// Client: submission
// ---------------------------------------------------------------------------

/**
 * Submits a draft. In one transaction: updates the business, stores
 * requirements and requested services, creates tasks from templates, stores
 * the system summary, records activity and notifies the studio.
 */
export async function submitProject(actor: Actor, projectId: string) {
  const { access, draft } = await loadDraft(actor, projectId);

  const issues = validateForSubmission(draft);
  if (issues.length) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of issues) fieldErrors[`${issue.step}.${issue.field}`] = [issue.message];
    throw validation("A few required answers are missing.", fieldErrors);
  }

  const requestedSlugs = draft.website?.services ?? [];
  const services = requestedSlugs.length
    ? await db.service.findMany({ where: { slug: { in: requestedSlugs }, published: true } })
    : [];
  const serviceNames = Object.fromEntries(services.map((s) => [s.slug, s.name]));
  // Only keep services that exist so templates and requirements stay accurate.
  const cleanDraft: QuestionnaireDraft = {
    ...draft,
    website: { ...draft.website!, services: services.map((s) => s.slug) },
  };

  const b = cleanDraft.business!;
  const requirementRows = buildRequirementRows(cleanDraft, serviceNames);
  const templates = selectTaskTemplates(cleanDraft);
  const summary = buildProjectSummary(cleanDraft);
  const now = new Date();
  const emails: EmailMessage[] = [];

  const result = await db.$transaction(async (tx) => {
    const businessData = {
      name: b.businessName,
      businessType: b.businessType || null,
      industry: b.industry ?? null,
      description: b.description || null,
      address: b.address || null,
      phone: b.phone || null,
      email: b.email || null,
      existingWebsite: b.existingWebsite || null,
      domain: b.domain || null,
      socialLinks: (b.socialLinks ?? "")
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean),
    };
    let business;
    if (access.businessId) {
      business = await tx.business.update({ where: { id: access.businessId }, data: businessData });
    } else {
      const firstBusiness = (await tx.business.count({ where: { organizationId: access.organizationId } })) === 0;
      business = await tx.business.create({ data: { ...businessData, organizationId: access.organizationId } });
      // The account was named after the person until the business was known.
      if (firstBusiness) await tx.organization.update({ where: { id: access.organizationId }, data: { name: b.businessName } });
    }

    // Guard against double submission inside the transaction.
    const { count } = await tx.project.updateMany({
      where: { id: projectId, status: "DRAFT", submittedAt: null },
      data: {
        status: "NEW",
        submittedAt: now,
        businessId: business.id,
        name: `${b.businessName} website`,
        budgetRange: cleanDraft.final?.budgetRange ?? null,
        timeframe: cleanDraft.final?.timeframe ?? null,
        questionnaire: cleanDraft,
        questionnaireStep: "review",
        lastActivityAt: now,
      },
    });
    if (count !== 1) throw conflict("This project has already been submitted.");

    await tx.projectRequirement.createMany({
      data: requirementRows.map((row, index) => ({ projectId, ...row, sortOrder: index })),
    });
    if (services.length) {
      await tx.projectService.createMany({
        data: services.map((s) => ({ projectId, serviceId: s.id })),
        skipDuplicates: true,
      });
    }
    await tx.projectTask.createMany({
      data: templates.map((t, index) => ({
        projectId,
        title: t.title,
        description: t.description ?? null,
        priority: t.priority,
        templateKey: t.key,
        clientVisible: t.clientVisible ?? true,
        sortOrder: index,
        dueDate: new Date(now.getTime() + t.dueInDays * 86_400_000),
      })),
    });
    await tx.projectBrief.create({
      data: { projectId, aiGenerated: false, generator: "system", content: { ...summary } },
    });

    await recordActivity(tx, {
      type: "PROJECT_SUBMITTED",
      projectId,
      actorId: actor.id,
      message: "Project submitted",
    });
    await recordActivity(tx, {
      type: "TASK_CREATED",
      projectId,
      visibility: "INTERNAL",
      message: `${templates.length} tasks created from templates`,
      metadata: { templateKeys: templates.map((t) => t.key) },
    });

    const admins = await notifyAdmins(tx, {
      type: "PROJECT_SUBMITTED",
      title: "New project request",
      body: `${b.businessName} submitted a website project`,
      href: `/admin/projects/${projectId}`,
    });
    for (const admin of admins) {
      emails.push({
        to: admin.email,
        subject: `New project request: ${b.businessName}`,
        text: `${b.businessName} submitted a new website project.\n\n${process.env.APP_URL ?? ""}/admin/projects/${projectId}`,
      });
    }
    emails.push(emailTemplates.projectReceived(actor.email, b.businessName, projectId));

    return { id: projectId, number: access.number, businessName: b.businessName };
  });

  await Promise.all(emails.map(sendEmail));
  return result;
}

// ---------------------------------------------------------------------------
// Admin: workflow actions
// ---------------------------------------------------------------------------

export async function changeProjectStatus(actor: Actor, projectId: string, to: ProjectStatus, note?: string) {
  requireAdmin(actor);
  return db.$transaction(async (tx) => {
    const project = await assertProjectAccess(tx, actor, projectId);
    const updated = await transitionProjectStatus(tx, project, to, actor.id, note?.trim() || undefined);
    if (to === "LAUNCHED") await completeTemplateTask(tx, projectId, "launch");
    return updated;
  });
}

/** Approves the client's requirements and moves the project into discovery. */
export async function approveRequirements(actor: Actor, projectId: string) {
  requireAdmin(actor);
  await db.$transaction(async (tx) => {
    const project = await assertProjectAccess(tx, actor, projectId);
    if (!["NEW", "REQUIREMENTS_REVIEW", "INFORMATION_REQUIRED"].includes(project.status)) {
      throw conflict("Requirements can only be approved before discovery begins.");
    }
    await tx.project.update({ where: { id: projectId }, data: { requirementsApprovedAt: new Date() } });
    await completeTemplateTask(tx, projectId, "review-requirements");
    await recordActivity(tx, {
      type: "REQUIREMENTS_APPROVED",
      projectId,
      actorId: actor.id,
      message: "Requirements reviewed and approved",
    });
    await transitionProjectStatus(tx, project, "DISCOVERY", actor.id);
  });
}

export const requestInformationSchema = z.object({
  message: z.string().trim().min(10, "Describe what information you need.").max(5000),
});

/** Asks the client for more details: sets INFORMATION_REQUIRED and sends a message. */
export async function requestInformation(actor: Actor, projectId: string, message: string) {
  requireAdmin(actor);
  const parsed = requestInformationSchema.safeParse({ message });
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));

  await db.$transaction(async (tx) => {
    const project = await assertProjectAccess(tx, actor, projectId);
    await transitionProjectStatus(tx, project, "INFORMATION_REQUIRED", actor.id);
    await tx.projectMessage.create({ data: { projectId, senderId: actor.id, body: parsed.data.message } });
    await recordActivity(tx, {
      type: "INFORMATION_REQUESTED",
      projectId,
      actorId: actor.id,
      message: "Additional information requested",
    });
    await notifyProjectClients(tx, projectId, {
      type: "INFORMATION_REQUESTED",
      title: "We need a few more details",
      body: project.name,
      href: `/dashboard/project/${projectId}/messages`,
    });
  });
}

export async function markLaunched(actor: Actor, projectId: string) {
  requireAdmin(actor);
  const recipients = await db.$transaction(async (tx) => {
    const project = await assertProjectAccess(tx, actor, projectId);
    await transitionProjectStatus(tx, project, "LAUNCHED", actor.id);
    await completeTemplateTask(tx, projectId, "launch");
    const members = await tx.organizationMember.findMany({
      where: { organizationId: project.organizationId },
      select: { user: { select: { email: true } } },
    });
    return { emails: members.map((m) => m.user.email), name: project.name };
  });
  await Promise.all(recipients.emails.map((to) => sendEmail(emailTemplates.projectLaunched(to, recipients.name, projectId))));
}

/** The client's in-progress draft, if any. */
export async function findDraftProject(actor: Actor) {
  if (actor.role !== "CLIENT") return null;
  return db.project.findFirst({
    where: { status: "DRAFT", organization: { members: { some: { userId: actor.id } } } },
    select: { id: true, questionnaireStep: true },
    orderBy: { updatedAt: "desc" },
  });
}
