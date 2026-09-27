import type {
  ApprovalStatus,
  DesignReviewStatus,
  LeadStatus,
  ProjectStatus,
  TaskPriority,
  TaskStatus,
} from "@/db/enums";
import { STATUS_LABELS, STATUS_TONES } from "@/domain/project-status";
import { Badge, type BadgeProps } from "./badge";

type Tone = NonNullable<BadgeProps["tone"]>;

export function ProjectStatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <Badge tone={STATUS_TONES[status]} dot>
      {STATUS_LABELS[status]}
    </Badge>
  );
}

const TASK: Record<TaskStatus, [string, Tone]> = {
  TODO: ["To do", "neutral"],
  IN_PROGRESS: ["In progress", "info"],
  BLOCKED: ["Blocked", "danger"],
  DONE: ["Done", "success"],
};
export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const [label, tone] = TASK[status];
  return <Badge tone={tone}>{label}</Badge>;
}

const PRIORITY: Record<TaskPriority, [string, Tone]> = {
  LOW: ["Low", "outline"],
  MEDIUM: ["Medium", "outline"],
  HIGH: ["High", "warning"],
  URGENT: ["Urgent", "danger"],
};
export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const [label, tone] = PRIORITY[priority];
  return <Badge tone={tone}>{label}</Badge>;
}

const LEAD: Record<LeadStatus, [string, Tone]> = {
  NEW: ["New", "accent"],
  CONTACTED: ["Contacted", "info"],
  QUALIFIED: ["Qualified", "warning"],
  CONVERTED: ["Converted", "success"],
  LOST: ["Lost", "neutral"],
};
export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  const [label, tone] = LEAD[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

const REVIEW: Record<DesignReviewStatus, [string, Tone]> = {
  DRAFT: ["Draft — not shared", "neutral"],
  IN_REVIEW: ["Awaiting review", "warning"],
  CHANGES_REQUESTED: ["Changes requested", "info"],
  APPROVED: ["Approved", "success"],
  SUPERSEDED: ["Superseded", "outline"],
};
export function ReviewStatusBadge({ status }: { status: DesignReviewStatus }) {
  const [label, tone] = REVIEW[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}

const APPROVAL: Record<ApprovalStatus, [string, Tone]> = {
  PENDING: ["Awaiting approval", "warning"],
  APPROVED: ["Approved", "success"],
  CHANGES_REQUESTED: ["Changes requested", "info"],
  CANCELLED: ["Withdrawn", "neutral"],
};
export function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  const [label, tone] = APPROVAL[status];
  return (
    <Badge tone={tone} dot>
      {label}
    </Badge>
  );
}
