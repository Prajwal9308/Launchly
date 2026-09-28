import type { NotificationType, Tx } from "@/db";
import { db } from "@/db";
import { studioEmailOverride } from "@/providers/email";
import { isUuid } from "./authz";
import type { Actor } from "./actor";

interface NotificationInput {
  type: NotificationType;
  title: string;
  body?: string;
  href?: string;
}

export interface Recipient {
  id: string;
  email: string;
  firstName: string;
}

/**
 * Notifies every admin in-app. Returns who should receive the matching email:
 * the single studio inbox (STUDIO_NOTIFY_EMAIL) when configured, otherwise each admin.
 */
export async function notifyAdmins(tx: Tx, input: NotificationInput, excludeUserId?: string): Promise<Recipient[]> {
  const admins = await tx.user.findMany({
    where: { role: "ADMIN", ...(excludeUserId ? { id: { not: excludeUserId } } : {}) },
    select: { id: true, email: true, firstName: true },
  });
  if (admins.length) {
    await tx.notification.createMany({ data: admins.map((a) => ({ userId: a.id, ...input })) });
  }
  const studioInbox = studioEmailOverride();
  return studioInbox ? [{ id: "studio", email: studioInbox, firstName: "Studio" }] : admins;
}

/** Notifies every client member of the project's organization. */
export async function notifyProjectClients(
  tx: Tx,
  projectId: string,
  input: NotificationInput,
  excludeUserId?: string,
): Promise<Recipient[]> {
  const project = await tx.project.findUnique({
    where: { id: projectId },
    select: {
      organization: {
        select: { members: { select: { user: { select: { id: true, email: true, firstName: true, role: true } } } } },
      },
    },
  });
  const recipients = (project?.organization.members ?? [])
    .map((m) => m.user)
    .filter((u) => u.role === "CLIENT" && u.id !== excludeUserId);
  if (recipients.length) {
    await tx.notification.createMany({ data: recipients.map((u) => ({ userId: u.id, ...input })) });
  }
  return recipients;
}

export async function listNotifications(actor: Actor, take = 15) {
  const [items, unread] = await Promise.all([
    db.notification.findMany({ where: { userId: actor.id }, orderBy: { createdAt: "desc" }, take }),
    db.notification.count({ where: { userId: actor.id, readAt: null } }),
  ]);
  return { items, unread };
}

export async function markNotificationRead(actor: Actor, notificationId: string) {
  if (!isUuid(notificationId)) return;
  // Scoped by userId so users can only mark their own notifications.
  await db.notification.updateMany({
    where: { id: notificationId, userId: actor.id, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function markAllNotificationsRead(actor: Actor) {
  await db.notification.updateMany({ where: { userId: actor.id, readAt: null }, data: { readAt: new Date() } });
}
