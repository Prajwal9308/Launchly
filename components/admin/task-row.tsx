"use client";

import { Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TaskItem, type TaskView } from "@/components/project/task-item";
import { deleteTaskAction, setTaskStatusAction } from "@/server/actions/admin";
import { TaskDialog } from "./task-dialog";
import { useServerAction } from "./use-action";

/** Admin task row: one-click complete, edit, change status, delete. */
export function AdminTaskRow({ task, projectId, team }: { task: TaskView; projectId: string; team: { id: string; firstName: string; lastName: string }[] }) {
  const { pending, run } = useServerAction();
  const done = task.status === "DONE";
  return (
    <div className="flex items-start gap-1 pr-3">
      <div className="min-w-0 flex-1">
        <TaskItem
          task={task}
          showPriority
          action={
            <Checkbox
              checked={done}
              disabled={pending}
              aria-label={done ? `Mark “${task.title}” as not done` : `Complete “${task.title}”`}
              onCheckedChange={(v) => run(() => setTaskStatusAction(task.id, v === true ? "DONE" : "TODO"))}
            />
          }
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="mt-2" aria-label={`Actions for ${task.title}`}>
            <Icons.more />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <TaskDialog
            projectId={projectId}
            team={team}
            initial={{
              id: task.id,
              title: task.title,
              description: task.description ?? "",
              status: task.status,
              priority: task.priority,
              dueDate: task.dueDate ? task.dueDate.toISOString().slice(0, 10) : "",
              assigneeId: task.assigneeId ?? "",
              clientVisible: task.clientVisible ?? true,
            }}
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Icons.edit /> Edit
              </DropdownMenuItem>
            }
          />
          {(["TODO", "IN_PROGRESS", "BLOCKED"] as const)
            .filter((s) => s !== task.status)
            .map((s) => (
              <DropdownMenuItem key={s} onSelect={() => run(() => setTaskStatusAction(task.id, s))}>
                Mark {s === "TODO" ? "to do" : s === "IN_PROGRESS" ? "in progress" : "blocked"}
              </DropdownMenuItem>
            ))}
          <DropdownMenuItem
            className="text-danger data-[highlighted]:text-danger [&_svg]:text-danger"
            onSelect={() => {
              if (confirm(`Delete “${task.title}”?`)) run(() => deleteTaskAction(task.id));
            }}
          >
            <Icons.delete /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
