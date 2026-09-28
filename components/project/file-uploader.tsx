"use client";

import { AlertCircle, CheckCircle2, UploadCloud, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import { ACCEPT_ATTRIBUTE, MAX_UPLOAD_BYTES } from "@/domain/files";
import { cn, formatFileSize } from "@/lib/utils";
import { useUpload, type UploadedFile } from "./use-upload";

interface FileUploaderProps {
  projectId: string;
  category: string;
  label?: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  onUploaded?: (file: UploadedFile) => void;
  /** Refresh server components after upload (default true). */
  refresh?: boolean;
  compact?: boolean;
}

/** Drag-and-drop or click-to-choose uploader with per-file progress and errors. */
export function FileUploader({
  projectId,
  category,
  label = "Upload files",
  hint = `PDF, Word, images. Up to ${formatFileSize(MAX_UPLOAD_BYTES)} each.`,
  accept = ACCEPT_ATTRIBUTE,
  multiple = true,
  onUploaded,
  refresh = true,
  compact = false,
}: FileUploaderProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [dragging, setDragging] = useState(false);
  const { items, upload, dismiss } = useUpload(projectId);

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files).slice(0, multiple ? 10 : 1);
    const results = await Promise.all(list.map((f) => upload(f, category)));
    for (const r of results) if (r) onUploaded?.(r);
    if (refresh && results.some(Boolean)) router.refresh();
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed text-center transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
          compact ? "gap-1 px-4 py-4" : "gap-2 px-6 py-8",
          dragging ? "border-accent bg-accent-subtle/60" : "border-border-strong bg-canvas hover:border-accent/60 hover:bg-accent-subtle/30",
        )}
      >
        <UploadCloud className={cn("text-faint", compact ? "size-5" : "size-6")} aria-hidden />
        <span className="text-sm font-medium text-foreground">
          {label} <span className="font-normal text-muted">or drag and drop</span>
        </span>
        <span className="text-xs text-faint">{hint}</span>
        <input
          ref={inputRef}
          id={id}
          type="file"
          className="sr-only"
          accept={accept}
          multiple={multiple}
          onChange={(e) => void handleFiles(e.target.files)}
        />
      </label>
      {items.length > 0 && (
        <ul className="space-y-1.5" aria-live="polite">
          {items.map((item) => (
            <li key={item.key} className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm">
              {item.error ? (
                <AlertCircle className="size-4 shrink-0 text-danger" aria-hidden />
              ) : item.file ? (
                <CheckCircle2 className="size-4 shrink-0 text-success" aria-hidden />
              ) : (
                <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-border border-t-accent" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate">{item.name}</p>
                {item.error ? (
                  <p className="text-xs text-danger">{item.error}</p>
                ) : !item.file ? (
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-subtle">
                    <div className="h-full bg-accent transition-[width]" style={{ width: `${item.progress}%` }} />
                  </div>
                ) : (
                  <p className="text-xs text-faint">Uploaded</p>
                )}
              </div>
              {(item.error || item.file) && (
                <button type="button" onClick={() => dismiss(item.key)} className="rounded p-1 text-faint hover:bg-subtle hover:text-foreground" aria-label={`Dismiss ${item.name}`}>
                  <X className="size-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
