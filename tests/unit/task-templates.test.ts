import { describe, expect, it } from "vitest";
import { BASE_TASKS, selectTaskTemplates } from "@/domain/task-templates";

const keys = (draft: Parameters<typeof selectTaskTemplates>[0]) => selectTaskTemplates(draft).map((t) => t.key);

describe("task templates", () => {
  it("creates the standard business website tasks", () => {
    expect(keys({})).toEqual(BASE_TASKS.map((t) => t.key));
    expect(selectTaskTemplates({}).map((t) => t.title)).toEqual([
      "Review requirements",
      "Review submitted materials",
      "Create sitemap",
      "Homepage design",
      "Design review",
      "Revisions",
      "Development",
      "Testing",
      "Final approval",
      "Launch",
    ]);
  });

  it("adds e-commerce tasks when e-commerce is selected (service or feature)", () => {
    expect(keys({ website: { pages: [], pagesOther: "", services: ["ecommerce-websites"] } })).toContain("ecommerce-checkout");
    expect(keys({ features: { features: ["ECOMMERCE"], featuresOther: "" } })).toContain("ecommerce-catalog");
  });

  it("adds SEO tasks when SEO is selected, with search console after launch", () => {
    const k = keys({ website: { pages: [], pagesOther: "", services: ["seo-foundations"] } });
    expect(k).toContain("seo-page-plan");
    expect(k.indexOf("seo-search-console")).toBeGreaterThan(k.indexOf("launch"));
  });

  it("keeps e-commerce tasks before testing", () => {
    const k = keys({ features: { features: ["PAYMENTS"], featuresOther: "" } });
    expect(k.indexOf("ecommerce-test-orders")).toBeLessThan(k.indexOf("testing"));
  });
});
