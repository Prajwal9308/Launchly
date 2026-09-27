import { z } from "zod";
import { db } from "@/db";
import { forbidden, notFound, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, isUuid, requireAdmin } from "./authz";

export const requirementSchema = z.object({
  section: z.string().trim().min(1, "Choose a section.").max(60),
  label: z.string().trim().min(1, "Add a short label.").max(120),
  value: z.string().trim().min(1, "Describe the requirement.").max(5000),
});

/** Studio adds a requirement discovered after submission (e.g. on a call). */
export async function addRequirement(actor: Actor, projectId: string, input: z.input<typeof requirementSchema>) {
  requireAdmin(actor);
  const parsed = requirementSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  return db.$transaction(async (tx) => {
    await assertProjectAccess(tx, actor, projectId);
    const last = await tx.projectRequirement.aggregate({ where: { projectId }, _max: { sortOrder: true } });
    const row = await tx.projectRequirement.create({
      data: { projectId, ...parsed.data, source: "admin", sortOrder: (last._max.sortOrder ?? 0) + 1 },
    });
    await recordActivity(tx, {
      type: "PROJECT_UPDATED",
      projectId,
      actorId: actor.id,
      message: `Requirement added: ${row.label}`,
    });
    return row;
  });
}

/** Only studio-added requirements can be removed; client answers are preserved. */
export async function deleteRequirement(actor: Actor, requirementId: string) {
  requireAdmin(actor);
  const row = isUuid(requirementId) ? await db.projectRequirement.findUnique({ where: { id: requirementId } }) : null;
  if (!row) throw notFound("This requirement could not be found.");
  if (row.source !== "admin") throw forbidden("Client-provided answers can't be deleted.");
  await db.projectRequirement.delete({ where: { id: requirementId } });
}
