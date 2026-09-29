import { SERVICE_ICONS } from "@/domain/service-icons";
import { z } from "zod";
import { db } from "@/db";
import { conflict, notFound, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import { slugify } from "@/lib/utils";
import type { Actor } from "./actor";
import { isUuid, requireAdmin } from "./authz";

/**
 * Public site content: services, pricing packages, portfolio items and
 * studio settings. Reads are public; writes require an admin.
 */

const lines = z
  .string()
  .max(5000)
  .optional()
  .default("")
  .transform((v) =>
    v
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20),
  );

function parseOrThrow<T extends z.ZodType>(schema: T, input: unknown): z.infer<T> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  return parsed.data;
}

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------


export { SERVICE_ICONS };

export const serviceSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  summary: z.string().trim().min(1, "A short description is required.").max(300),
  description: z.string().trim().max(3000).optional().default(""),
  features: lines,
  pricingText: z.string().trim().max(120).optional().default(""),
  icon: z.enum(SERVICE_ICONS).default("layout"),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const listPublishedServices = () =>
  db.service.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

export function listAllServices(actor: Actor) {
  requireAdmin(actor);
  return db.service.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function getService(actor: Actor, id: string) {
  requireAdmin(actor);
  const service = isUuid(id) ? await db.service.findUnique({ where: { id } }) : null;
  if (!service) throw notFound("This service could not be found.");
  return service;
}

export async function saveService(actor: Actor, id: string | null, input: z.input<typeof serviceSchema>) {
  requireAdmin(actor);
  const data = parseOrThrow(serviceSchema, input);
  const payload = { ...data, description: data.description || null, pricingText: data.pricingText || null };
  if (id) {
    await getService(actor, id);
    return db.service.update({ where: { id }, data: payload });
  }
  const slug = slugify(data.name);
  if (await db.service.findUnique({ where: { slug } })) throw conflict("A service with this name already exists.");
  return db.service.create({ data: { ...payload, slug } });
}

export async function deleteService(actor: Actor, id: string) {
  await getService(actor, id);
  const used = await db.projectService.count({ where: { serviceId: id } });
  if (used) throw conflict("This service is linked to projects. Unpublish it instead.");
  await db.service.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Pricing packages
// ---------------------------------------------------------------------------

export const pricingSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  description: z.string().trim().min(1, "Description is required.").max(300),
  /** Dollars as entered by the admin; empty means "Let's discuss your project". */
  price: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => !v || /^\d{1,7}(\.\d{1,2})?$/.test(v.replace(/[$,]/g, "")), "Enter a price like 2500 or leave blank.")
    .transform((v) => (v ? Math.round(Number(v.replace(/[$,]/g, "")) * 100) : null)),
  pricePrefix: z.string().trim().max(40).optional().default(""),
  features: lines,
  highlighted: z.boolean().default(false),
  published: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const listPublishedPricing = () =>
  db.pricingPackage.findMany({ where: { published: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });

export function listAllPricing(actor: Actor) {
  requireAdmin(actor);
  return db.pricingPackage.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function getPricingPackage(actor: Actor, id: string) {
  requireAdmin(actor);
  const pkg = isUuid(id) ? await db.pricingPackage.findUnique({ where: { id } }) : null;
  if (!pkg) throw notFound("This package could not be found.");
  return pkg;
}

export async function savePricingPackage(actor: Actor, id: string | null, input: z.input<typeof pricingSchema>) {
  requireAdmin(actor);
  const data = parseOrThrow(pricingSchema, input);
  const payload = {
    name: data.name,
    description: data.description,
    priceCents: data.price,
    pricePrefix: data.pricePrefix || null,
    features: data.features,
    highlighted: data.highlighted,
    published: data.published,
    sortOrder: data.sortOrder,
  };
  if (id) {
    await getPricingPackage(actor, id);
    return db.pricingPackage.update({ where: { id }, data: payload });
  }
  return db.pricingPackage.create({ data: payload });
}

export async function deletePricingPackage(actor: Actor, id: string) {
  await getPricingPackage(actor, id);
  await db.pricingPackage.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Portfolio
// ---------------------------------------------------------------------------

export const portfolioSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(120),
  description: z.string().trim().min(1, "Description is required.").max(2000),
  industry: z.string().trim().min(1, "Industry is required.").max(80),
  services: z
    .string()
    .max(500)
    .optional()
    .default("")
    .transform((v) =>
      v
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 10),
    ),
  imageUrl: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default("")
    .refine((v) => !v || v.startsWith("/") || z.url({ protocol: /^https$/ }).safeParse(v).success, "Use a /path or https:// URL."),
  url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default("")
    .refine((v) => !v || z.url({ protocol: /^https?$/ }).safeParse(v).success, "Enter a valid URL."),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  isDemo: z.boolean().default(true),
  sortOrder: z.coerce.number().int().min(0).max(999).default(0),
});

export const listPublishedPortfolio = (options: { featuredOnly?: boolean; take?: number } = {}) =>
  db.portfolioItem.findMany({
    where: { published: true, ...(options.featuredOnly ? { featured: true } : {}) },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
    take: options.take,
  });

export function listAllPortfolio(actor: Actor) {
  requireAdmin(actor);
  return db.portfolioItem.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
}

export async function getPortfolioItem(actor: Actor, id: string) {
  requireAdmin(actor);
  const item = isUuid(id) ? await db.portfolioItem.findUnique({ where: { id } }) : null;
  if (!item) throw notFound("This portfolio item could not be found.");
  return item;
}

export async function savePortfolioItem(actor: Actor, id: string | null, input: z.input<typeof portfolioSchema>) {
  requireAdmin(actor);
  const data = parseOrThrow(portfolioSchema, input);
  const payload = { ...data, imageUrl: data.imageUrl || null, url: data.url || null };
  if (id) {
    await getPortfolioItem(actor, id);
    return db.portfolioItem.update({ where: { id }, data: payload });
  }
  let slug = slugify(data.title) || "project";
  if (await db.portfolioItem.findUnique({ where: { slug } })) slug = `${slug}-${Date.now().toString(36)}`;
  return db.portfolioItem.create({ data: { ...payload, slug } });
}

export async function deletePortfolioItem(actor: Actor, id: string) {
  await getPortfolioItem(actor, id);
  await db.portfolioItem.delete({ where: { id } });
}

// ---------------------------------------------------------------------------
// Studio settings
// ---------------------------------------------------------------------------

export const settingsSchema = z.object({
  businessName: z.string().trim().min(1, "Business name is required.").max(80),
  tagline: z.string().trim().max(160).optional().default(""),
  contactEmail: z.email("Enter a valid email.").trim().max(254),
  contactPhone: z.string().trim().max(40).optional().default(""),
  serviceArea: z.string().trim().max(160).optional().default(""),
});

export async function getSiteSettings() {
  return (
    (await db.siteSettings.findUnique({ where: { id: "default" } })) ?? {
      id: "default",
      businessName: "ViperByte",
      tagline: "Websites and mobile apps for businesses and entrepreneurs.",
      contactEmail: "info.viperbyte@yahoo.com",
      contactPhone: null,
      serviceArea: null,
      updatedAt: new Date(0),
    }
  );
}

export async function updateSiteSettings(actor: Actor, input: z.input<typeof settingsSchema>) {
  requireAdmin(actor);
  const data = parseOrThrow(settingsSchema, input);
  const payload = { ...data, contactPhone: data.contactPhone || null, serviceArea: data.serviceArea || null };
  return db.siteSettings.upsert({ where: { id: "default" }, create: { id: "default", ...payload }, update: payload });
}
