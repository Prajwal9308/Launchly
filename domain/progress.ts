import type { ProjectStatus, TaskStatus } from "@/db/enums";

/**
 * Client-facing project phases. Progress is derived from the project status
 * and the completion of its tasks — never hard-coded.
 */
export const PHASES = [
  { key: "submitted", label: "Project submitted" },
  { key: "requirements", label: "Requirements" },
  { key: "discovery", label: "Discovery" },
  { key: "design", label: "Design" },
  { key: "review", label: "Client review" },
  { key: "development", label: "Development" },
  { key: "testing", label: "Testing" },
  { key: "launch", label: "Launch" },
] as const;

export type PhaseKey = (typeof PHASES)[number]["key"];
export type PhaseState = "complete" | "current" | "upcoming";

/** Index of the phase currently in progress. PHASES.length means everything is done. */
const STATUS_PHASE_INDEX: Record<Exclude<ProjectStatus, "ON_HOLD" | "CANCELLED">, number> = {
  DRAFT: 0,
  NEW: 1,
  INFORMATION_REQUIRED: 1,
  REQUIREMENTS_REVIEW: 1,
  DISCOVERY: 2,
  DESIGN: 3,
  CLIENT_REVIEW: 4,
  REVISION: 4,
  DEVELOPMENT: 5,
  TESTING: 6,
  CLIENT_APPROVAL: 7,
  READY_TO_LAUNCH: 7,
  LAUNCHED: PHASES.length,
  MAINTENANCE: PHASES.length,
  COMPLETED: PHASES.length,
};

export function currentPhaseIndex(status: ProjectStatus, statusBeforeHold?: ProjectStatus | null): number {
  if (status === "ON_HOLD") {
    return statusBeforeHold && statusBeforeHold !== "ON_HOLD" ? currentPhaseIndex(statusBeforeHold) : 0;
  }
  if (status === "CANCELLED") return 0;
  return STATUS_PHASE_INDEX[status];
}

export function projectPhases(status: ProjectStatus, statusBeforeHold?: ProjectStatus | null) {
  const current = currentPhaseIndex(status, statusBeforeHold);
  return PHASES.map((phase, index) => ({
    ...phase,
    state: (index < current ? "complete" : index === current ? "current" : "upcoming") as PhaseState,
  }));
}

export interface ProgressInput {
  status: ProjectStatus;
  statusBeforeHold?: ProjectStatus | null;
  tasks: { status: TaskStatus }[];
}

/**
 * Percentage complete (0–100).
 * - Launched/maintenance/completed projects are 100%.
 * - Otherwise the greater of phase progress and task completion, capped at 99%
 *   so a project never reads as finished before it launches.
 */
export function calculateProgress({ status, statusBeforeHold, tasks }: ProgressInput): number {
  if (status === "DRAFT") return 0;
  const phaseIndex = currentPhaseIndex(status, statusBeforeHold);
  if (phaseIndex >= PHASES.length) return 100;

  const phasePercent = (phaseIndex / PHASES.length) * 100;
  const done = tasks.filter((t) => t.status === "DONE").length;
  const taskPercent = tasks.length > 0 ? (done / tasks.length) * 100 : 0;

  return Math.min(99, Math.round(Math.max(phasePercent, taskPercent)));
}
