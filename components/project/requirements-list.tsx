import { Icons } from "@/components/ui/icons";
import { EmptyState } from "@/components/ui/empty-state";

export interface RequirementView {
  id: string;
  section: string;
  label: string;
  value: string;
  source: string;
}

/** Requirements grouped by questionnaire section, as a clean definition list. */
export function RequirementsList({ rows, renderAction }: { rows: RequirementView[]; renderAction?: (row: RequirementView) => React.ReactNode }) {
  if (!rows.length) {
    return <EmptyState icon={Icons.requirements} title="No requirements yet" description="Requirements appear here once the project questionnaire is submitted." />;
  }
  const sections = [...new Set(rows.map((r) => r.section))];
  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section} className="overflow-hidden surface rounded-2xl">
          <h2 className="border-b border-border bg-canvas px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-faint">{section}</h2>
          <dl className="divide-y divide-border">
            {rows
              .filter((r) => r.section === section)
              .map((r) => (
                <div key={r.id} className="grid gap-1 px-5 py-3 sm:grid-cols-[14rem_1fr_auto] sm:gap-6">
                  <dt className="text-sm text-muted">
                    {r.label}
                    {r.source === "admin" && <span className="ml-1.5 rounded bg-subtle px-1.5 py-0.5 text-[11px] text-faint">Added by studio</span>}
                  </dt>
                  <dd className="whitespace-pre-wrap break-words text-sm">{r.value}</dd>
                  {renderAction && <dd className="sm:text-right">{renderAction(r)}</dd>}
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
