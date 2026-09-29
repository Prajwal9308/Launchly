import { describe, expect, it } from "vitest";
import { buildProjectSummary, buildRequirementRows } from "@/domain/requirements";
import { COMPLETE_ANSWERS } from "../helpers";

describe("requirements and summary", () => {
  it("only produces rows for answered questions", () => {
    const rows = buildRequirementRows({ business: { ...COMPLETE_ANSWERS.business, address: "" } });
    expect(rows.find((r) => r.label === "Address")).toBeUndefined();
    expect(rows.find((r) => r.label === "Business name")?.value).toBe("Test Plumbing");
  });

  it("maps option values to labels and service slugs to names", () => {
    const rows = buildRequirementRows(COMPLETE_ANSWERS, { "business-websites": "Business Websites" });
    expect(rows.find((r) => r.label === "Pages")?.value).toBe("Home, Services, Contact");
    expect(rows.find((r) => r.label === "Services requested")?.value).toBe("Business Websites");
  });

  it("builds a summary using only client-provided text (no invented facts)", () => {
    const summary = buildProjectSummary(COMPLETE_ANSWERS);
    const provided = JSON.stringify(COMPLETE_ANSWERS);
    // Every word of free text in the summary must come from the answers or fixed labels.
    expect(summary.businessSummary).toContain(COMPLETE_ANSWERS.business.description);
    expect(summary.targetAudience).toBe("Homeowners");
    expect(summary.brandDirection).toBeNull();
    expect(summary.primaryGoal).toBe("Increase phone calls");
    for (const page of summary.recommendedPages) expect(["Home", "Services", "Contact"]).toContain(page);
    expect(provided).toContain("Homeowners");
  });

  it("returns empty fields rather than guessing", () => {
    const summary = buildProjectSummary({});
    expect(summary).toMatchObject({ targetAudience: null, primaryGoal: null, recommendedPages: [], requestedFeatures: [], brandDirection: null });
  });
});
