import { z } from "zod";
import { db, type LeadStatus, type Prisma } from "@/db";
import { conflict, notFound, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import { sendEmail, type EmailMessage } from "@/providers/email";
import { emailTemplates } from "@/providers/email/templates";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { isUuid, requireAdmin } from "./authz";
import { notifyAdmins } from "./notifications";

export const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"] as const;

export const leadSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name.").max(120),
  businessName: z.string().trim().max(120).optional().default(""),
  email: z.email("Please enter a valid email address.").trim().toLowerCase().max(254),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .default("")
    .refine((v) => !v || /^[+()\-.\s\d]{7,}$/.test(v), "Please enter a valid phone number."),
  /** Project type (Website, Mobile Application, …). */
  service: z.string().trim().max(120).optional().default(""),
  budgetRange: z.string().trim().max(60).optional().default(""),
  message: z.string().trim().min(1, "Please enter a message.").max(5000),
});

export type LeadInput = z.input<typeof leadSchema>;

/** Public contact form submission. */
export async function createLead(input: LeadInput) {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const data = parsed.data;

  const emails: EmailMessage[] = [];
  const result = await db.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        name: data.name,
        businessName: data.businessName || null,
        email: data.email,
        phone: data.phone || null,
        service: data.service || null,
        budgetRange: data.budgetRange || null,
        message: data.message,
      },
    });
    await recordActivity(tx, {
      type: "LEAD_CREATED",
      visibility: "INTERNAL",
      message: `New lead: ${data.name}${data.businessName ? ` (${data.businessName})` : ""}`,
      metadata: { leadId: lead.id },
    });
    const recipients = await notifyAdmins(tx, {
      type: "LEAD_CREATED",
      title: "New lead",
      body: `${data.name}${data.businessName ? ` · ${data.businessName}` : ""}`,
      href: `/admin/leads/${lead.id}`,
    });
    for (const r of recipients) emails.push(emailTemplates.newLead(r.email, data, lead.id));
    return { id: lead.id };
  });
  await Promise.all(emails.map(sendEmail));
  return result;
}

export interface LeadListParams {
  status?: string;
  q?: string;
  page?: number;
  pageSize?: number;
}

export async function listLeads(actor: Actor, params: LeadListParams) {
  requireAdmin(actor);
  const pageSize = params.pageSize ?? 20;
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.LeadWhereInput = {};
  if ((LEAD_STATUSES as readonly string[]).includes(params.status ?? "")) where.status = params.status as LeadStatus;
  const q = params.q?.trim().slice(0, 100);
  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { businessName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
    ];
  }
  const [items, total, counts] = await Promise.all([
    db.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
    db.lead.count({ where }),
    db.lead.groupBy({ by: ["status"], _count: { _all: true } }),
  ]);
  const byStatus = Object.fromEntries(counts.map((c) => [c.status, c._count._all])) as Partial<Record<LeadStatus, number>>;
  return { items, total, page, pageSize, byStatus };
}

export async function getLead(actor: Actor, leadId: string) {
  requireAdmin(actor);
  const lead = isUuid(leadId)
    ? await db.lead.findUnique({ where: { id: leadId }, include: { project: { select: { id: true, name: true } } } })
    : null;
  if (!lead) throw notFound("This lead could not be found.");
  return lead;
}

export async function updateLeadStatus(actor: Actor, leadId: string, status: LeadStatus) {
  requireAdmin(actor);
  if (!LEAD_STATUSES.includes(status)) throw validation("Invalid lead status.");
  const lead = await getLead(actor, leadId);
  if (status === "CONVERTED" && !lead.projectId) throw conflict("Use “Convert to project” to convert a lead.");
  await db.lead.update({ where: { id: leadId }, data: { status } });
}

/**
 * Converts a lead into a client organization + draft project. If the lead's
 * email already has an account, the project is added to that client;
 * otherwise the organization waits for the client to sign up with that email.
 */
export async function convertLead(actor: Actor, leadId: string) {
  requireAdmin(actor);
  const lead = await getLead(actor, leadId);
  if (lead.projectId) throw conflict("This lead has already been converted.");

  const businessName = lead.businessName || lead.name;
  const existingUser = await db.user.findUnique({
    where: { email: lead.email },
    select: { id: true, role: true, memberships: { select: { organizationId: true }, take: 1 } },
  });
  if (existingUser?.role === "ADMIN") throw conflict("This email belongs to a studio account.");

  const result = await db.$transaction(async (tx) => {
    const organizationId =
      existingUser?.memberships[0]?.organizationId ??
      (
        await tx.organization.create({
          data: {
            name: businessName,
            inviteEmail: existingUser ? null : lead.email,
            members: existingUser ? { create: { userId: existingUser.id, role: "OWNER" } } : undefined,
          },
        })
      ).id;

    const business = await tx.business.create({
      data: { organizationId, name: businessName, email: lead.email, phone: lead.phone },
    });
    const project = await tx.project.create({
      data: {
        organizationId,
        businessId: business.id,
        createdById: actor.id,
        name: `${businessName} website`,
        status: "DRAFT",
        questionnaire: {
          business: { businessName, phone: lead.phone ?? "", email: lead.email },
          final: { comments: lead.message },
        },
      },
    });
    await tx.lead.update({
      where: { id: lead.id },
      data: { status: "CONVERTED", projectId: project.id, organizationId, convertedAt: new Date() },
    });
    await recordActivity(tx, {
      type: "LEAD_CONVERTED",
      projectId: project.id,
      actorId: actor.id,
      visibility: "INTERNAL",
      message: `Lead converted to project`,
      metadata: { leadId: lead.id },
    });
    await recordActivity(tx, {
      type: "PROJECT_CREATED",
      projectId: project.id,
      actorId: actor.id,
      message: "Project created — waiting for questionnaire",
    });
    return { projectId: project.id, invited: !existingUser };
  });

  if (result.invited) await sendEmail(emailTemplates.invite(lead.email, businessName));
  return result;
}
