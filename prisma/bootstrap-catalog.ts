import type { PrismaClient } from "../db/generated/prisma/client";
import { PACKAGES, PORTFOLIO, SERVICES } from "./catalog-data";

/**
 * Sets up a brand-new site exactly once: studio settings, default services,
 * pricing packages (without prices) and labelled SAMPLE portfolio items.
 *
 * The SiteSettings row doubles as the "already bootstrapped" marker, so content
 * the owner later edits or deletes is never re-created on future deploys.
 * Never creates users, clients or projects.
 */
export async function bootstrapCatalog(db: PrismaClient) {
  const existing = await db.siteSettings.findUnique({ where: { id: "default" } });
  if (existing) return { bootstrapped: false as const };

  await db.$transaction(async (tx) => {
    if ((await tx.service.count()) === 0) {
      await tx.service.createMany({
        data: SERVICES.map((s, i) => ({ ...s, sortOrder: i, description: null, pricingText: null })),
      });
    }
    if ((await tx.pricingPackage.count()) === 0) {
      await tx.pricingPackage.createMany({ data: PACKAGES.map((p, i) => ({ ...p, sortOrder: i, priceCents: null })) });
    }
    if ((await tx.portfolioItem.count()) === 0) {
      await tx.portfolioItem.createMany({
        data: PORTFOLIO.map((p, i) => ({
          slug: p.slug,
          title: p.title,
          description: p.description,
          industry: p.industry,
          services: p.services,
          imageUrl: `/portfolio/${p.image}.svg`,
          featured: p.featured,
          isDemo: true,
          published: true,
          sortOrder: i,
        })),
      });
    }
    await tx.siteSettings.create({ data: { id: "default" } });
  });
  return { bootstrapped: true as const };
}
