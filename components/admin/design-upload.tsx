"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { FileUploader } from "@/components/project/file-uploader";
import type { UploadedFile } from "@/components/project/use-upload";
import { DESIGN_ACCEPT_ATTRIBUTE, MAX_DESIGN_UPLOAD_BYTES } from "@/domain/files";
import { formatFileSize } from "@/lib/utils";
import { createDesignReviewAction } from "@/server/actions/admin";
import { useTransition } from "react";

/** Upload a design version. Sending it to the client is an explicit choice. */
export function DesignUploadDialog({ projectId, existingTitles }: { projectId: string; existingTitles: string[] }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(existingTitles[0] ?? "Homepage");
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [requestReview, setRequestReview] = useState(true);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const reset = () => {
    setFile(null);
    setPreviewUrl("");
    setNotes("");
    setErrors({});
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button>Upload Design</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload Design</DialogTitle>
          <DialogDescription>Uploading a design with an existing name creates the next version (e.g. Homepage v2).</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {error && <Alert tone="danger" title={error} />}
          <Field id="design-title" label="Design name" required hint={existingTitles.length ? `Existing: ${existingTitles.join(", ")}` : "e.g. Homepage, About page, Mobile homepage"} error={errors.title}>
            {(p) => <Input {...p} value={title} onChange={(e) => setTitle(e.target.value)} list="design-titles" />}
          </Field>
          <datalist id="design-titles">
            {existingTitles.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
          <div className="space-y-1.5">
            <p className="text-sm font-medium">Design preview</p>
            {file ? (
              <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
                <span className="truncate">{file.originalName}</span>
                <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                  Replace
                </Button>
              </div>
            ) : (
              <FileUploader
                projectId={projectId}
                category="DESIGN"
                label="Upload Image or PDF"
                hint={`PNG, JPG, WebP, GIF or PDF. Up to ${formatFileSize(MAX_DESIGN_UPLOAD_BYTES)}.`}
                accept={DESIGN_ACCEPT_ATTRIBUTE}
                multiple={false}
                refresh={false}
                compact
                onUploaded={setFile}
              />
            )}
            {errors.fileId && <p className="text-xs font-medium text-danger">{errors.fileId[0]}</p>}
          </div>
          <Field id="design-url" label="Interactive preview link" optional hint="e.g. a Figma prototype or staging URL (https only)." error={errors.previewUrl}>
            {(p) => <Input {...p} value={previewUrl} onChange={(e) => setPreviewUrl(e.target.value)} placeholder="https://" />}
          </Field>
          <Field id="design-notes" label="Notes for the client" optional error={errors.notes}>
            {(p) => <Textarea {...p} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />}
          </Field>
          <label className="flex items-center justify-between gap-4 rounded-lg border border-border p-3 text-sm">
            <span>
              <span className="font-medium">Request client review now</span>
              <span className="block text-xs text-faint">Otherwise it&apos;s saved as a draft the client can&apos;t see.</span>
            </span>
            <Switch checked={requestReview} onCheckedChange={setRequestReview} aria-label="Request client review now" />
          </label>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            loading={pending}
            onClick={() =>
              start(async () => {
                const result = await createDesignReviewAction(projectId, { title, fileId: file?.id, previewUrl, notes, requestReview });
                if (result.ok) {
                  toast.success(result.message);
                  setOpen(false);
                  reset();
                } else {
                  setError(result.error);
                  setErrors(result.fieldErrors ?? {});
                }
              })
            }
          >
            {requestReview ? "Upload and Request Review" : "Save Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
