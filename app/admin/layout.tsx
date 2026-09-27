import type { Metadata } from "next";
import { AppShell } from "@/components/app/app-shell";
import { getSiteSettings } from "@/services/catalog";
import { listNotifications } from "@/services/notifications";
import { toNotificationViews } from "@/server/serialize";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: { default: "Overview", template: "%s · Studio" }, robots: { index: false } };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const actor = await requireAdminActor();
  const [notifications, settings] = await Promise.all([listNotifications(actor), getSiteSettings()]);
  return (
    <AppShell
      variant="admin"
      businessName={settings.businessName}
      subtitle="Studio"
      user={actor}
      notifications={{ items: toNotificationViews(notifications.items), unread: notifications.unread }}
    >
      {children}
    </AppShell>
  );
}
