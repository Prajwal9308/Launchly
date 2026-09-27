import type { Role } from "@/db/enums";

/** The authenticated user performing an action. Resolved server-side only. */
export interface Actor {
  id: string;
  role: Role;
  email: string;
  firstName: string;
  lastName: string;
}

export const isAdmin = (actor: Actor) => actor.role === "ADMIN";
