import { redirect } from "next/navigation";
import { requireActor } from "@/server/session";

/** Sends users to the right home after login. */
export default async function PostLoginPage() {
  const actor = await requireActor();
  redirect(actor.role === "ADMIN" ? "/admin" : "/dashboard");
}
