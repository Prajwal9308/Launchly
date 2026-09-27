import { db, type Prisma } from "@/db";
import { notFound } from "@/lib/errors";
import type { Actor } from "./actor";
import { isUuid, requireAdmin } from "./authz";

/** A "client" is an organization: its members, businesses and projects. */
export async function listClients(actor: Actor, params: { q?: string; page?: number; pageSize?: number }) {
  requireAdmin(actor);
  const pageSize = params.pageSize ?? 20;
  const page = Math.max(1, params.page ?? 1);
  const q = params.q?.trim().slice(0, 100);
  const where: Prisma.OrganizationWhereInput = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { inviteEmail: { contains: q, mode: "insensitive" } },
          { businesses: { some: { name: { contains: q, mode: "insensitive" } } } },
          {
            members: {
              some: {
                user: {
                  OR: [
                    { firstName: { contains: q, mode: "insensitive" } },
                    { lastName: { contains: q, mode: "insensitive" } },
                    { email: { contains: q, mode: "insensitive" } },
                  ],
                },
              },
            },
          },
        ],
      }
    : {};
  const [items, total] = await Promise.all([
    db.organization.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        members: {
          take: 1,
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true, lastLoginAt: true, clientProfile: { select: { phone: true } } },
            },
          },
        },
        businesses: { select: { name: true, industry: true }, take: 1 },
        _count: { select: { projects: true } },
        projects: { orderBy: { lastActivityAt: "desc" }, take: 1, select: { status: true, lastActivityAt: true } },
      },
    }),
    db.organization.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function getClient(actor: Actor, organizationId: string) {
  requireAdmin(actor);
  const org = isUuid(organizationId)
    ? await db.organization.findUnique({
        where: { id: organizationId },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  createdAt: true,
                  lastLoginAt: true,
                  clientProfile: { select: { phone: true } },
                },
              },
            },
          },
          businesses: true,
          projects: {
            orderBy: { createdAt: "desc" },
            select: { id: true, number: true, name: true, status: true, createdAt: true, lastActivityAt: true },
          },
          leads: { select: { id: true, name: true, createdAt: true } },
        },
      })
    : null;
  if (!org) throw notFound("This client could not be found.");
  return org;
}
