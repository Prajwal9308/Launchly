"use client";

import { Paperclip, Send, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toaster";
import { ACCEPT_ATTRIBUTE } from "@/domain/files";
import { sendMessageAction } from "@/server/actions/client";
import { useUpload, type UploadedFile } from "./use-upload";

export function MessageComposer({ projectId, placeholder = "Write a message…" }: { projectId: string; placeholder?: string }) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const { upload, items, clear } = useUpload(projectId);
  const uploading = items.some((i) => !i.file && !i.error);

  const submit = () => {
    if (!body.trim()) {
      setError("Write a message.");
      return;
    }
    setError(null);
    start(async () => {
      const result = await sendMessageAction(projectId, body, attachments.map((a) => a.id));
      if (result.ok) {
        setBody("");
        setAttachments([]);
        clear();
        router.refresh();
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="glass rounded-2xl focus-within:border-accent/60"
    >
      <label htmlFor="message-body" className="sr-only">
        Message
      </label>
      <Textarea
        id="message-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit();
        }}
        placeholder={placeholder}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? "message-error" : undefined}
        className="resize-none border-0 shadow-none focus-visible:outline-none"
        maxLength={10000}
      />
      {(attachments.length > 0 || items.some((i) => i.error || !i.file)) && (
        <ul className="flex flex-wrap gap-1.5 px-3 pb-2">
          {attachments.map((a) => (
            <li key={a.id} className="inline-flex items-center gap-1 rounded-md bg-subtle px-2 py-1 text-xs">
              <Paperclip className="size-3" aria-hidden /> {a.originalName}
              <button
                type="button"
                className="ml-0.5 rounded text-faint hover:text-foreground"
                aria-label={`Remove attachment ${a.originalName}`}
                onClick={() => setAttachments((prev) => prev.filter((x) => x.id !== a.id))}
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
          {items
            .filter((i) => i.error || !i.file)
            .map((i) => (
              <li key={i.key} className={i.error ? "text-xs text-danger" : "text-xs text-faint"}>
                {i.error ? `${i.name}: ${i.error}` : `Uploading ${i.name}…`}
              </li>
            ))}
        </ul>
      )}
      <div className="flex items-center justify-between gap-2 border-t border-border px-2 py-2">
        <div className="flex items-center gap-1">
          <input
            ref={fileRef}
            type="file"
            className="sr-only"
            id="message-attachment"
            accept={ACCEPT_ATTRIBUTE}
            multiple
            onChange={async (e) => {
              const files = Array.from(e.target.files ?? []).slice(0, 5 - attachments.length);
              const uploaded = await Promise.all(files.map((f) => upload(f, "ATTACHMENT")));
              setAttachments((prev) => [...prev, ...uploaded.filter((u): u is UploadedFile => Boolean(u))]);
              if (fileRef.current) fileRef.current.value = "";
            }}
          />
          <Button type="button" variant="ghost" size="sm" onClick={() => fileRef.current?.click()} disabled={attachments.length >= 5}>
            <Paperclip /> Attach
          </Button>
          {error && (
            <p id="message-error" className="text-xs text-danger" role="alert">
              {error}
            </p>
          )}
        </div>
        <Button type="submit" size="sm" loading={pending} disabled={uploading}>
          {!pending && <Send />} Send
        </Button>
      </div>
    </form>
  );
}
