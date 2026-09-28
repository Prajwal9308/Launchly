import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { formatProjectNumber } from "@/lib/utils";
import { orNotFound } from "@/server/guards";
import { loadProjectDetail } from "@/server/loaders";
import { requireClientActor } from "@/server/session";

export default async function SubmittedPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const project = await orNotFound(loadProjectDetail(actor, projectId));
  if (project.status === "DRAFT") redirect(`/start-project/${project.id}`);

  return (
    <div className="mx-auto max-w-lg">
      <div className="surface-raised rounded-2xl p-6 text-center shadow-card sm:p-10">
        <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-success-subtle text-success">
          <CheckCircle2 className="size-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">Your project is in.</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Your project has been submitted. We&apos;ve received your information and will review the project details before the next step.
        </p>
        <dl className="mt-8 divide-y divide-border rounded-lg border border-border text-left text-sm">
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Project number</dt>
            <dd className="font-medium">{formatProjectNumber(project.number)}</dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Business</dt>
            <dd className="font-medium">{project.business?.name}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Current status</dt>
            <dd>
              <ProjectStatusBadge status={project.status} />
            </dd>
          </div>
          <div className="flex justify-between gap-4 px-4 py-3">
            <dt className="text-muted">Next step</dt>
            <dd className="text-right font-medium">We review your requirements and assets</dd>
          </div>
        </dl>
        <Button asChild className="mt-8 w-full sm:w-auto">
          <Link href={`/dashboard/project/${project.id}`}>View My Project</Link>
        </Button>
      </div>
    </div>
  );
}
