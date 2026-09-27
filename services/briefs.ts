import { db } from "@/db";
import { AppError, conflict } from "@/lib/errors";
import { getAIProvider } from "@/providers/ai";
import { rateLimits } from "@/providers/rate-limit";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, requireAdmin } from "./authz";

/**
 * Generates an AI project brief from the client's requirement rows only.
 * Stored separately from the system summary and marked `aiGenerated`.
 */
export async function generateAIBrief(actor: Actor, projectId: string) {
  requireAdmin(actor);
  const provider = getAIProvider();
  if (!provider) throw conflict("AI briefs aren't configured. Set AI_PROVIDER and AI_API_KEY to enable them.");

  const limit = await rateLimits.ai().limit(`ai:${actor.id}`);
  if (!limit.success) throw new AppError("RATE_LIMITED", "Too many AI requests. Please try again later.");

  await assertProjectAccess(db, actor, projectId);
  const requirements = await db.projectRequirement.findMany({
    where: { projectId, source: "questionnaire" },
    orderBy: { sortOrder: "asc" },
    select: { section: true, label: true, value: true },
  });
  if (!requirements.length) throw conflict("This project has no submitted requirements yet.");

  let brief;
  try {
    brief = await provider.generateProjectBrief({ requirements });
  } catch (error) {
    console.error("[ai] brief generation failed", error instanceof Error ? error.message : "unknown error");
    throw conflict("The AI brief couldn't be generated. Please try again later.");
  }

  return db.$transaction(async (tx) => {
    const saved = await tx.projectBrief.create({
      data: { projectId, aiGenerated: true, generator: `${provider.name}:${provider.model}`, content: brief },
    });
    await recordActivity(tx, {
      type: "PROJECT_UPDATED",
      projectId,
      actorId: actor.id,
      visibility: "INTERNAL",
      message: "AI project brief generated",
    });
    return saved;
  });
}
