import { ArrowRight, FileStack, FolderPlus, MessageSquare } from "lucide-react";
import Link from "next/link";
import { Greeting } from "@/components/client/greeting";
import { SectionTitle } from "@/components/app/page-header";
import { ActionCenter } from "@/components/project/action-center";
import { ActivityList } from "@/components/project/activity-list";
import { ProjectCard } from "@/components/project/project-card";
import { ProjectProgress } from "@/components/project/project-progress";
import { ProgressRing } from "@/components/project/progress-ring";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { CLIENT_STATUS_DESCRIPTIONS, STATUS_LABELS } from "@/domain/project-status";
import { formatRelative } from "@/lib/format";
import { formatFileSize, formatProjectNumber } from "@/lib/utils";
import { listRecentActivity } from "@/services/activity";
import { getClientDashboard } from "@/services/project-queries";
import { requireClientActor } from "@/server/session";

export default async function ClientDashboardPage() {
  const actor = await requireClientActor();
  const data = await getClientDashboard(actor);
  const businessName = data.organization?.businesses[0]?.name ?? data.organization?.name;

  if (!data.current) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">
            <Greeting firstName={actor.firstName} />
          </h1>
          {businessName && <p className="mt-1 text-sm text-muted">{businessName}</p>}
        </div>
        <Card>
          <EmptyState
            icon={FolderPlus}
            title="No projects yet"
            description="Your projects will appear here once you start one. The questionnaire takes about 10 minutes, and your progress is saved as you go."
            action={
              <Button asChild>
                <Link href="/start-project">Start a Project</Link>
              </Button>
            }
          />
        </Card>
      </div>
    );
  }

  const project = data.current;
  const activity = await listRecentActivity(actor, 6);
  const complete = project.phases.filter((p) => p.state === "complete");
  const current = project.phases.find((p) => p.state === "current");
  const upcoming = project.phases.filter((p) => p.state === "upcoming");
  const projectHref = `/dashboard/project/${project.id}`;
  const otherProjects = data.projects.filter((p) => p.id !== project.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-muted">{project.business?.name ?? businessName}</p>
        <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">
          <Greeting firstName={actor.firstName} />
        </h1>
      </div>

      <ActionCenter action={project.clientAction} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Current project — the primary surface (elevated) */}
        <Card level="elevated" className="relative overflow-hidden">
          <CardContent className="relative space-y-7 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-faint">{formatProjectNumber(project.number)}</p>
                <h2 className="mt-0.5 text-base font-semibold">{project.name}</h2>
              </div>
              <ProjectStatusBadge status={project.status} />
            </div>

            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
              <ProgressRing value={project.progress} label="complete" />
              <div className="text-center sm:text-left">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">Now</p>
                <p className="mt-1 text-2xl font-semibold">{current ? current.label : STATUS_LABELS[project.status]}</p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{CLIENT_STATUS_DESCRIPTIONS[project.status]}</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-faint">Completed</p>
                {complete.length ? (
                  <ProjectProgress phases={complete} />
                ) : (
                  <p className="text-sm text-faint">Nothing yet</p>
                )}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-faint">Current</p>
                {current ? <ProjectProgress phases={[current]} onHold={project.status === "ON_HOLD"} /> : <p className="text-sm text-muted">All phases complete</p>}
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-faint">Next</p>
                {upcoming.length ? <ProjectProgress phases={upcoming.slice(0, 5)} /> : <p className="text-sm text-faint">—</p>}
              </div>
            </div>

            <Button asChild variant="secondary">
              <Link href={projectHref}>
                View Project <ArrowRight aria-hidden />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardContent>
            <SectionTitle
              action={
                <Link href={`${projectHref}/messages`} className="text-xs font-medium text-accent hover:underline">
                  Open messages
                </Link>
              }
            >
              Recent messages
            </SectionTitle>
            {data.recentMessages?.length ? (
              <ul className="space-y-3">
                {data.recentMessages.map((m) => (
                  <li key={m.id} className="rounded-lg border border-border p-3">
                    <p className="flex items-center justify-between gap-2 text-xs text-faint">
                      <span className="font-medium text-muted">
                        {m.sender ? `${m.sender.firstName} ${m.sender.lastName}` : "Studio"}
                      </span>
                      <span>{formatRelative(m.createdAt)}</span>
                    </p>
                    <p className="mt-1 line-clamp-2 text-sm">{m.body}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState icon={MessageSquare} title="No messages yet" description="Messages about your project will appear here." compact />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card level="recessed">
          <CardContent>
            <SectionTitle
              action={
                <Link href={`${projectHref}/activity`} className="text-xs font-medium text-accent hover:underline">
                  View all
                </Link>
              }
            >
              Recent activity
            </SectionTitle>
            <ActivityList events={activity} />
          </CardContent>
        </Card>
        <Card level="recessed">
          <CardContent>
            <SectionTitle
              action={
                <Link href={`${projectHref}/files`} className="text-xs font-medium text-accent hover:underline">
                  Manage files
                </Link>
              }
            >
              Files
            </SectionTitle>
            {data.recentFiles?.length ? (
              <ul className="divide-y divide-border">
                {data.recentFiles.map((f) => (
                  <li key={f.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                    <a href={`/api/files/${f.id}`} target="_blank" rel="noopener" className="truncate hover:underline">
                      {f.originalName}
                    </a>
                    <span className="shrink-0 text-xs text-faint">{formatFileSize(f.size)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState
                icon={FileStack}
                title="No files yet"
                description="Upload your logo, photos and documents so we can use them in your website."
                compact
                action={
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`${projectHref}/files`}>Upload files</Link>
                  </Button>
                }
              />
            )}
          </CardContent>
        </Card>
      </div>

      {otherProjects.length > 0 && (
        <section>
          <SectionTitle>Other projects</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((p) => (
              <ProjectCard key={p.id} project={p} href={p.status === "DRAFT" ? `/start-project/${p.id}` : `/dashboard/project/${p.id}`} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
