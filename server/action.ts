import "server-only";
import { unstable_rethrow } from "next/navigation";
import { isAppError, unauthenticated } from "@/lib/errors";
import type { Actor } from "@/services/actor";
import { getActor } from "./session";

export type ActionResult<T = unknown> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Runs a server action body and converts failures into a safe result.
 * Known AppErrors keep their message; anything else becomes a generic error
 * and is logged server-side without leaking details to the browser.
 */
export async function runAction<T>(fn: () => Promise<T>, message?: string): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    return { ok: true, data, message };
  } catch (error) {
    unstable_rethrow(error);
    if (isAppError(error)) return { ok: false, error: error.message, fieldErrors: error.fieldErrors };
    console.error("[action] unexpected error", error instanceof Error ? error.message : error);
    return { ok: false, error: "Something went wrong. We couldn't complete your request. Please try again." };
  }
}

/** Like runAction, but requires a signed-in user and passes it to the body. */
export async function withActor<T>(fn: (actor: Actor) => Promise<T>, message?: string): Promise<ActionResult<T>> {
  return runAction(async () => {
    const actor = await getActor();
    if (!actor) throw unauthenticated();
    return fn(actor);
  }, message);
}
