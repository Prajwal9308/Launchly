import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { getSiteSettings } from "@/services/catalog";
import { listNotifications } from "@/services/notifications";
import { getClientBadges, listClientProjects } from "@/services/project-queries";
import { toNotificationViews } from "@/server/serialize";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: { default: "Dashboard", template: "%s · Client portal" }, robots: { index: false } };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireClientActor();
  const [notifications, projects, badges, settings] = await Promise.all([
    listNotifications(actor),
    listClientProjects(actor),
    getClientBadges(actor),
    getSiteSettings(),
  ]);
  const current = projects.find((p) => !["CANCELLED", "COMPLETED"].includes(p.status)) ?? projects[0];

  return (
    <AppShell
      variant="client"
      businessName={settings.businessName}
      subtitle="Client portal"
      user={actor}
      notifications={{ items: toNotificationViews(notifications.items), unread: notifications.unread }}
      defaultProjectId={current?.id ?? null}
      unreadMessages={badges.unreadMessages}
      reviewsAwaiting={badges.reviewsAwaiting}
    >
      {children}
    </AppShell>
  );
}
