import type { ProjectStatus } from "@/db/generated/prisma/enums";

/**
 * Project workflow state machine. All status changes go through
 * `canTransition` on the server — the UI only offers what this allows.
 */

export const PROJECT_STATUSES = [
  "DRAFT",
  "NEW",
  "INFORMATION_REQUIRED",
  "REQUIREMENTS_REVIEW",
  "DISCOVERY",
  "DESIGN",
  "CLIENT_REVIEW",
  "REVISION",
  "DEVELOPMENT",
  "TESTING",
  "CLIENT_APPROVAL",
  "READY_TO_LAUNCH",
  "LAUNCHED",
  "MAINTENANCE",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
] as const satisfies readonly ProjectStatus[];

/** Statuses that represent an in-flight project. */
export const ACTIVE_STATUSES: ProjectStatus[] = [
  "NEW",
  "INFORMATION_REQUIRED",
  "REQUIREMENTS_REVIEW",
  "DISCOVERY",
  "DESIGN",
  "CLIENT_REVIEW",
  "REVISION",
  "DEVELOPMENT",
  "TESTING",
  "CLIENT_APPROVAL",
  "READY_TO_LAUNCH",
];

/** Statuses where the next move is on the client. */
export const AWAITING_CLIENT_STATUSES: ProjectStatus[] = ["INFORMATION_REQUIRED", "CLIENT_REVIEW", "CLIENT_APPROVAL"];

const COMMON_EXITS: ProjectStatus[] = ["ON_HOLD", "CANCELLED"];

const TRANSITIONS: Record<ProjectStatus, ProjectStatus[]> = {
  // DRAFT -> NEW happens only through questionnaire submission.
  DRAFT: ["CANCELLED"],
  NEW: ["REQUIREMENTS_REVIEW", "INFORMATION_REQUIRED", "DISCOVERY", ...COMMON_EXITS],
  INFORMATION_REQUIRED: ["REQUIREMENTS_REVIEW", "DISCOVERY", ...COMMON_EXITS],
  REQUIREMENTS_REVIEW: ["DISCOVERY", "INFORMATION_REQUIRED", ...COMMON_EXITS],
  DISCOVERY: ["DESIGN", "INFORMATION_REQUIRED", ...COMMON_EXITS],
  DESIGN: ["CLIENT_REVIEW", "INFORMATION_REQUIRED", ...COMMON_EXITS],
  CLIENT_REVIEW: ["REVISION", "DESIGN", "DEVELOPMENT", ...COMMON_EXITS],
  REVISION: ["CLIENT_REVIEW", "DESIGN", "DEVELOPMENT", ...COMMON_EXITS],
  DEVELOPMENT: ["TESTING", "CLIENT_REVIEW", ...COMMON_EXITS],
  TESTING: ["CLIENT_APPROVAL", "DEVELOPMENT", ...COMMON_EXITS],
  CLIENT_APPROVAL: ["READY_TO_LAUNCH", "DEVELOPMENT", "REVISION", ...COMMON_EXITS],
  READY_TO_LAUNCH: ["LAUNCHED", "CLIENT_APPROVAL", ...COMMON_EXITS],
  LAUNCHED: ["MAINTENANCE", "COMPLETED"],
  MAINTENANCE: ["COMPLETED"],
  ON_HOLD: [...ACTIVE_STATUSES, "CANCELLED"],
  COMPLETED: ["MAINTENANCE"],
  CANCELLED: [],
};

export function allowedTransitions(from: ProjectStatus, statusBeforeHold?: ProjectStatus | null): ProjectStatus[] {
  if (from === "ON_HOLD" && statusBeforeHold) {
    // Resuming returns to where the project was; cancelling is always possible.
    return [statusBeforeHold, "CANCELLED"];
  }
  return TRANSITIONS[from];
}

export function canTransition(from: ProjectStatus, to: ProjectStatus, statusBeforeHold?: ProjectStatus | null) {
  if (from === to) return false;
  return allowedTransitions(from, statusBeforeHold).includes(to);
}

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  DRAFT: "Draft",
  NEW: "New request",
  INFORMATION_REQUIRED: "Information required",
  REQUIREMENTS_REVIEW: "Requirements review",
  DISCOVERY: "Discovery",
  DESIGN: "Design",
  CLIENT_REVIEW: "Client review",
  REVISION: "Revisions",
  DEVELOPMENT: "Development",
  TESTING: "Testing",
  CLIENT_APPROVAL: "Awaiting approval",
  READY_TO_LAUNCH: "Ready to launch",
  LAUNCHED: "Launched",
  MAINTENANCE: "Maintenance",
  ON_HOLD: "On hold",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

/** Plain-language status descriptions for clients. */
export const CLIENT_STATUS_DESCRIPTIONS: Record<ProjectStatus, string> = {
  DRAFT: "Finish the questionnaire and submit your project to get started.",
  NEW: "We've received your project and will review your details shortly.",
  INFORMATION_REQUIRED: "We need a few more details from you before we continue.",
  REQUIREMENTS_REVIEW: "We're reviewing your requirements and assets.",
  DISCOVERY: "We're planning your website structure and content.",
  DESIGN: "We're designing your website.",
  CLIENT_REVIEW: "A design is ready for your review.",
  REVISION: "We're working on the changes you requested.",
  DEVELOPMENT: "We're building your website.",
  TESTING: "We're testing your website across devices and browsers.",
  CLIENT_APPROVAL: "Your website is ready for your final approval.",
  READY_TO_LAUNCH: "Everything is approved. We're preparing to launch.",
  LAUNCHED: "Your website is live.",
  MAINTENANCE: "Your website is live and under maintenance.",
  ON_HOLD: "This project is currently on hold.",
  COMPLETED: "This project is complete.",
  CANCELLED: "This project was cancelled.",
};

export type StatusTone = "neutral" | "info" | "warning" | "success" | "danger" | "accent";

export const STATUS_TONES: Record<ProjectStatus, StatusTone> = {
  DRAFT: "neutral",
  NEW: "accent",
  INFORMATION_REQUIRED: "warning",
  REQUIREMENTS_REVIEW: "info",
  DISCOVERY: "info",
  DESIGN: "info",
  CLIENT_REVIEW: "warning",
  REVISION: "info",
  DEVELOPMENT: "info",
  TESTING: "info",
  CLIENT_APPROVAL: "warning",
  READY_TO_LAUNCH: "success",
  LAUNCHED: "success",
  MAINTENANCE: "success",
  ON_HOLD: "neutral",
  COMPLETED: "success",
  CANCELLED: "danger",
};
