"use client";

import { useState } from "react";
import type { ProjectStatus } from "@/db/enums";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { STATUS_LABELS } from "@/domain/project-status";
import { changeStatusAction } from "@/server/actions/admin";
import { useServerAction } from "./use-action";

/** Only offers transitions the server-side state machine allows. */
export function StatusControl({ projectId, current, allowed }: { projectId: string; current: ProjectStatus; allowed: ProjectStatus[] }) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState<ProjectStatus | "">(allowed[0] ?? "");
  const [note, setNote] = useState("");
  const { pending, run } = useServerAction();

  if (!allowed.length) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Change status</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change project status</DialogTitle>
          <DialogDescription>
            Currently <strong>{STATUS_LABELS[current]}</strong>. The client is notified of status changes.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="status-to">New status</Label>
            <Select id="status-to" value={to} onChange={(e) => setTo(e.target.value as ProjectStatus)}>
              {allowed.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status-note">
              Internal note <span className="font-normal text-faint">(optional)</span>
            </Label>
            <Textarea id="status-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button loading={pending} disabled={!to} onClick={() => run(() => changeStatusAction(projectId, to, note), () => setOpen(false))}>
            Update status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
