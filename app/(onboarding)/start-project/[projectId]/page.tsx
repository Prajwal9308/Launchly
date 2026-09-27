import { redirect } from "next/navigation";
import { Questionnaire } from "@/components/onboarding/questionnaire";
import { listPublishedServices } from "@/services/catalog";
import { listProjectFiles } from "@/services/files";
import { getQuestionnaire } from "@/services/projects";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export default async function QuestionnairePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor(`/start-project/${projectId}`);
  const { project, draft, step } = await orNotFound(getQuestionnaire(actor, projectId));
  if (project.status !== "DRAFT") redirect(`/dashboard/project/${project.id}`);

  const [services, files] = await Promise.all([listPublishedServices(), listProjectFiles(actor, projectId)]);

  return (
    <Questionnaire
      projectId={project.id}
      initialDraft={draft}
      initialStep={step}
      services={services.map((s) => ({ slug: s.slug, name: s.name, summary: s.summary }))}
      initialFiles={files
        .filter((f) => f.category !== "ATTACHMENT")
        .map((f) => ({ id: f.id, originalName: f.originalName, mimeType: f.mimeType, size: f.size, category: f.category }))}
    />
  );
}
