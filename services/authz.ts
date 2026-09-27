import type { Prisma, Tx } from "@/db";
import { forbidden, notFound } from "@/lib/errors";
import { isAdmin, type Actor } from "./actor";

/**
 * Authorization policies. Every service that touches project data calls one
 * of these first. IDs from the browser are never trusted on their own.
 */

export function requireAdmin(actor: Actor) {
  if (!isAdmin(actor)) throw forbidden();
}

export function requireClient(actor: Actor) {
  if (actor.role !== "CLIENT") throw forbidden("This action is only available to clients.");
}

/** Prisma filter limiting projects to those the actor may see. */
export function projectScope(actor: Actor): Prisma.ProjectWhereInput {
  if (isAdmin(actor)) return {};
  return { organization: { members: { some: { userId: actor.id } } } };
}

const PROJECT_NOT_FOUND = "This project could not be found, or you don't have permission to view it.";

/**
 * Loads a project the actor is allowed to access. Clients receive the same
 * "not found" error for projects that don't exist and projects they don't own,
 * so project IDs can't be probed.
 */
export async function assertProjectAccess(tx: Tx, actor: Actor, projectId: string) {
  if (!isUuid(projectId)) throw notFound(PROJECT_NOT_FOUND);
  const project = await tx.project.findFirst({
    where: { id: projectId, ...projectScope(actor) },
    select: {
      id: true,
      number: true,
      name: true,
      status: true,
      statusBeforeHold: true,
      organizationId: true,
      businessId: true,
      submittedAt: true,
    },
  });
  if (!project) throw notFound(PROJECT_NOT_FOUND);
  return project;
}

export type AccessibleProject = Awaited<ReturnType<typeof assertProjectAccess>>;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}
