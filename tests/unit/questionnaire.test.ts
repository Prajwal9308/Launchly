import { describe, expect, it } from "vitest";
import { businessStep, parseDraft, validateForSubmission, websiteStep } from "@/domain/questionnaire";
import { COMPLETE_ANSWERS } from "../helpers";

describe("questionnaire validation", () => {
  it("accepts a complete questionnaire", () => {
    expect(validateForSubmission(COMPLETE_ANSWERS)).toEqual([]);
  });

  it("reports each missing required answer with its step", () => {
    const issues = validateForSubmission({});
    const keys = issues.map((i) => `${i.step}.${i.field}`);
    expect(keys).toEqual(
      expect.arrayContaining([
        "business.businessName",
        "business.industry",
        "business.description",
        "goals.primaryGoal",
        "website.pages",
        "content.hasContent",
        "final.budgetRange",
        "final.timeframe",
      ]),
    );
  });

  it("requires an explanation when the goal is Other", () => {
    const issues = validateForSubmission({ ...COMPLETE_ANSWERS, goals: { ...COMPLETE_ANSWERS.goals, primaryGoal: "OTHER", primaryGoalOther: "" } });
    expect(issues.map((i) => i.field)).toContain("primaryGoalOther");
  });

  it("normalizes website URLs and rejects invalid ones", () => {
    const ok = businessStep.parse({ existingWebsite: "example.com" });
    expect(ok.existingWebsite).toBe("https://example.com");
    expect(businessStep.safeParse({ existingWebsite: "not a url" }).success).toBe(false);
  });

  it("rejects unknown page options", () => {
    expect(websiteStep.safeParse({ pages: ["HOME", "HACKED"] }).success).toBe(false);
  });

  it("drops malformed steps when parsing stored drafts", () => {
    const draft = parseDraft({ business: { businessName: "Ok" }, website: { pages: ["NOPE"] } });
    expect(draft.business?.businessName).toBe("Ok");
    expect(draft.website).toBeUndefined();
  });

  it("limits text length", () => {
    expect(businessStep.safeParse({ description: "x".repeat(2001) }).success).toBe(false);
  });
});
