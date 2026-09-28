import { Icons } from "@/components/ui/icons";
import { Avatar } from "@/components/ui/avatar";
import { formatDateTime } from "@/lib/format";
import { cn, formatFileSize } from "@/lib/utils";

export interface MessageView {
  id: string;
  body: string;
  createdAt: Date;
  readAt: Date | null;
  sender: { id: string; firstName: string; lastName: string; role: "ADMIN" | "CLIENT" } | null;
  attachments: { id: string; originalName: string; size: number }[];
}

export function MessageBubble({ message, own, studioName }: { message: MessageView; own: boolean; studioName: string }) {
  const name = message.sender ? `${message.sender.firstName} ${message.sender.lastName}` : studioName;
  const isStudio = !message.sender || message.sender.role === "ADMIN";
  return (
    <li className={cn("flex gap-3", own && "flex-row-reverse")}>
      <Avatar firstName={message.sender?.firstName ?? studioName} lastName={message.sender?.lastName} tone={isStudio ? "accent" : "neutral"} className="mt-0.5" />
      <div className={cn("flex max-w-[85%] flex-col sm:max-w-[75%]", own && "items-end")}>
        <p className="mb-1 text-xs text-faint">
          <span className="font-medium text-muted">{name}</span>
          {isStudio && !own && <span> · {studioName}</span>} · <time dateTime={message.createdAt.toISOString()}>{formatDateTime(message.createdAt)}</time>
        </p>
        <div
          className={cn(
            "whitespace-pre-wrap break-words rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
            own
              ? "rounded-tr-sm bg-accent text-accent-foreground"
              : "rounded-tl-sm border border-border bg-background text-foreground",
          )}
        >
          {message.body}
        </div>
        {message.attachments.length > 0 && (
          <ul className="mt-1.5 space-y-1">
            {message.attachments.map((a) => (
              <li key={a.id}>
                <a
                  href={`/api/files/${a.id}?download`}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted hover:text-foreground"
                >
                  <Icons.attach aria-hidden /> {a.originalName} <span className="text-faint">({formatFileSize(a.size)})</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export function MessageThread({ messages, currentUserId, studioName }: { messages: MessageView[]; currentUserId: string; studioName: string }) {
  return (
    <ol className="space-y-5" aria-label="Messages">
      {messages.map((m) => (
        <MessageBubble key={m.id} message={m} own={m.sender?.id === currentUserId} studioName={studioName} />
      ))}
    </ol>
  );
}
