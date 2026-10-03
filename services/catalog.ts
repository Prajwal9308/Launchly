import { SERVICE_ICONS } from "@/domain/service-icons";
import { z } from "zod";
import { db, type SiteSettings } from "@/db";
import type { CountryCode } from "@/domain/country";
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
  name: z.string().trim().min(1, "Please enter a service name.").max(80),
  summary: z.string().trim().min(1, "Please enter a short description.").max(300),
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

/** A whole-unit price as typed by the admin ("1500", "1,50,000"); empty means "quoted per project". */
const wholePrice = (currency: string) =>
  z
    .string()
    .trim()
    .optional()
    .default("")
    .transform((v) => v.replace(/[,\s]/g, "").replace(/^(CA\$|\$|₹|Rs\.?)/i, ""))
    .refine((v) => !v || /^\d{1,9}$/.test(v), `Enter a whole ${currency} amount, such as 1500, or leave it blank.`)
    .transform((v) => (v ? Number(v) : null));

export const pricingSchema = z.object({
  name: z.string().trim().min(1, "Please enter a package name.").max(80),
  description: z.string().trim().min(1, "Please enter a description.").max(300),
  /** Canadian price in whole dollars (CAD). */
  priceCad: wholePrice("CAD"),
  /** Indian price in whole rupees (INR). */
  priceInr: wholePrice("INR"),
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
    priceCad: data.priceCad,
    priceInr: data.priceInr,
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
  title: z.string().trim().min(1, "Please enter a title.").max(120),
  description: z.string().trim().min(1, "Please enter a description.").max(2000),
  industry: z.string().trim().min(1, "Please enter an industry.").max(80),
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
    .refine((v) => !v || v.startsWith("/") || z.url({ protocol: /^https$/ }).safeParse(v).success, "Enter a /path or an https:// address."),
  url: z
    .string()
    .trim()
    .max(500)
    .optional()
    .default("")
    .refine((v) => !v || z.url({ protocol: /^https?$/ }).safeParse(v).success, "Please enter a valid website address."),
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

/** One option per line, trimmed, at most 10. */
const budgetLines = z
  .string()
  .max(1000)
  .optional()
  .default("")
  .transform((v) =>
    v
      .split(/\n+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 10),
  )
  .refine((v) => v.length > 0, "Add at least one budget range.")
  .refine((v) => v.every((line) => line.length <= 60), "Keep each budget range under 60 characters.")
  .refine((v) => v.every((line) => !/USD|US\$/i.test(line)), "Budget ranges must use CAD or INR, not USD.");

const optionalEmail = z
  .string()
  .trim()
  .max(254)
  .optional()
  .default("")
  .refine((v) => !v || z.email().safeParse(v).success, "Please enter a valid email address.");

export const settingsSchema = z.object({
  businessName: z.string().trim().min(1, "Please enter the business name.").max(80),
  tagline: z.string().trim().max(160).optional().default(""),
  contactEmail: z.email("Please enter a valid email address.").trim().max(254),
  contactPhone: z.string().trim().max(40).optional().default(""),
  serviceArea: z.string().trim().max(160).optional().default(""),
  budgetRangesCa: budgetLines,
  budgetRangesIn: budgetLines,
  taxNoteCa: z.string().trim().max(160).optional().default(""),
  taxNoteIn: z.string().trim().max(160).optional().default(""),
  legalName: z.string().trim().max(160).optional().default(""),
  businessAddress: z.string().trim().max(300).optional().default(""),
  governingJurisdiction: z.string().trim().max(120).optional().default(""),
  privacyContactEmail: optionalEmail,
  legalEffectiveDate: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Please enter a valid date.")
    .transform((v) => (v ? new Date(v) : null)),
});

export const DEFAULT_SETTINGS = {
  id: "default",
  businessName: "CoreGravity",
  tagline: "Professional websites and digital solutions for small businesses.",
  contactEmail: "info@coregravity.io",
  contactPhone: null,
  serviceArea: null,
  budgetRangesCa: ["CA$500 – CA$1,000", "CA$1,000 – CA$2,000", "CA$2,000 – CA$3,500", "CA$3,500 – CA$5,000", "CA$5,000+", "Not sure yet"],
  budgetRangesIn: ["₹30,000 – ₹60,000", "₹60,000 – ₹1,20,000", "₹1,20,000 – ₹2,10,000", "₹2,10,000 – ₹3,00,000", "₹3,00,000+", "Not sure yet"],
  taxNoteCa: "Plus applicable taxes.",
  taxNoteIn: "Plus applicable GST, where applicable.",
  legalName: null,
  businessAddress: null,
  governingJurisdiction: null,
  privacyContactEmail: null,
  legalEffectiveDate: null,
  updatedAt: new Date(0),
} satisfies SiteSettings;

export async function getSiteSettings(): Promise<SiteSettings> {
  return (await db.siteSettings.findUnique({ where: { id: "default" } })) ?? DEFAULT_SETTINGS;
}

/** Budget options for one country, as configured in Admin → Settings. */
export function budgetRangesFor(settings: Pick<SiteSettings, "budgetRangesCa" | "budgetRangesIn">, country: CountryCode) {
  return country === "CA" ? settings.budgetRangesCa : settings.budgetRangesIn;
}

export function taxNoteFor(settings: Pick<SiteSettings, "taxNoteCa" | "taxNoteIn">, country: CountryCode) {
  return country === "CA" ? settings.taxNoteCa : settings.taxNoteIn;
}

export async function updateSiteSettings(actor: Actor, input: z.input<typeof settingsSchema>) {
  requireAdmin(actor);
  const data = parseOrThrow(settingsSchema, input);
  const payload = {
    ...data,
    contactPhone: data.contactPhone || null,
    serviceArea: data.serviceArea || null,
    legalName: data.legalName || null,
    businessAddress: data.businessAddress || null,
    governingJurisdiction: data.governingJurisdiction || null,
    privacyContactEmail: data.privacyContactEmail || null,
  };
  return db.siteSettings.upsert({ where: { id: "default" }, create: { id: "default", ...payload }, update: payload });
}
