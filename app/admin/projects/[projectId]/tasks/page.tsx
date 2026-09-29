import { Icons } from "@/components/ui/icons";
import { AdminTaskRow } from "@/components/admin/task-row";
import { TaskDialog } from "@/components/admin/task-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listAdmins } from "@/services/tasks";
import { orNotFound } from "@/server/guards";
import { loadProjectDetail } from "@/server/loaders";
import { requireAdminActor } from "@/server/session";

export default async function AdminProjectTasksPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const [project, team] = await Promise.all([orNotFound(loadProjectDetail(actor, projectId)), listAdmins(actor)]);
  const open = project.tasks.filter((t) => t.status !== "DONE");
  const done = project.tasks.filter((t) => t.status === "DONE");
  const newTask = (
    <TaskDialog
      projectId={projectId}
      team={team}
      trigger={
        <Button size="sm">
          <Icons.add /> New Task
        </Button>
      }
    />
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {open.length} open · {done.length} done
        </p>
        {newTask}
      </div>
      {project.tasks.length === 0 ? (
        <Card>
          <EmptyState icon={Icons.tasks} title="No tasks yet" description="Tasks are created automatically when the client submits the questionnaire." action={newTask} />
        </Card>
      ) : (
        <>
          <Card className="divide-y divide-border overflow-hidden">
            {open.length ? open.map((t) => <AdminTaskRow key={t.id} task={t} projectId={projectId} team={team} />) : <p className="px-4 py-6 text-sm text-muted">All tasks are done.</p>}
          </Card>
          {done.length > 0 && (
            <section>
              <h2 className="mb-2 text-sm font-semibold text-muted">Completed</h2>
              <Card className="divide-y divide-border overflow-hidden">
                {done.map((t) => (
                  <AdminTaskRow key={t.id} task={t} projectId={projectId} team={team} />
                ))}
              </Card>
            </section>
          )}
        </>
      )}
    </div>
  );
}
