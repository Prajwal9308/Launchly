import { db } from "@/db";
import type { Actor } from "./actor";
import { requireAdmin } from "./authz";

/** Simple database-backed search across the studio's records. */
export async function searchAll(actor: Actor, rawQuery: string) {
  requireAdmin(actor);
  const q = rawQuery.trim().slice(0, 100);
  if (q.length < 2) return { q, projects: [], clients: [], businesses: [], leads: [] };
  const contains = { contains: q, mode: "insensitive" as const };

  const [projects, clients, businesses, leads] = await Promise.all([
    db.project.findMany({
      where: { OR: [{ name: contains }, { business: { name: contains } }] },
      take: 8,
      orderBy: { lastActivityAt: "desc" },
      select: { id: true, number: true, name: true, status: true, business: { select: { name: true } } },
    }),
    db.user.findMany({
      where: { role: "CLIENT", OR: [{ firstName: contains }, { lastName: contains }, { email: contains }] },
      take: 8,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        memberships: { take: 1, select: { organizationId: true } },
      },
    }),
    db.business.findMany({
      where: { OR: [{ name: contains }, { industry: contains }, { email: contains }] },
      take: 8,
      select: { id: true, name: true, industry: true, organizationId: true },
    }),
    db.lead.findMany({
      where: { OR: [{ name: contains }, { businessName: contains }, { email: contains }] },
      take: 8,
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, businessName: true, email: true, status: true },
    }),
  ]);
  return { q, projects, clients, businesses, leads };
}
