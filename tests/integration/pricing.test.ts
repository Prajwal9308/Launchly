import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { DEFAULT_SETTINGS, savePricingPackage, updateSiteSettings } from "@/services/catalog";
import { saveQuestionnaireStep, startDraftProject, submitProject } from "@/services/projects";
import { COMPLETE_ANSWERS, createAdmin, createClient, resetDb } from "../helpers";

beforeEach(resetDb);

const settingsInput = {
  businessName: "CoreGravity",
  contactEmail: "studio@example.test",
  budgetRangesCa: DEFAULT_SETTINGS.budgetRangesCa.join("\n"),
  budgetRangesIn: DEFAULT_SETTINGS.budgetRangesIn.join("\n"),
};

describe("country pricing", () => {
  it("stores separate CAD and INR prices as whole amounts", async () => {
    const admin = await createAdmin();
    const pkg = await savePricingPackage(admin, null, { name: "Website", description: "A website.", priceCad: "CA$1,500", priceInr: "1,50,000" });
    expect(pkg.priceCad).toBe(1500);
    expect(pkg.priceInr).toBe(150000);
  });

  it("leaves a country unpriced when its price is blank", async () => {
    const admin = await createAdmin();
    const pkg = await savePricingPackage(admin, null, { name: "Custom", description: "Custom work.", priceCad: "", priceInr: "90000" });
    expect(pkg.priceCad).toBeNull();
    expect(pkg.priceInr).toBe(90000);
  });

  it("rejects USD budget ranges in settings", async () => {
    const admin = await createAdmin();
    await expect(updateSiteSettings(admin, { ...settingsInput, budgetRangesCa: "Under US$2,000" })).rejects.toMatchObject({
      code: "VALIDATION",
      fieldErrors: { budgetRangesCa: expect.any(Array) },
    });
  });

  it("saves the business country to the client's account and the submitted project", async () => {
    const client = await createClient();
    const { id } = await startDraftProject(client);
    const answers = { ...COMPLETE_ANSWERS, business: { ...COMPLETE_ANSWERS.business, country: "IN" as const }, final: { ...COMPLETE_ANSWERS.final, budgetRange: "₹1,50,000 – ₹3,00,000" } };
    for (const [step, data] of Object.entries(answers)) await saveQuestionnaireStep(client, id, step as keyof typeof answers, data);
    await submitProject(client, id);
    const project = await db.project.findUniqueOrThrow({ where: { id }, include: { organization: true } });
    expect(project.country).toBe("IN");
    expect(project.organization.country).toBe("IN");
    expect(project.budgetRange).toBe("₹1,50,000 – ₹3,00,000");
  });

  it("rejects a budget from the other country's currency at submission", async () => {
    const client = await createClient();
    const { id } = await startDraftProject(client);
    const answers = { ...COMPLETE_ANSWERS, business: { ...COMPLETE_ANSWERS.business, country: "IN" as const } }; // budget is in CA$
    for (const [step, data] of Object.entries(answers)) await saveQuestionnaireStep(client, id, step as keyof typeof answers, data);
    await expect(submitProject(client, id)).rejects.toMatchObject({
      code: "VALIDATION",
      fieldErrors: { "final.budgetRange": expect.any(Array) },
    });
  });
});
