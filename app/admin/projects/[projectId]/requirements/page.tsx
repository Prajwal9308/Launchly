import { AddRequirementDialog, DeleteRequirementButton } from "@/components/admin/requirement-form";
import { RequirementsList } from "@/components/project/requirements-list";
import { listProjectRequirements } from "@/services/project-queries";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function AdminRequirementsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const rows = await orNotFound(listProjectRequirements(actor, projectId));
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">Client questionnaire answers, plus anything the studio has added. Clients see this list too.</p>
        <AddRequirementDialog projectId={projectId} />
      </div>
      <RequirementsList rows={rows} renderAction={(r) => (r.source === "admin" ? <DeleteRequirementButton id={r.id} label={r.label} /> : null)} />
    </div>
  );
}
