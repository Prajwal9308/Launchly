import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/db";
import type { Actor } from "@/services/actor";
import { auth } from "./auth";

/**
 * Resolves the current user from the session cookie AND the database, so a
 * deleted user or changed role takes effect immediately.
 */
export const getActor = cache(async (): Promise<Actor | null> => {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = await db.user.findUnique({
    where: { id },
    select: { id: true, role: true, email: true, firstName: true, lastName: true },
  });
  return user;
});

export async function requireActor(callbackUrl?: string): Promise<Actor> {
  const actor = await getActor();
  if (!actor) redirect(callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login");
  return actor;
}

/** Studio pages. Clients are sent to their own dashboard. */
export async function requireAdminActor(): Promise<Actor> {
  const actor = await requireActor("/admin");
  if (actor.role !== "ADMIN") redirect("/dashboard");
  return actor;
}

/** Client pages. Admins are sent to the studio dashboard. */
export async function requireClientActor(callbackUrl = "/dashboard"): Promise<Actor> {
  const actor = await requireActor(callbackUrl);
  if (actor.role !== "CLIENT") redirect("/admin");
  return actor;
}
