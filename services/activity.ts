import type { ActivityType, ActivityVisibility, Prisma, Tx } from "@/db";
import { db } from "@/db";
import type { Actor } from "./actor";
import { assertProjectAccess, projectScope, requireAdmin } from "./authz";

export interface ActivityInput {
  type: ActivityType;
  message: string;
  projectId?: string | null;
  actorId?: string | null;
  visibility?: ActivityVisibility;
  metadata?: Prisma.InputJsonValue;
}

/** Records an activity event and bumps the project's last-activity time. */
export async function recordActivity(tx: Tx, input: ActivityInput) {
  await tx.activityEvent.create({
    data: {
      type: input.type,
      message: input.message,
      projectId: input.projectId ?? null,
      actorId: input.actorId ?? null,
      visibility: input.visibility ?? "CLIENT",
      metadata: input.metadata,
    },
  });
  if (input.projectId) {
    await tx.project.update({ where: { id: input.projectId }, data: { lastActivityAt: new Date() } });
  }
}

const activityInclude = {
  actor: { select: { id: true, firstName: true, lastName: true, role: true } },
  project: { select: { id: true, name: true, number: true } },
} satisfies Prisma.ActivityEventInclude;

export type ActivityWithRelations = Prisma.ActivityEventGetPayload<{ include: typeof activityInclude }>;

/** Project activity. Clients only see client-visible events. */
export async function listProjectActivity(actor: Actor, projectId: string, take = 50) {
  await assertProjectAccess(db, actor, projectId);
  return db.activityEvent.findMany({
    where: { projectId, ...(actor.role === "ADMIN" ? {} : { visibility: "CLIENT" }) },
    include: activityInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

/** Recent activity across all projects the actor can access. */
export async function listRecentActivity(actor: Actor, take = 10) {
  return db.activityEvent.findMany({
    where:
      actor.role === "ADMIN"
        ? {}
        : { visibility: "CLIENT", project: projectScope(actor) },
    include: activityInclude,
    orderBy: { createdAt: "desc" },
    take,
  });
}

export async function listAllActivityPage(actor: Actor, page: number, pageSize = 30) {
  requireAdmin(actor);
  const [items, total] = await Promise.all([
    db.activityEvent.findMany({
      include: activityInclude,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    db.activityEvent.count(),
  ]);
  return { items, total, page, pageSize };
}
