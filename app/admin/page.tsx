import Link from "next/link";
import { CheckSquare, FolderKanban } from "lucide-react";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { ActivityList } from "@/components/project/activity-list";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge, ProjectStatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatRelative } from "@/lib/format";
import { formatProjectNumber } from "@/lib/utils";
import { listRecentActivity } from "@/services/activity";
import { getAdminOverview } from "@/services/project-queries";
import { requireAdminActor } from "@/server/session";

export default async function AdminOverviewPage() {
  const actor = await requireAdminActor();
  const [overview, activity] = await Promise.all([getAdminOverview(actor), listRecentActivity(actor, 10)]);
  const m = overview.metrics;
  const noData = Object.values(m).every((v) => v === 0);

  return (
    <div className="space-y-8">
      <PageHeader title="Overview" description="What needs attention across your projects." />

      <section aria-label="Metrics" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Active projects" value={m.active} href="/admin/projects?status=active" />
        <StatCard label="New project requests" value={m.newRequests} href="/admin/projects?status=NEW" />
        <StatCard label="Awaiting client" value={m.awaitingClient} href="/admin/projects?status=awaiting-client" />
        <StatCard label="In development" value={m.inDevelopment} href="/admin/projects?status=DEVELOPMENT" />
        <StatCard label="Awaiting approval" value={m.awaitingApproval} />
        <StatCard label="Completed projects" value={m.completed} />
      </section>
      {noData && <p className="text-sm text-muted">No data yet. Metrics will appear as clients submit projects.</p>}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Recent projects</h2>
            <Link href="/admin/projects" className="text-xs font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          {overview.recentProjects.length ? (
            <ul className="divide-y divide-border">
              {overview.recentProjects.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/projects/${p.id}`} className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-canvas">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{p.business?.name ?? p.name}</p>
                      <p className="text-xs text-faint">
                        {formatProjectNumber(p.number)} · Active {formatRelative(p.lastActivityAt)}
                      </p>
                    </div>
                    <ProjectStatusBadge status={p.status} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={FolderKanban} title="No active projects" description="New client projects will appear here." />
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="text-sm font-semibold">Upcoming tasks</h2>
            <Link href="/admin/tasks" className="text-xs font-medium text-accent hover:underline">
              All tasks
            </Link>
          </div>
          {overview.upcomingTasks.length ? (
            <ul className="divide-y divide-border">
              {overview.upcomingTasks.map((t) => (
                <li key={t.id}>
                  <Link href={`/admin/projects/${t.project.id}/tasks`} className="flex items-center gap-3 px-5 py-3 hover:bg-canvas">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{t.title}</p>
                      <p className="truncate text-xs text-faint">
                        {t.project.business?.name ?? t.project.name}
                        {t.dueDate && ` · Due ${formatDate(t.dueDate)}`}
                      </p>
                    </div>
                    <PriorityBadge priority={t.priority} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState icon={CheckSquare} title="No open tasks" description="Tasks are created automatically when clients submit projects." compact />
          )}
        </Card>
      </div>

      <Card>
        <CardContent>
          <SectionTitle
            action={
              <Link href="/admin/activity" className="text-xs font-medium text-accent hover:underline">
                View all
              </Link>
            }
          >
            Recent activity
          </SectionTitle>
          <ActivityList events={activity} showProject projectHref={(id) => `/admin/projects/${id}`} showVisibility emptyText="No data yet." />
        </CardContent>
      </Card>
    </div>
  );
}
