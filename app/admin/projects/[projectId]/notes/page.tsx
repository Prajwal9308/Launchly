import { StickyNote } from "lucide-react";
import { NoteForm } from "@/components/admin/note-form";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime } from "@/lib/format";
import { listInternalNotes } from "@/services/notes";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function AdminNotesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const notes = await orNotFound(listInternalNotes(actor, projectId));
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Alert tone="neutral" title="Internal notes are only visible to the studio." />
      <Card>
        <CardContent>
          <NoteForm projectId={projectId} />
        </CardContent>
      </Card>
      {notes.length ? (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="surface rounded-2xl p-4 shadow-card">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{n.body}</p>
              <p className="mt-2 text-xs text-faint">
                {n.author ? `${n.author.firstName} ${n.author.lastName}` : "Studio"} · {formatDateTime(n.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <EmptyState icon={StickyNote} title="No notes yet" description="Record call summaries, decisions and reminders here." compact />
        </Card>
      )}
    </div>
  );
}
