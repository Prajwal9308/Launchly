import { describe, expect, it } from "vitest";
import { calculateProgress, currentPhaseIndex, PHASES, projectPhases } from "@/domain/progress";

const tasks = (done: number, total: number) =>
  Array.from({ length: total }, (_, i) => ({ status: i < done ? ("DONE" as const) : ("TODO" as const) }));

describe("progress", () => {
  it("is 0 for drafts", () => {
    expect(calculateProgress({ status: "DRAFT", tasks: tasks(3, 10) })).toBe(0);
  });

  it("is 100 once launched, regardless of tasks", () => {
    expect(calculateProgress({ status: "LAUNCHED", tasks: tasks(0, 10) })).toBe(100);
    expect(calculateProgress({ status: "COMPLETED", tasks: [] })).toBe(100);
  });

  it("uses task completion when ahead of the phase", () => {
    expect(calculateProgress({ status: "NEW", tasks: tasks(6, 10) })).toBe(60);
  });

  it("uses the phase when ahead of task completion", () => {
    const phasePercent = Math.round((currentPhaseIndex("DEVELOPMENT") / PHASES.length) * 100);
    expect(calculateProgress({ status: "DEVELOPMENT", tasks: tasks(1, 10) })).toBe(phasePercent);
  });

  it("never reports 100% before launch", () => {
    expect(calculateProgress({ status: "READY_TO_LAUNCH", tasks: tasks(10, 10) })).toBe(99);
  });

  it("uses the pre-hold phase for on-hold projects", () => {
    expect(currentPhaseIndex("ON_HOLD", "DESIGN")).toBe(currentPhaseIndex("DESIGN"));
  });

  it("marks phases complete/current/upcoming", () => {
    const phases = projectPhases("DESIGN");
    expect(phases.filter((p) => p.state === "complete").map((p) => p.key)).toEqual(["submitted", "requirements", "discovery"]);
    expect(phases.find((p) => p.state === "current")?.key).toBe("design");
    expect(phases.at(-1)?.state).toBe("upcoming");
  });
});
