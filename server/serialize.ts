import type { NotificationView } from "@/components/app/notification-bell";

export function toNotificationViews(items: { id: string; title: string; body: string | null; href: string | null; readAt: Date | null; createdAt: Date }[]): NotificationView[] {
  return items.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    href: n.href,
    readAt: n.readAt?.toISOString() ?? null,
    createdAt: n.createdAt.toISOString(),
  }));
}
