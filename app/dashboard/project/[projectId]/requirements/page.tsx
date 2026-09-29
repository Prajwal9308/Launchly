import type { Metadata } from "next";
import { RequirementsList } from "@/components/project/requirements-list";
import { listProjectRequirements } from "@/services/project-queries";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Requirements" };

export default async function ClientRequirementsPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const rows = await orNotFound(listProjectRequirements(actor, projectId));
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Everything you have told us about your project. If something needs to change, send us a message and we will update it.
      </p>
      <RequirementsList rows={rows} />
    </div>
  );
}
