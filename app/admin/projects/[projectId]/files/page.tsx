import { Icons } from "@/components/ui/icons";
import { SectionTitle } from "@/components/app/page-header";
import { FileList } from "@/components/project/file-list";
import { FileUploader } from "@/components/project/file-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listProjectFiles } from "@/services/files";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function AdminFilesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const files = await orNotFound(listProjectFiles(actor, projectId));
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <SectionTitle icon={Icons.upload}>Share a file with the client</SectionTitle>
          <FileUploader projectId={projectId} category="DOCUMENT" compact />
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">All files ({files.length})</h2>
        </div>
        {files.length ? (
          <FileList files={files} currentUserId={actor.id} canDeleteAll />
        ) : (
          <EmptyState icon={Icons.files} title="No files yet" description="Files uploaded by the client or studio appear here." />
        )}
      </Card>
    </div>
  );
}
