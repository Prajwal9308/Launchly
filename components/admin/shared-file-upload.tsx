"use client";

import { useState } from "react";
import { FileUploader } from "@/components/project/file-uploader";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import type { FileCategory } from "@/db/enums";
import { FILE_CATEGORY_LABELS, PROJECT_DOCUMENT_CATEGORIES } from "@/domain/files";

const OPTIONS: FileCategory[] = ["DOCUMENT", ...PROJECT_DOCUMENT_CATEGORIES, "OTHER"];

/** Studio upload with a document type, so proposals, agreements and invoices are listed separately for the client. */
export function SharedFileUpload({ projectId }: { projectId: string }) {
  const [category, setCategory] = useState<FileCategory>("DOCUMENT");
  return (
    <div className="space-y-4">
      <Field id="shared-file-category" label="Document type" hint="Proposals, agreements and invoices appear under Project Documents in the client portal.">
        {(p) => (
          <Select {...p} value={category} onChange={(e) => setCategory(e.target.value as FileCategory)} className="max-w-72">
            {OPTIONS.map((c) => (
              <option key={c} value={c}>
                {FILE_CATEGORY_LABELS[c]}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <FileUploader key={category} projectId={projectId} category={category} label={`Upload ${FILE_CATEGORY_LABELS[category]}`} compact />
    </div>
  );
}
