import type { ApprovalType, ProjectStatus } from "@/db/enums";
import { STATUS_LABELS } from "./project-status";

export interface ClientActionInput {
  projectId: string;
  status: ProjectStatus;
  reviewsAwaiting: { id: string; title: string; version: number }[];
  approvalsAwaiting: { id: string; type: ApprovalType }[];
  unreadMessages: number;
}

export interface ClientAction {
  required: boolean;
  title: string;
  description: string;
  href: string;
  cta: string;
}

const APPROVAL_COPY: Record<ApprovalType, { title: string; description: string }> = {
  DESIGN_APPROVAL: {
    title: "Your approval is required",
    description: "Your design is ready for review. Please review the design and either approve it or tell us what changes you would like.",
  },
  FINAL_APPROVAL: {
    title: "Your website is ready for final approval",
    description: "Please review the completed website and either approve it for launch or tell us what needs to change.",
  },
  LAUNCH_APPROVAL: {
    title: "Launch approval required",
    description: "Please confirm that CoreGravity may proceed with launching your website.",
  },
};

/**
 * Works out what (if anything) the client needs to do next.
 * Order matters: the most important pending action wins.
 */
export function clientNextAction(input: ClientActionInput): ClientAction {
  const base = `/dashboard/project/${input.projectId}`;

  if (input.status === "DRAFT") {
    return {
      required: true,
      title: "Complete your project questionnaire",
      description: "Your answers have been saved. Complete the remaining steps and submit your project request.",
      href: `/start-project/${input.projectId}`,
      cta: "Continue Questionnaire",
    };
  }

  const review = input.reviewsAwaiting[0];
  if (review) {
    return {
      required: true,
      title: "Your design is ready for review",
      description: `${review.title} version ${review.version} is ready. Please review the design and either approve it or tell us what changes you would like.`,
      href: `${base}/reviews`,
      cta: "Review Design",
    };
  }

  const approval = input.approvalsAwaiting[0];
  if (approval) {
    return { required: true, ...APPROVAL_COPY[approval.type], href: `${base}/reviews`, cta: "Review and Approve" };
  }

  if (input.status === "INFORMATION_REQUIRED") {
    return {
      required: true,
      title: "Additional information required",
      description: "We need some additional information before we can continue. Please check your messages for details.",
      href: `${base}/messages`,
      cta: "Provide Information",
    };
  }

  if (input.unreadMessages > 0) {
    return {
      required: true,
      title: input.unreadMessages === 1 ? "You have a new message" : `You have ${input.unreadMessages} new messages`,
      description: "Please review and reply to keep your project moving.",
      href: `${base}/messages`,
      cta: "View Messages",
    };
  }

  return {
    required: false,
    title: "No action required",
    description: "We will let you know here when there is something for you to review.",
    href: base,
    cta: "Review Project",
  };
}

export interface AdminActionInput {
  status: ProjectStatus;
  openRevisions: number;
  pendingApprovals: number;
  reviewsAwaitingClient: number;
  hasUnreadClientMessages: boolean;
  nextTaskTitle?: string | null;
}

/** A short, plain description of what the studio should do next. */
export function adminNextAction(input: AdminActionInput): string {
  switch (input.status) {
    case "DRAFT":
      return "Waiting for client to submit the questionnaire";
    case "NEW":
      return "Review new project request";
    case "INFORMATION_REQUIRED":
      return "Waiting for client information";
    case "REQUIREMENTS_REVIEW":
      return "Approve requirements";
    case "CANCELLED":
    case "COMPLETED":
      return "No action";
    case "ON_HOLD":
      return "On hold";
  }
  if (input.hasUnreadClientMessages) return "Reply to client message";
  if (input.openRevisions > 0) return `Address ${input.openRevisions} revision request${input.openRevisions > 1 ? "s" : ""}`;
  if (input.reviewsAwaitingClient > 0) return "Waiting for client design review";
  if (input.pendingApprovals > 0) return "Waiting for client approval";
  if (input.status === "READY_TO_LAUNCH") return "Launch website";
  if (input.nextTaskTitle) return input.nextTaskTitle;
  return STATUS_LABELS[input.status];
}
