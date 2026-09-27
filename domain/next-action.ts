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
    title: "Your approval is needed",
    description: "Please review and approve the design.",
  },
  FINAL_APPROVAL: {
    title: "Your website is ready for final approval",
    description: "Review the finished website and approve it, or tell us what needs to change.",
  },
  LAUNCH_APPROVAL: {
    title: "Approve your website launch",
    description: "Confirm you're ready for the website to go live.",
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
      title: "Finish your project questionnaire",
      description: "Your answers are saved. Complete the remaining steps and submit your project.",
      href: `/start-project/${input.projectId}`,
      cta: "Continue questionnaire",
    };
  }

  const review = input.reviewsAwaiting[0];
  if (review) {
    return {
      required: true,
      title: `Your ${review.title.toLowerCase()} design is ready`,
      description: `Version ${review.version} is ready for your review. Approve it or request changes.`,
      href: `${base}/reviews`,
      cta: "Review design",
    };
  }

  const approval = input.approvalsAwaiting[0];
  if (approval) {
    return { required: true, ...APPROVAL_COPY[approval.type], href: `${base}/reviews`, cta: "Review and approve" };
  }

  if (input.status === "INFORMATION_REQUIRED") {
    return {
      required: true,
      title: "We need a few more details",
      description: "We need a few more details before we can continue. Check your messages for what's needed.",
      href: `${base}/messages`,
      cta: "Provide information",
    };
  }

  if (input.unreadMessages > 0) {
    return {
      required: true,
      title: input.unreadMessages === 1 ? "You have a new message" : `You have ${input.unreadMessages} new messages`,
      description: "Read and reply to keep your project moving.",
      href: `${base}/messages`,
      cta: "Read messages",
    };
  }

  return {
    required: false,
    title: "No action needed right now",
    description: "We'll let you know here as soon as there's something for you to review.",
    href: base,
    cta: "View project",
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
      return "Waiting for client to submit questionnaire";
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
