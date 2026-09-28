import Link from "next/link";
import { IconTile, Icons } from "@/components/ui/icons";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { PipelineChart } from "@/components/admin/pipeline-chart";
import { StatCard } from "@/components/admin/stat-card";
import { ActivityList } from "@/components/project/activity-list";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PriorityBadge, ProjectStatusBadge } from "@/components/ui/status-badge";
import { formatDate, formatRelative } from "@/lib/format";
import { formatProjectNumber } from "@/lib/utils";
import { listRecentActivity } from "@/services/activity";
import { getAdminOverview, getPipeline } from "@/services/project-queries";
import { requireAdminActor } from "@/server/session";

export default async function AdminOverviewPage() {
  const actor = await requireAdminActor();
  const [overview, activity, pipeline] = await Promise.all([getAdminOverview(actor), listRecentActivity(actor, 10), getPipeline(actor)]);
  const m = overview.metrics;
  const noData = Object.values(m).every((v) => v === 0);

  return (
    <div className="space-y-8">
      <PageHeader icon={Icons.dashboard} title="Overview" description="What needs attention across your projects." />

      {/* Primary: pipeline (level 5). Attention metrics (level 4). Supporting metrics recessed (level 3). */}
      <section aria-label="Metrics" className="grid gap-4 lg:grid-cols-12">
        <Card level="elevated" className="relative overflow-hidden lg:col-span-8 lg:row-span-3">
          <CardContent className="relative">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-faint">
                  <Icons.pipeline className="text-accent" aria-hidden /> Pipeline
                </p>
                <p className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-bold tabular-nums tracking-tight">{m.active}</span>
                  <span className="text-sm text-muted">active project{m.active === 1 ? "" : "s"}</span>
                </p>
              </div>
              <Link href="/admin/projects?status=active" className="group inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline">
                View active projects
                <Icons.forward className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden />
              </Link>
            </div>
            <div className="mt-8">
              <PipelineChart stages={pipeline} />
            </div>
          </CardContent>
        </Card>
        <div className="lg:col-span-4">
          <StatCard label="New project requests" value={m.newRequests} href="/admin/projects?status=NEW" emphasis icon={Icons.newProject} />
        </div>
        <div className="lg:col-span-4">
          <StatCard label="Awaiting client" value={m.awaitingClient} href="/admin/projects?status=awaiting-client" icon={Icons.waiting} />
        </div>
        <div className="lg:col-span-4">
          <StatCard label="Awaiting approval" value={m.awaitingApproval} icon={Icons.approved} />
        </div>
        <div className="grid grid-cols-3 gap-4 lg:col-span-12">
          <StatCard label="In development" value={m.inDevelopment} href="/admin/projects?status=DEVELOPMENT" recessed icon={Icons.develop} />
          <StatCard label="Completed projects" value={m.completed} recessed icon={Icons.success} />
          <StatCard label="New leads" value={m.newLeads} href="/admin/leads?status=NEW" recessed icon={Icons.leads} />
        </div>
      </section>
      {noData && <p className="text-sm text-muted">No data yet. Metrics will appear as clients submit projects.</p>}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="flex items-center gap-2.5 text-sm font-semibold">
              <IconTile icon={Icons.project} size="sm" /> Recent projects
            </h2>
            <Link href="/admin/projects" className="text-xs font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          {overview.recentProjects.length ? (
            <ul className="divide-y divide-border">
              {overview.recentProjects.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/projects/${p.id}`} className="group flex items-center gap-4 px-5 py-3 transition-colors hover:bg-subtle">
                    <IconTile icon={Icons.project} size="sm" interactive />
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
            <EmptyState icon={Icons.project} title="No active projects" description="New client projects will appear here." />
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <h2 className="flex items-center gap-2.5 text-sm font-semibold">
              <IconTile icon={Icons.due} size="sm" /> Upcoming tasks
            </h2>
            <Link href="/admin/tasks" className="text-xs font-medium text-accent hover:underline">
              All tasks
            </Link>
          </div>
          {overview.upcomingTasks.length ? (
            <ul className="divide-y divide-border">
              {overview.upcomingTasks.map((t) => (
                <li key={t.id}>
                  <Link href={`/admin/projects/${t.project.id}/tasks`} className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-subtle">
                    <Icons.upcoming className="shrink-0 text-faint transition-colors group-hover:text-accent" aria-hidden />
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
            <EmptyState icon={Icons.tasks} title="No open tasks" description="Tasks are created automatically when clients submit projects." compact />
          )}
        </Card>
      </div>

      <Card level="recessed">
        <CardContent>
          <SectionTitle
            icon={Icons.activity}
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
