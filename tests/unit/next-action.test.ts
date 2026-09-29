import { describe, expect, it } from "vitest";
import { adminNextAction, clientNextAction } from "@/domain/next-action";

const base = { projectId: "p1", reviewsAwaiting: [], approvalsAwaiting: [], unreadMessages: 0 };

describe("client next action", () => {
  it("prioritizes a design awaiting review", () => {
    const a = clientNextAction({ ...base, status: "CLIENT_REVIEW", reviewsAwaiting: [{ id: "r", title: "Homepage", version: 2 }], unreadMessages: 3 });
    expect(a).toMatchObject({ required: true, cta: "Review Design", href: "/dashboard/project/p1/reviews" });
    expect(a.description).toContain("Homepage version 2");
  });

  it("asks for information when required", () => {
    expect(clientNextAction({ ...base, status: "INFORMATION_REQUIRED" }).cta).toBe("Provide Information");
  });

  it("sends drafts back to the questionnaire", () => {
    expect(clientNextAction({ ...base, status: "DRAFT" }).href).toBe("/start-project/p1");
  });

  it("reports no action when nothing is pending", () => {
    expect(clientNextAction({ ...base, status: "DEVELOPMENT" }).required).toBe(false);
  });
});

describe("admin next action", () => {
  const input = { openRevisions: 0, pendingApprovals: 0, reviewsAwaitingClient: 0, hasUnreadClientMessages: false };
  it("flags new requests", () => {
    expect(adminNextAction({ ...input, status: "NEW" })).toBe("Review new project request");
  });
  it("puts revisions ahead of the next task", () => {
    expect(adminNextAction({ ...input, status: "REVISION", openRevisions: 2, nextTaskTitle: "Development" })).toBe("Address 2 revision requests");
  });
  it("falls back to the next open task", () => {
    expect(adminNextAction({ ...input, status: "DEVELOPMENT", nextTaskTitle: "Testing" })).toBe("Testing");
  });
});
