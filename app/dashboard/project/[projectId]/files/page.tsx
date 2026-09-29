import type { Metadata } from "next";
import { Icons } from "@/components/ui/icons";
import { SectionTitle } from "@/components/app/page-header";
import { FileList } from "@/components/project/file-list";
import { FileUploader } from "@/components/project/file-uploader";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { isProjectDocument } from "@/domain/files";
import { listProjectFiles } from "@/services/files";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Files" };

export default async function ClientFilesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor();
  const files = await orNotFound(listProjectFiles(actor, projectId));
  const documents = files.filter((f) => isProjectDocument(f.category));
  const yours = files.filter((f) => f.category !== "DESIGN" && !isProjectDocument(f.category));

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Project Documents</h2>
          <p className="mt-0.5 text-xs text-muted">Your Proposal, Project Agreement, invoices and any Maintenance Agreement.</p>
        </div>
        {documents.length ? (
          <FileList files={documents} currentUserId={actor.id} />
        ) : (
          <EmptyState
            icon={Icons.document}
            title="No project documents yet"
            description="When we share your Proposal, Project Agreement or an invoice, it will appear here."
          />
        )}
      </Card>
      <Card>
        <CardContent>
          <SectionTitle icon={Icons.upload}>Upload Files</SectionTitle>
          <p className="mb-4 text-sm text-muted">Logos, photos, menus, brochures, brand guidelines or any other content you would like us to use.</p>
          <FileUploader projectId={projectId} category="CONTENT" />
        </CardContent>
      </Card>
      <Card className="overflow-hidden">
        <div className="border-b border-border px-5 py-3.5">
          <h2 className="text-sm font-semibold">Project Files</h2>
        </div>
        {yours.length ? (
          <FileList files={yours} currentUserId={actor.id} />
        ) : (
          <EmptyState icon={Icons.files} title="No files yet" description="Files shared by you and our team will appear here." />
        )}
      </Card>
    </div>
  );
}
