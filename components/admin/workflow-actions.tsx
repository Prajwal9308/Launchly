"use client";

import { useState } from "react";
import type { ProjectStatus } from "@/db/enums";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { approveRequirementsAction, markLaunchedAction, requestApprovalAction, requestInformationAction } from "@/server/actions/admin";
import { useServerAction } from "./use-action";

function TextDialog({
  trigger,
  title,
  description,
  label,
  confirmLabel,
  required,
  onConfirm,
}: {
  trigger: React.ReactNode;
  title: string;
  description: string;
  label: string;
  confirmLabel: string;
  required?: boolean;
  onConfirm: (text: string) => ReturnType<typeof requestInformationAction>;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { pending, run } = useServerAction();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor="workflow-text">
            {label} {!required && <span className="font-normal text-faint">(optional)</span>}
          </Label>
          <Textarea id="workflow-text" rows={5} value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button loading={pending} disabled={required && !text.trim()} onClick={() => run(() => onConfirm(text), () => { setOpen(false); setText(""); })}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Contextual workflow shortcuts for the current project status. */
export function WorkflowActions({ projectId, status, hasPendingFinal }: { projectId: string; status: ProjectStatus; hasPendingFinal: boolean }) {
  const approve = useServerAction();
  const launch = useServerAction();
  const reviewing = ["NEW", "REQUIREMENTS_REVIEW", "INFORMATION_REQUIRED"].includes(status);

  return (
    <>
      {reviewing && (
        <Button loading={approve.pending} onClick={() => approve.run(() => approveRequirementsAction(projectId))}>
          Approve requirements
        </Button>
      )}
      {["NEW", "REQUIREMENTS_REVIEW", "DISCOVERY", "DESIGN"].includes(status) && (
        <TextDialog
          trigger={<Button variant="secondary">Request information</Button>}
          title="Request additional information"
          description="The client receives this as a message, and the project moves to “Information required”."
          label="What do you need from the client?"
          confirmLabel="Send request"
          required
          onConfirm={(text) => requestInformationAction(projectId, text)}
        />
      )}
      {["DEVELOPMENT", "TESTING"].includes(status) && !hasPendingFinal && (
        <TextDialog
          trigger={<Button>Request final approval</Button>}
          title="Request final approval"
          description="The client will be asked to review the finished website and explicitly approve it."
          label="Message to the client"
          confirmLabel="Request approval"
          onConfirm={(text) => requestApprovalAction(projectId, { type: "FINAL_APPROVAL", message: text })}
        />
      )}
      {status === "READY_TO_LAUNCH" && (
        <Button
          loading={launch.pending}
          onClick={() => {
            if (confirm("Mark this project as launched? The client will be notified.")) launch.run(() => markLaunchedAction(projectId));
          }}
        >
          Mark launched
        </Button>
      )}
    </>
  );
}
