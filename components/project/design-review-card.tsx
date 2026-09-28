"use client";

import { Icons } from "@/components/ui/icons";
import { useState, useTransition } from "react";
import type { DesignReviewStatus } from "@/db/enums";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ReviewStatusBadge } from "@/components/ui/status-badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { formatDate, formatDateTime } from "@/lib/format";
import { approveDesignAction, requestRevisionAction } from "@/server/actions/client";
import { requestDesignReviewAction, resolveRevisionAction } from "@/server/actions/admin";

export interface DesignReviewView {
  id: string;
  title: string;
  version: number;
  status: DesignReviewStatus;
  notes: string | null;
  previewUrl: string | null;
  requestedAt: Date | null;
  decidedAt: Date | null;
  createdAt: Date;
  file: { id: string; originalName: string; mimeType: string } | null;
  revisionRequests: { id: string; body: string; status: "OPEN" | "RESOLVED"; createdAt: Date; requestedBy: { firstName: string; lastName: string } | null }[];
  approvals: { id: string; comment: string | null; decidedAt: Date | null; approvedBy: { firstName: string; lastName: string } | null }[];
}

function Preview({ review }: { review: DesignReviewView }) {
  if (review.file?.mimeType.startsWith("image/")) {
    return (
      <a href={`/api/files/${review.file.id}`} target="_blank" rel="noopener" className="block overflow-hidden rounded-lg border border-border bg-canvas">
        {/* eslint-disable-next-line @next/next/no-img-element -- authenticated, dynamic file route */}
        <img src={`/api/files/${review.file.id}`} alt={`${review.title} version ${review.version} design preview`} className="w-full object-contain" loading="lazy" />
      </a>
    );
  }
  if (review.file) {
    return (
      <a
        href={`/api/files/${review.file.id}`}
        target="_blank"
        rel="noopener"
        className="flex items-center gap-3 rounded-lg border border-border bg-canvas p-4 text-sm hover:bg-subtle"
      >
        <Icons.document className="text-faint" aria-hidden /> Open {review.file.originalName}
      </a>
    );
  }
  return null;
}

function RequestChanges({ review }: { review: DesignReviewView }) {
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Request Changes</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request changes</DialogTitle>
          <DialogDescription>
            {review.title} v{review.version}. Be as specific as you can — mention sections, text or images.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor={`rev-${review.id}`}>What would you like changed?</Label>
          <Textarea
            id={`rev-${review.id}`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            aria-invalid={error ? true : undefined}
            placeholder="e.g. Make the phone number more visible in the header, and use the team photo in the About section."
          />
          {error && <p className="text-xs text-danger" role="alert">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            loading={pending}
            onClick={() =>
              start(async () => {
                const result = await requestRevisionAction(review.id, body);
                if (result.ok) {
                  toast.success(result.message);
                  setOpen(false);
                } else setError(result.fieldErrors?.body?.[0] ?? result.error);
              })
            }
          >
            Send request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ApproveDesign({ review }: { review: DesignReviewView }) {
  const [open, setOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setConfirmed(false); }}>
      <DialogTrigger asChild>
        <Button>Approve Design</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Approve {review.title} v{review.version}</DialogTitle>
          <DialogDescription>Approving confirms this version as the design we&apos;ll build from. This is recorded on your project.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor={`approve-comment-${review.id}`}>
              Comment <span className="font-normal text-faint">(optional)</span>
            </Label>
            <Textarea id={`approve-comment-${review.id}`} value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
          </div>
          <label className="flex items-start gap-3 rounded-lg border border-border bg-canvas p-3 text-sm">
            <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(v === true)} className="mt-0.5" aria-describedby={`approve-help-${review.id}`} />
            <span id={`approve-help-${review.id}`}>
              I approve <strong>{review.title} version {review.version}</strong>.
            </span>
          </label>
          {error && <Alert tone="danger" title={error} />}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            disabled={!confirmed}
            loading={pending}
            onClick={() =>
              start(async () => {
                const result = await approveDesignAction(review.id, confirmed, comment);
                if (result.ok) {
                  toast.success(result.message);
                  setOpen(false);
                } else setError(result.error);
              })
            }
          >
            Confirm approval
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminReviewActions({ review }: { review: DesignReviewView }) {
  const [pending, start] = useTransition();
  if (review.status !== "DRAFT") return null;
  return (
    <Button
      loading={pending}
      onClick={() =>
        start(async () => {
          const result = await requestDesignReviewAction(review.id);
          if (result.ok) toast.success(result.message);
          else toast.error(result.error);
        })
      }
    >
      Request client review
    </Button>
  );
}

function ResolveButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      size="sm"
      variant="secondary"
      loading={pending}
      onClick={() =>
        start(async () => {
          const result = await resolveRevisionAction(id);
          if (result.ok) toast.success(result.message);
          else toast.error(result.error);
        })
      }
    >
      Mark addressed
    </Button>
  );
}

export function DesignReviewCard({ review, viewer, expanded = true }: { review: DesignReviewView; viewer: "client" | "admin"; expanded?: boolean }) {
  const awaiting = review.status === "IN_REVIEW";
  return (
    <article className="overflow-hidden surface rounded-2xl">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3.5">
        <div>
          <h3 className="text-sm font-semibold">
            {review.title} <span className="font-normal text-faint">· v{review.version}</span>
          </h3>
          <p className="text-xs text-faint">
            {review.requestedAt ? `Shared ${formatDate(review.requestedAt)}` : `Uploaded ${formatDate(review.createdAt)}`}
          </p>
        </div>
        <ReviewStatusBadge status={review.status} />
      </header>
      {expanded && (
        <div className="space-y-4 p-5">
          {viewer === "client" && awaiting && (
            <Alert tone="warning" title="Your design is ready for review.">
              Take a look and approve it, or tell us what you&apos;d like changed.
            </Alert>
          )}
          <Preview review={review} />
          {review.previewUrl && (
            <a href={review.previewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline">
              Open interactive preview <Icons.external aria-hidden />
            </a>
          )}
          {review.notes && (
            <div className="rounded-lg bg-canvas p-3.5 text-sm leading-relaxed text-muted">
              <p className="mb-1 text-xs font-medium text-faint">Notes from the studio</p>
              <p className="whitespace-pre-wrap">{review.notes}</p>
            </div>
          )}
          {review.revisionRequests.length > 0 && (
            <div className="space-y-2">
              <p className="flex items-center gap-1.5 text-xs font-medium text-faint">
                <Icons.messages aria-hidden /> Change requests
              </p>
              {review.revisionRequests.map((r) => (
                <div key={r.id} className="rounded-lg border border-border p-3 text-sm">
                  <p className="whitespace-pre-wrap leading-relaxed">{r.body}</p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <p className="text-xs text-faint">
                      {r.requestedBy ? `${r.requestedBy.firstName} ${r.requestedBy.lastName} · ` : ""}
                      {formatDateTime(r.createdAt)} · {r.status === "OPEN" ? "Open" : "Addressed"}
                    </p>
                    {viewer === "admin" && r.status === "OPEN" && <ResolveButton id={r.id} />}
                  </div>
                </div>
              ))}
            </div>
          )}
          {review.approvals.map((a) => (
            <Alert key={a.id} tone="success" title={`Approved by ${a.approvedBy ? `${a.approvedBy.firstName} ${a.approvedBy.lastName}` : "client"} on ${formatDateTime(a.decidedAt)}`}>
              {a.comment}
            </Alert>
          ))}
        </div>
      )}
      {((viewer === "client" && awaiting) || (viewer === "admin" && review.status === "DRAFT")) && (
        <footer className="flex flex-col-reverse gap-2 border-t border-border bg-canvas px-5 py-3.5 sm:flex-row sm:justify-end">
          {viewer === "client" ? (
            <>
              <RequestChanges review={review} />
              <ApproveDesign review={review} />
            </>
          ) : (
            <AdminReviewActions review={review} />
          )}
        </footer>
      )}
    </article>
  );
}
