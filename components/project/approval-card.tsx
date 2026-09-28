"use client";

import { IconTile, Icons } from "@/components/ui/icons";
import { useState, useTransition } from "react";
import type { ApprovalStatus, ApprovalType } from "@/db/enums";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ApprovalStatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { formatDateTime } from "@/lib/format";
import { cancelApprovalAction } from "@/server/actions/admin";
import { respondToApprovalAction } from "@/server/actions/client";

export const APPROVAL_TITLES: Record<ApprovalType, string> = {
  DESIGN_APPROVAL: "Design approval",
  FINAL_APPROVAL: "Final website approval",
  LAUNCH_APPROVAL: "Launch approval",
};

export interface ApprovalView {
  id: string;
  type: ApprovalType;
  status: ApprovalStatus;
  version: string | null;
  requestMessage: string | null;
  comment: string | null;
  createdAt: Date;
  decidedAt: Date | null;
  approvedBy: { firstName: string; lastName: string } | null;
  requestedBy: { firstName: string; lastName: string } | null;
}

function Respond({ approval }: { approval: ApprovalView }) {
  const [mode, setMode] = useState<"approve" | "changes" | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      const result =
        mode === "approve"
          ? await respondToApprovalAction(approval.id, { decision: "APPROVE", confirm: confirmed, comment })
          : await respondToApprovalAction(approval.id, { decision: "CHANGES", comment });
      if (result.ok) {
        toast.success(result.message);
        setMode(null);
      } else setError(result.fieldErrors?.comment?.[0] ?? result.error);
    });

  return (
    <Dialog open={mode !== null} onOpenChange={(v) => { if (!v) { setMode(null); setConfirmed(false); setError(null); } }}>
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <DialogTrigger asChild>
          <Button variant="secondary" onClick={() => setMode("changes")}>Request Changes</Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button onClick={() => setMode("approve")}>Approve</Button>
        </DialogTrigger>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "approve" ? `Confirm ${APPROVAL_TITLES[approval.type].toLowerCase()}` : "Request changes"}</DialogTitle>
          <DialogDescription>
            {mode === "approve"
              ? "Your approval is recorded with your name and the date. Only approve once you've reviewed everything."
              : "Tell us what needs to change before you can approve."}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`approval-comment-${approval.id}`}>
              {mode === "approve" ? (
                <>
                  Comment <span className="font-normal text-faint">(optional)</span>
                </>
              ) : (
                "What needs to change?"
              )}
            </Label>
            <Textarea id={`approval-comment-${approval.id}`} value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
          </div>
          {mode === "approve" && (
            <label className="flex items-start gap-3 rounded-lg border border-border bg-canvas p-3 text-sm">
              <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" />
              <span>I have reviewed the website and give my {APPROVAL_TITLES[approval.type].toLowerCase()}.</span>
            </label>
          )}
          {error && <Alert tone="danger" title={error} />}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setMode(null)}>
            Cancel
          </Button>
          <Button onClick={submit} loading={pending} disabled={mode === "approve" && !confirmed}>
            {mode === "approve" ? "Confirm approval" : "Send request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Withdraw({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      loading={pending}
      onClick={() =>
        start(async () => {
          const result = await cancelApprovalAction(id);
          if (result.ok) toast.success(result.message);
          else toast.error(result.error);
        })
      }
    >
      Withdraw request
    </Button>
  );
}

export function ApprovalCard({ approval, viewer }: { approval: ApprovalView; viewer: "client" | "admin" }) {
  const pending = approval.status === "PENDING";
  return (
    <article className="surface rounded-2xl p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <IconTile icon={Icons.approved} tone={pending ? "accent" : "neutral"} />
          <div>
            <h3 className="text-sm font-semibold">
              {APPROVAL_TITLES[approval.type]}
              {approval.version && approval.type === "DESIGN_APPROVAL" && <span className="font-normal text-faint"> · {approval.version}</span>}
            </h3>
            <p className="text-xs text-faint">
              {pending
                ? `Requested ${formatDateTime(approval.createdAt)}`
                : `${approval.status === "APPROVED" ? "Approved" : "Answered"} ${formatDateTime(approval.decidedAt)}${approval.approvedBy ? ` by ${approval.approvedBy.firstName} ${approval.approvedBy.lastName}` : ""}`}
            </p>
          </div>
        </div>
        <ApprovalStatusBadge status={approval.status} />
      </div>
      {approval.requestMessage && <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-muted">{approval.requestMessage}</p>}
      {approval.comment && (
        <p className="mt-3 rounded-lg bg-canvas p-3 text-sm text-muted">
          <span className="block text-xs font-medium text-faint">Client comment</span>
          {approval.comment}
        </p>
      )}
      {pending && (
        <div className="mt-4 border-t border-border pt-4">
          {viewer === "client" ? <Respond approval={approval} /> : <div className="flex justify-end"><Withdraw id={approval.id} /></div>}
        </div>
      )}
    </article>
  );
}
