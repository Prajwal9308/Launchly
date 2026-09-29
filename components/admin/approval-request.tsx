"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { requestApprovalAction } from "@/server/actions/admin";
import { useServerAction } from "./use-action";

export function ApprovalRequestDialog({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"FINAL_APPROVAL" | "LAUNCH_APPROVAL">("FINAL_APPROVAL");
  const [message, setMessage] = useState("");
  const { pending, run } = useServerAction();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Request Approval</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request Approval</DialogTitle>
          <DialogDescription>The client must explicitly confirm. Design approvals are requested by sharing a design for review.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="approval-type">Approval type</Label>
            <Select id="approval-type" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              <option value="FINAL_APPROVAL">Final approval</option>
              <option value="LAUNCH_APPROVAL">Launch approval</option>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="approval-message">
              Message <span className="font-normal text-faint">(optional)</span>
            </Label>
            <Textarea id="approval-message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Explain what to review and where (e.g. staging link)." />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button loading={pending} onClick={() => run(() => requestApprovalAction(projectId, { type, message }), () => { setOpen(false); setMessage(""); })}>
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
