"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addNoteAction } from "@/server/actions/admin";
import { useServerAction } from "./use-action";

export function NoteForm({ projectId }: { projectId: string }) {
  const [body, setBody] = useState("");
  const { pending, run } = useServerAction();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(() => addNoteAction(projectId, body), () => setBody(""));
      }}
      className="space-y-3"
    >
      <label htmlFor="note-body" className="sr-only">
        Internal note
      </label>
      <Textarea id="note-body" rows={3} value={body} onChange={(e) => setBody(e.target.value)} placeholder="Record a call summary, decision or reminder. Never visible to the client." />
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={pending} disabled={!body.trim()}>
          Save Note
        </Button>
      </div>
    </form>
  );
}
