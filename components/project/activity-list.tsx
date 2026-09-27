import {
  Activity,
  CheckCircle2,
  FileUp,
  FolderPlus,
  LogIn,
  MessageSquare,
  Palette,
  RefreshCw,
  Send,
  StickyNote,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import type { ActivityType } from "@/db/enums";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime, formatRelative } from "@/lib/format";

const ICONS: Partial<Record<ActivityType, LucideIcon>> = {
  USER_REGISTERED: UserPlus,
  LEAD_CREATED: UserPlus,
  PROJECT_CREATED: FolderPlus,
  PROJECT_SUBMITTED: Send,
  TASK_COMPLETED: CheckCircle2,
  REQUIREMENTS_APPROVED: CheckCircle2,
  FILE_UPLOADED: FileUp,
  MESSAGE_SENT: MessageSquare,
  DESIGN_UPLOADED: Palette,
  DESIGN_REVIEW_REQUESTED: Palette,
  REVISION_REQUESTED: RefreshCw,
  DESIGN_APPROVED: CheckCircle2,
  APPROVAL_GRANTED: CheckCircle2,
  STATUS_CHANGED: RefreshCw,
  NOTE_ADDED: StickyNote,
  CLIENT_LOGIN: LogIn,
  ADMIN_LOGIN: LogIn,
};

export interface ActivityView {
  id: string;
  type: ActivityType;
  message: string;
  visibility: "CLIENT" | "INTERNAL";
  createdAt: Date;
  actor: { firstName: string; lastName: string; role: "ADMIN" | "CLIENT" } | null;
  project?: { id: string; name: string } | null;
}

export function ActivityItem({ event, showProject, projectHref, showVisibility }: { event: ActivityView; showProject?: boolean; projectHref?: (id: string) => string; showVisibility?: boolean }) {
  const Icon = ICONS[event.type] ?? Activity;
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      <span aria-hidden className="absolute left-[13px] top-8 h-[calc(100%-1.75rem)] w-px bg-border group-last:hidden" />
      <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-faint">
        <Icon className="size-3.5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-sm text-foreground">
          {event.message}
          {showProject && event.project && (
            <>
              {" · "}
              {projectHref ? (
                <Link href={projectHref(event.project.id)} className="text-muted hover:text-foreground hover:underline">
                  {event.project.name}
                </Link>
              ) : (
                <span className="text-muted">{event.project.name}</span>
              )}
            </>
          )}
        </p>
        <p className="mt-0.5 text-xs text-faint">
          {event.actor ? `${event.actor.firstName} ${event.actor.lastName}` : "System"} ·{" "}
          <time dateTime={event.createdAt.toISOString()} title={formatDateTime(event.createdAt)}>
            {formatRelative(event.createdAt)}
          </time>
          {showVisibility && event.visibility === "INTERNAL" && <span className="ml-1.5 rounded bg-subtle px-1.5 py-0.5">Internal</span>}
        </p>
      </div>
    </li>
  );
}

export function ActivityList({
  events,
  showProject,
  projectHref,
  showVisibility,
  emptyText = "Activity will appear here as the project moves forward.",
}: {
  events: ActivityView[];
  showProject?: boolean;
  projectHref?: (id: string) => string;
  showVisibility?: boolean;
  emptyText?: string;
}) {
  if (!events.length) return <EmptyState icon={Activity} title="No activity yet" description={emptyText} compact />;
  return (
    <ol className="[&>li:last-child>span:first-child]:hidden">
      {events.map((e) => (
        <ActivityItem key={e.id} event={e} showProject={showProject} projectHref={projectHref} showVisibility={showVisibility} />
      ))}
    </ol>
  );
}
