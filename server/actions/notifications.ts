"use server";

import { revalidatePath } from "next/cache";
import { markAllNotificationsRead, markNotificationRead } from "@/services/notifications";
import { withActor } from "../action";

export async function markNotificationReadAction(id: string) {
  return withActor(async (actor) => {
    await markNotificationRead(actor, id);
    revalidatePath("/", "layout");
  });
}

export async function markAllNotificationsReadAction() {
  return withActor(async (actor) => {
    await markAllNotificationsRead(actor);
    revalidatePath("/", "layout");
  });
}
