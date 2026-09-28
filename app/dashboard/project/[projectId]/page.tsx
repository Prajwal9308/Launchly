import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { SectionTitle } from "@/components/app/page-header";
import { ActionCenter } from "@/components/project/action-center";
import { ActivityList } from "@/components/project/activity-list";
import { ProjectProgress } from "@/components/project/project-progress";
import { TaskItem } from "@/components/project/task-item";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CLIENT_STATUS_DESCRIPTIONS } from "@/domain/project-status";
import { formatDate } from "@/lib/format";
import { listProjectActivity } from "@/services/activity";
import { loadProjectDetail } from "@/server/loaders";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export default async function ClientProjectOverview({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const [project, activity] = await Promise.all([
    orNotFound(loadProjectDetail(actor, projectId)),
    orNotFound(listProjectActivity(actor, projectId, 8)),
  ]);
  const openTasks = project.tasks.filter((t) => t.status !== "DONE").slice(0, 4);
  const base = `/dashboard/project/${project.id}`;

  return (
    <div className="space-y-6">
      <ActionCenter action={project.clientAction} />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardContent>
            <SectionTitle icon={Icons.timeline}>Timeline</SectionTitle>
            <p className="mb-4 text-sm text-muted">{CLIENT_STATUS_DESCRIPTIONS[project.status]}</p>
            <div className="mb-5 flex items-center gap-3">
              <Progress value={project.progress} className="flex-1" label="Project progress" />
              <span className="text-sm tabular-nums text-muted">{project.progress}%</span>
            </div>
            <ProjectProgress phases={project.phases} onHold={project.status === "ON_HOLD"} />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <Card>
            <CardContent>
              <SectionTitle
                icon={Icons.tasks}
                action={
                  <Link href={`${base}/tasks`} className="text-xs font-medium text-accent hover:underline">
                    All tasks
                  </Link>
                }
              >
                What we&apos;re working on
              </SectionTitle>
              {openTasks.length ? (
                <div className="-mx-4 divide-y divide-border">
                  {openTasks.map((t) => (
                    <TaskItem key={t.id} task={t} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">All tasks are complete.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <SectionTitle icon={Icons.info}>Project details</SectionTitle>
              <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-faint">Business</dt>
                  <dd>{project.business?.name ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-faint">Submitted</dt>
                  <dd>{formatDate(project.submittedAt)}</dd>
                </div>
                <div>
                  <dt className="text-faint">Services</dt>
                  <dd>{project.services.map((s) => s.service.name).join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt className="text-faint">Timeframe</dt>
                  <dd>{project.timeframe ?? "—"}</dd>
                </div>
                {project.launchedAt && (
                  <div>
                    <dt className="text-faint">Launched</dt>
                    <dd>{formatDate(project.launchedAt)}</dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card>
        <CardContent>
          <SectionTitle
            icon={Icons.activity}
            action={
              <Link href={`${base}/activity`} className="text-xs font-medium text-accent hover:underline">
                View all
              </Link>
            }
          >
            Recent activity
          </SectionTitle>
          <ActivityList events={activity} />
        </CardContent>
      </Card>
    </div>
  );
}
