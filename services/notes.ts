import { z } from "zod";
import { db } from "@/db";
import { validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, requireAdmin } from "./authz";

/** Internal notes are studio-only. Every function here requires an admin. */
export const noteSchema = z.object({
  body: z.string().trim().min(1, "Write a note.").max(10_000),
});

export async function addInternalNote(actor: Actor, projectId: string, input: z.input<typeof noteSchema>) {
  requireAdmin(actor);
  const parsed = noteSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  return db.$transaction(async (tx) => {
    await assertProjectAccess(tx, actor, projectId);
    const note = await tx.internalNote.create({ data: { projectId, authorId: actor.id, body: parsed.data.body } });
    await recordActivity(tx, {
      type: "NOTE_ADDED",
      projectId,
      actorId: actor.id,
      visibility: "INTERNAL",
      message: "Internal note added",
    });
    return note;
  });
}

export async function listInternalNotes(actor: Actor, projectId: string) {
  requireAdmin(actor);
  await assertProjectAccess(db, actor, projectId);
  return db.internalNote.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { firstName: true, lastName: true } } },
  });
}
