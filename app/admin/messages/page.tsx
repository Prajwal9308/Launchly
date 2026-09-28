import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatRelative } from "@/lib/format";
import { cn } from "@/lib/utils";
import { listMessageThreads } from "@/services/messages";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Messages" };

export default async function AdminInboxPage() {
  const actor = await requireAdminActor();
  const threads = await listMessageThreads(actor);
  return (
    <div>
      <PageHeader title="Messages" description="Project conversations, most recent first." />
      <Card className="overflow-hidden">
        {threads.length === 0 ? (
          <EmptyState icon={MessageSquare} title="No messages yet" description="Client conversations appear here." />
        ) : (
          <ul className="divide-y divide-border">
            {threads.map((t) => (
              <li key={t.id}>
                <Link href={`/admin/projects/${t.id}/messages`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-canvas">
                  <span aria-hidden className={cn("mt-2 size-2 shrink-0 rounded-full", t.unread ? "bg-accent" : "bg-transparent")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className={cn("truncate text-sm", t.unread ? "font-semibold" : "font-medium")}>{t.business?.name ?? t.name}</p>
                      <span className="shrink-0 text-xs text-faint">{t.latest ? formatRelative(t.latest.createdAt) : ""}</span>
                    </div>
                    {t.latest && (
                      <p className="mt-0.5 truncate text-sm text-muted">
                        <span className="text-faint">{t.latest.sender ? `${t.latest.sender.firstName}: ` : ""}</span>
                        {t.latest.body}
                      </p>
                    )}
                  </div>
                  {t.unread > 0 && (
                    <span className="rounded-full bg-accent px-1.5 text-[11px] font-semibold leading-5 text-accent-foreground">
                      {t.unread}
                      <span className="sr-only"> unread</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
