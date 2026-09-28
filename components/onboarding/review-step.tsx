"use client";

import { Icons } from "@/components/ui/icons";
import { Alert } from "@/components/ui/alert";
import type { UploadedFile } from "@/components/project/use-upload";
import { STEPS, type DataStepKey, type QuestionnaireDraft, type SubmissionIssue } from "@/domain/questionnaire";
import { buildRequirementRows } from "@/domain/requirements";

const SECTION_TO_STEP: Record<string, DataStepKey> = {
  Business: "business",
  Goals: "goals",
  Website: "website",
  Brand: "brand",
  Content: "content",
  Inspiration: "inspiration",
  Features: "features",
  "Final details": "final",
};

/** Summary of all answers before submission, grouped by step, with edit links. */
export function ReviewStep({
  draft,
  services,
  files,
  issues,
  onEdit,
}: {
  draft: QuestionnaireDraft;
  services: { slug: string; name: string }[];
  files: UploadedFile[];
  issues: SubmissionIssue[];
  onEdit: (step: DataStepKey) => void;
}) {
  const rows = buildRequirementRows(draft, Object.fromEntries(services.map((s) => [s.slug, s.name])));
  const sections = STEPS.filter((s) => s.key !== "review").map((s) => ({
    key: s.key as DataStepKey,
    title: s.title,
    rows: rows.filter((r) => SECTION_TO_STEP[r.section] === s.key),
  }));

  return (
    <div className="space-y-6">
      {issues.length > 0 ? (
        <Alert tone="warning" title="A few required answers are missing">
          <ul className="mt-1 space-y-1">
            {issues.map((issue) => (
              <li key={`${issue.step}.${issue.field}`}>
                {issue.message}{" "}
                <button type="button" className="font-medium text-accent underline-offset-2 hover:underline" onClick={() => onEdit(issue.step)}>
                  Fix
                </button>
              </li>
            ))}
          </ul>
        </Alert>
      ) : (
        <Alert tone="success" title="Everything we need is here">
          Review your answers below, then submit your project.
        </Alert>
      )}

      {sections.map((section) => (
        <section key={section.key} className="rounded-lg border border-border">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold">{section.title}</h2>
            <button type="button" onClick={() => onEdit(section.key)} className="text-xs font-medium text-accent hover:underline">
              Edit<span className="sr-only"> {section.title}</span>
            </button>
          </div>
          {section.rows.length ? (
            <dl className="divide-y divide-border">
              {section.rows.map((r) => (
                <div key={r.label} className="grid gap-0.5 px-4 py-2.5 sm:grid-cols-[12rem_1fr] sm:gap-4">
                  <dt className="text-sm text-muted">{r.label}</dt>
                  <dd className="whitespace-pre-wrap break-words text-sm">{r.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="px-4 py-3 text-sm text-faint">No answers yet</p>
          )}
        </section>
      ))}

      <section className="rounded-lg border border-border">
        <h2 className="border-b border-border px-4 py-2.5 text-sm font-semibold">Uploaded files</h2>
        {files.length ? (
          <ul className="divide-y divide-border">
            {files.map((f) => (
              <li key={f.id} className="flex items-center gap-2 px-4 py-2.5 text-sm">
                <Icons.attach className="text-faint" aria-hidden /> {f.originalName}
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-3 text-sm text-faint">No files uploaded. You can also add files after submitting.</p>
        )}
      </section>
    </div>
  );
}
