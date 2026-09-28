import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { bootstrapCatalog } from "../../prisma/bootstrap-catalog";
import { resetDb } from "../helpers";

beforeEach(resetDb);

describe("production bootstrap", () => {
  it("adds default settings, services, unpriced packages and labelled samples to a new database", async () => {
    expect(await bootstrapCatalog(db)).toEqual({ bootstrapped: true });
    expect(await db.service.count()).toBe(5);
    const packages = await db.pricingPackage.findMany();
    expect(packages).toHaveLength(4);
    expect(packages.every((p) => p.priceCents === null)).toBe(true);
    const portfolio = await db.portfolioItem.findMany();
    expect(portfolio.length).toBeGreaterThan(0);
    expect(portfolio.every((p) => p.isDemo)).toBe(true);
    expect(await db.user.count()).toBe(0);
    expect(await db.project.count()).toBe(0);
  });

  it("runs only once, so the owner's later edits and deletions are kept", async () => {
    await bootstrapCatalog(db);
    await db.portfolioItem.deleteMany();
    await db.service.deleteMany({ where: { slug: "business-solutions" } });
    expect(await bootstrapCatalog(db)).toEqual({ bootstrapped: false });
    expect(await db.portfolioItem.count()).toBe(0);
    expect(await db.service.count()).toBe(4);
  });
});
