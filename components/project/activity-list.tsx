import { IconTile, Icons, type LucideIcon } from "@/components/ui/icons";
import Link from "next/link";
import type { ActivityType } from "@/db/enums";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDateTime, formatRelative } from "@/lib/format";

/** One icon per event type. Complete by type, so a new ActivityType fails to compile until it has an icon. */
const ICONS: Record<ActivityType, LucideIcon> = {
  USER_REGISTERED: Icons.signup,
  LEAD_CREATED: Icons.leads,
  LEAD_CONVERTED: Icons.clientConverted,
  PROJECT_CREATED: Icons.newProject,
  PROJECT_SUBMITTED: Icons.send,
  PROJECT_UPDATED: Icons.edit,
  REQUIREMENTS_APPROVED: Icons.requirementsApproved,
  INFORMATION_REQUESTED: Icons.help,
  TASK_CREATED: Icons.newTask,
  TASK_COMPLETED: Icons.tasks,
  FILE_UPLOADED: Icons.upload,
  MESSAGE_SENT: Icons.messages,
  DESIGN_UPLOADED: Icons.design,
  DESIGN_REVIEW_REQUESTED: Icons.design,
  REVISION_REQUESTED: Icons.revision,
  DESIGN_APPROVED: Icons.approved,
  APPROVAL_REQUESTED: Icons.waiting,
  APPROVAL_GRANTED: Icons.approved,
  APPROVAL_CHANGES_REQUESTED: Icons.revision,
  STATUS_CHANGED: Icons.timeline,
  NOTE_ADDED: Icons.notes,
  CLIENT_LOGIN: Icons.login,
  ADMIN_LOGIN: Icons.login,
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
  const Icon = ICONS[event.type];
  return (
    <li className="relative flex gap-3 pb-5 last:pb-0">
      <span aria-hidden className="absolute left-[15.5px] top-9 h-[calc(100%-2rem)] w-px bg-border group-last:hidden" />
      <IconTile icon={Icon} size="sm" tone="neutral" className="relative z-10 rounded-full" />
      <div className="min-w-0 flex-1 pt-1.5">
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
          {event.actor ? `${event.actor.firstName} ${event.actor.lastName}` : "CoreGravity"} ·{" "}
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
  if (!events.length) return <EmptyState icon={Icons.activity} title="No activity yet" description={emptyText} compact />;
  return (
    <ol className="[&>li:last-child>span:first-child]:hidden">
      {events.map((e) => (
        <ActivityItem key={e.id} event={e} showProject={showProject} projectHref={projectHref} showVisibility={showVisibility} />
      ))}
    </ol>
  );
}
