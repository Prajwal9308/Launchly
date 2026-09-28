import type { Metadata } from "next";
import { FileStack, Upload } from "lucide-react";
import { SectionTitle } from "@/components/app/page-header";
import { FileList } from "@/components/project/file-list";
import { FileUploader } from "@/components/project/file-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listProjectFiles } from "@/services/files";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Files" };

export default async function ClientFilesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const files = await orNotFound(listProjectFiles(actor, projectId));
  const yours = files.filter((f) => f.category !== "DESIGN");

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <SectionTitle icon={Upload}>Upload files</SectionTitle>
          <p className="mb-4 text-sm text-muted">Logos, photos, menus, brochures, brand guidelines or any content you&apos;d like us to use.</p>
          <FileUploader projectId={projectId} category="CONTENT" />
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Project files</h2>
        </div>
        {yours.length ? (
          <FileList files={yours} currentUserId={actor.id} />
        ) : (
          <EmptyState icon={FileStack} title="No files yet" description="Files you and the studio share will appear here." />
        )}
      </Card>
    </div>
  );
}
