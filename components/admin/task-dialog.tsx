"use client";

import { useState } from "react";
import type { TaskPriority, TaskStatus } from "@/db/enums";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { createTaskAction, updateTaskAction } from "@/server/actions/admin";
import { useTransition } from "react";

export interface TaskFormValue {
  id?: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  assigneeId: string;
  clientVisible: boolean;
}

const EMPTY: TaskFormValue = { title: "", description: "", status: "TODO", priority: "MEDIUM", dueDate: "", assigneeId: "", clientVisible: true };

export function TaskDialog({
  projectId,
  initial,
  team,
  trigger,
}: {
  projectId: string;
  initial?: TaskFormValue;
  team: { id: string; firstName: string; lastName: string }[];
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<TaskFormValue>(initial ?? EMPTY);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const set = (patch: Partial<TaskFormValue>) => setValue((v) => ({ ...v, ...patch }));

  const submit = () =>
    start(async () => {
      const { id, ...input } = value;
      const result = id ? await updateTaskAction(id, input) : await createTaskAction(projectId, input);
      if (result.ok) {
        toast.success(result.message);
        setOpen(false);
        if (!id) setValue(EMPTY);
      } else {
        setError(result.error);
        setErrors(result.fieldErrors ?? {});
      }
    });

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) { setValue(initial ?? EMPTY); setErrors({}); setError(null); } }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{value.id ? "Edit Task" : "New Task"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {error && <Alert tone="danger" title={error} />}
          <Field id="task-title" label="Title" required error={errors.title}>
            {(p) => <Input {...p} value={value.title} onChange={(e) => set({ title: e.target.value })} autoFocus />}
          </Field>
          <Field id="task-description" label="Description" optional error={errors.description}>
            {(p) => <Textarea {...p} rows={3} value={value.description} onChange={(e) => set({ description: e.target.value })} />}
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="task-status" label="Status">
              {(p) => (
                <Select {...p} value={value.status} onChange={(e) => set({ status: e.target.value as TaskStatus })}>
                  <option value="TODO">To do</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="DONE">Done</option>
                </Select>
              )}
            </Field>
            <Field id="task-priority" label="Priority">
              {(p) => (
                <Select {...p} value={value.priority} onChange={(e) => set({ priority: e.target.value as TaskPriority })}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </Select>
              )}
            </Field>
            <Field id="task-due" label="Due date" optional error={errors.dueDate}>
              {(p) => <Input {...p} type="date" value={value.dueDate} onChange={(e) => set({ dueDate: e.target.value })} />}
            </Field>
            <Field id="task-assignee" label="Assigned to" optional error={errors.assigneeId}>
              {(p) => (
                <Select {...p} value={value.assigneeId} onChange={(e) => set({ assigneeId: e.target.value })}>
                  <option value="">Unassigned</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.firstName} {m.lastName}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-sm">
            <span>
              <span className="font-medium">Visible to client</span>
              <span className="block text-xs text-faint">Internal tasks are hidden from the client portal.</span>
            </span>
            <Switch checked={value.clientVisible} onCheckedChange={(v) => set({ clientVisible: v })} aria-label="Visible to client" />
          </label>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={submit} loading={pending}>
            {value.id ? "Save Task" : "Create Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
