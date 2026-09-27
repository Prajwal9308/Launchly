import type { Metadata } from "next";
import { CheckSquare } from "lucide-react";
import { TaskItem } from "@/components/project/task-item";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { loadProjectDetail } from "@/server/loaders";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Tasks" };

export default async function ClientTasksPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const project = await orNotFound(loadProjectDetail(actor, projectId));
  const done = project.tasks.filter((t) => t.status === "DONE").length;

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        {done} of {project.tasks.length} tasks complete. Tasks are managed by the studio and update as work progresses.
      </p>
      <Card className="overflow-hidden">
        {project.tasks.length ? (
          <div className="divide-y divide-border">
            {project.tasks.map((t) => (
              <TaskItem key={t.id} task={t} />
            ))}
          </div>
        ) : (
          <EmptyState icon={CheckSquare} title="No tasks yet" description="Tasks appear here once we've reviewed your project." />
        )}
      </Card>
    </div>
  );
}
