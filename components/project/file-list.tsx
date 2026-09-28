"use client";

import { Download, FileImage, FileText, Trash2 } from "lucide-react";
import { useTransition } from "react";
import type { FileCategory } from "@/db/enums";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";
import { FILE_CATEGORY_LABELS } from "@/domain/files";
import { formatDate } from "@/lib/format";
import { formatFileSize } from "@/lib/utils";
import { deleteFileAction } from "@/server/actions/client";

export interface FileView {
  id: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: FileCategory;
  createdAt: Date;
  uploadedBy?: { id: string; firstName: string; lastName: string } | null;
}

function DeleteButton({ file }: { file: FileView }) {
  const [pending, start] = useTransition();
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      loading={pending}
      aria-label={`Remove ${file.originalName}`}
      onClick={() => {
        if (!confirm(`Remove ${file.originalName}?`)) return;
        start(async () => {
          const result = await deleteFileAction(file.id);
          if (result.ok) toast.success(result.message);
          else toast.error(result.error);
        });
      }}
    >
      {!pending && <Trash2 />}
    </Button>
  );
}

export function FileList({ files, currentUserId, canDeleteAll = false }: { files: FileView[]; currentUserId: string; canDeleteAll?: boolean }) {
  return (
    <ul className="divide-y divide-border">
      {files.map((file) => {
        const Icon = file.mimeType.startsWith("image/") ? FileImage : FileText;
        const canDelete = canDeleteAll || file.uploadedBy?.id === currentUserId;
        return (
          <li key={file.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border bg-white/[0.03] text-faint">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <a href={`/api/files/${file.id}`} target="_blank" rel="noopener" className="block truncate text-sm font-medium hover:underline">
                {file.originalName}
              </a>
              <p className="truncate text-xs text-faint">
                {FILE_CATEGORY_LABELS[file.category]} · {formatFileSize(file.size)} · {formatDate(file.createdAt)}
                {file.uploadedBy && ` · ${file.uploadedBy.firstName} ${file.uploadedBy.lastName}`}
              </p>
            </div>
            <Button asChild variant="ghost" size="icon-sm" aria-label={`Download ${file.originalName}`}>
              <a href={`/api/files/${file.id}?download`}>
                <Download />
              </a>
            </Button>
            {canDelete && file.category !== "DESIGN" && <DeleteButton file={file} />}
          </li>
        );
      })}
    </ul>
  );
}
