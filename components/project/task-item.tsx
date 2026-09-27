import { CalendarDays, CheckCircle2, Circle, CircleDashed, OctagonAlert } from "lucide-react";
import type { TaskPriority, TaskStatus } from "@/db/enums";
import { PriorityBadge, TaskStatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface TaskView {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
  completedAt: Date | null;
  clientVisible?: boolean;
  assigneeId?: string | null;
  assignee?: { firstName: string; lastName: string } | null;
}

const STATUS_ICON = {
  TODO: <Circle className="size-4 text-border-strong" aria-hidden />,
  IN_PROGRESS: <CircleDashed className="size-4 text-info" aria-hidden />,
  BLOCKED: <OctagonAlert className="size-4 text-danger" aria-hidden />,
  DONE: <CheckCircle2 className="size-4 text-success" aria-hidden />,
};

function isPast(date: Date | null) {
  return date !== null && date.getTime() < Date.now();
}

/** Read-only task row (client view and admin lists). */
export function TaskItem({ task, showPriority = false, action }: { task: TaskView; showPriority?: boolean; action?: React.ReactNode }) {
  const overdue = task.status !== "DONE" && isPast(task.dueDate);
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <span className="mt-0.5">{action ?? STATUS_ICON[task.status]}</span>
      <div className="min-w-0 flex-1">
        <p className={cn("text-sm", task.status === "DONE" ? "text-muted line-through decoration-border-strong" : "font-medium")}>
          {task.title}
        </p>
        {task.description && <p className="mt-0.5 text-xs leading-relaxed text-faint">{task.description}</p>}
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-faint">
          <TaskStatusBadge status={task.status} />
          {showPriority && <PriorityBadge priority={task.priority} />}
          {task.dueDate && task.status !== "DONE" && (
            <span className={cn("inline-flex items-center gap-1", overdue && "text-danger")}>
              <CalendarDays className="size-3" aria-hidden /> {overdue ? "Overdue · " : "Due "}
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.status === "DONE" && task.completedAt && <span>Completed {formatDate(task.completedAt)}</span>}
          {task.assignee && (
            <span>
              · {task.assignee.firstName} {task.assignee.lastName}
            </span>
          )}
          {task.clientVisible === false && <span className="rounded bg-subtle px-1.5 py-0.5">Internal</span>}
        </div>
      </div>
    </div>
  );
}
