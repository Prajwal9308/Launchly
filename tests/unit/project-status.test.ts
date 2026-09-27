import { describe, expect, it } from "vitest";
import { allowedTransitions, canTransition, PROJECT_STATUSES } from "@/domain/project-status";

describe("project status transitions", () => {
  it("allows the standard workflow path", () => {
    const path = [
      "NEW",
      "REQUIREMENTS_REVIEW",
      "DISCOVERY",
      "DESIGN",
      "CLIENT_REVIEW",
      "REVISION",
      "CLIENT_REVIEW",
      "DEVELOPMENT",
      "TESTING",
      "CLIENT_APPROVAL",
      "READY_TO_LAUNCH",
      "LAUNCHED",
      "MAINTENANCE",
      "COMPLETED",
    ] as const;
    for (let i = 0; i < path.length - 1; i++) {
      expect(canTransition(path[i], path[i + 1]), `${path[i]} -> ${path[i + 1]}`).toBe(true);
    }
  });

  it("rejects skipping straight to launch", () => {
    expect(canTransition("NEW", "LAUNCHED")).toBe(false);
    expect(canTransition("DESIGN", "READY_TO_LAUNCH")).toBe(false);
    expect(canTransition("DEVELOPMENT", "LAUNCHED")).toBe(false);
  });

  it("only lets drafts become NEW through submission (not via status change)", () => {
    expect(canTransition("DRAFT", "NEW")).toBe(false);
    expect(allowedTransitions("DRAFT")).toEqual(["CANCELLED"]);
  });

  it("treats cancelled as terminal", () => {
    for (const s of PROJECT_STATUSES) expect(canTransition("CANCELLED", s)).toBe(false);
  });

  it("never allows a no-op transition", () => {
    for (const s of PROJECT_STATUSES) expect(canTransition(s, s)).toBe(false);
  });

  it("resumes an on-hold project only to its previous status", () => {
    expect(allowedTransitions("ON_HOLD", "DESIGN")).toEqual(["DESIGN", "CANCELLED"]);
    expect(canTransition("ON_HOLD", "DEVELOPMENT", "DESIGN")).toBe(false);
    expect(canTransition("ON_HOLD", "DESIGN", "DESIGN")).toBe(true);
  });

  it("every active status can be put on hold or cancelled", () => {
    for (const s of ["NEW", "DESIGN", "DEVELOPMENT", "TESTING"] as const) {
      expect(canTransition(s, "ON_HOLD")).toBe(true);
      expect(canTransition(s, "CANCELLED")).toBe(true);
    }
  });
});
