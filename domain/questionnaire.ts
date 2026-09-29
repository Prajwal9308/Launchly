import { z } from "zod";
import { COUNTRIES, COUNTRY_INFO } from "./country";

/**
 * The project questionnaire. Drafts are saved per step with lenient
 * validation; submission validates the whole questionnaire strictly.
 */

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export const INDUSTRIES = [
  "Restaurant & food",
  "Construction & contracting",
  "Plumbing",
  "Electrical",
  "Landscaping",
  "Salon & beauty",
  "Barber",
  "Dental",
  "Healthcare & wellness",
  "Real estate",
  "Professional services",
  "Retail",
  "Startup",
  "Nonprofit",
  "Other",
] as const;

export const PRIMARY_GOALS = [
  { value: "LEADS", label: "Generate enquiries" },
  { value: "CALLS", label: "Increase phone calls" },
  { value: "BOOKINGS", label: "Accept bookings" },
  { value: "SELL", label: "Sell products or services" },
  { value: "CREDIBILITY", label: "Build credibility" },
  { value: "SHOWCASE", label: "Showcase services" },
  { value: "INFORMATION", label: "Provide information" },
  { value: "IMPROVE", label: "Improve an existing website" },
  { value: "OTHER", label: "Other" },
] as const;

export const PAGES = [
  { value: "HOME", label: "Home" },
  { value: "ABOUT", label: "About" },
  { value: "SERVICES", label: "Services" },
  { value: "PRODUCTS", label: "Products" },
  { value: "PRICING", label: "Pricing" },
  { value: "GALLERY", label: "Gallery" },
  { value: "PORTFOLIO", label: "Portfolio" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "FAQ", label: "FAQ" },
  { value: "BLOG", label: "Blog" },
  { value: "CONTACT", label: "Contact" },
  { value: "BOOKING", label: "Booking" },
  { value: "CAREERS", label: "Careers" },
  { value: "SERVICE_AREAS", label: "Service Areas" },
  { value: "OTHER", label: "Other" },
] as const;

export const STYLES = [
  { value: "MODERN", label: "Modern" },
  { value: "MINIMAL", label: "Minimal" },
  { value: "PROFESSIONAL", label: "Professional" },
  { value: "LUXURY", label: "Luxury" },
  { value: "BOLD", label: "Bold" },
  { value: "FRIENDLY", label: "Friendly" },
  { value: "ELEGANT", label: "Elegant" },
  { value: "INDUSTRIAL", label: "Industrial" },
  { value: "CREATIVE", label: "Creative" },
] as const;

export const CONTENT_READINESS = [
  { value: "YES", label: "Mostly ready", description: "I have most of the content ready." },
  { value: "PARTIAL", label: "Partly ready", description: "I have some content and need help with the rest." },
  { value: "NO", label: "Not yet", description: "I need help creating the content." },
] as const;

export const FEATURES = [
  { value: "CONTACT_FORM", label: "Contact form" },
  { value: "BOOKING", label: "Booking" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "MAPS", label: "Maps" },
  { value: "SOCIAL", label: "Social media" },
  { value: "GALLERY", label: "Gallery" },
  { value: "BLOG", label: "Blog" },
  { value: "REVIEWS", label: "Reviews" },
  { value: "ECOMMERCE", label: "E-commerce" },
  { value: "PAYMENTS", label: "Payments" },
  { value: "CUSTOMER_PORTAL", label: "Customer portal" },
  { value: "ONLINE_ORDERING", label: "Online ordering" },
  { value: "APPOINTMENTS", label: "Appointment scheduling" },
  { value: "OTHER", label: "Other" },
] as const;

export const TIMEFRAMES = ["As soon as possible", "Within 1 month", "1–3 months", "3+ months", "Flexible"] as const;

type OptionList = readonly { value: string; label: string }[];

const valuesOf = <T extends OptionList>(list: T) =>
  list.map((o) => o.value) as unknown as [T[number]["value"], ...T[number]["value"][]];

export function optionLabel(list: OptionList, value: string) {
  return list.find((o) => o.value === value)?.label ?? value;
}

// ---------------------------------------------------------------------------
// Field helpers
// ---------------------------------------------------------------------------

const text = (max = 2000) => z.string().trim().max(max, `Please keep this to ${max} characters or fewer.`);
const optionalText = (max = 2000) => text(max).optional().default("");

/** Accepts "example.com" or a full URL; normalizes to https://. Empty is allowed. */
const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .default("")
  .transform((v) => (v && !/^https?:\/\//i.test(v) ? `https://${v}` : v))
  .refine((v) => !v || z.url({ protocol: /^https?$/ }).safeParse(v).success, "Please enter a valid website address.");

const optionalEmail = z
  .string()
  .trim()
  .max(254)
  .optional()
  .default("")
  .refine((v) => !v || z.email().safeParse(v).success, "Please enter a valid email address.");

const optionalPhone = z
  .string()
  .trim()
  .max(40)
  .optional()
  .default("")
  .refine((v) => !v || /^[+()\-.\s\d]{7,}$/.test(v), "Please enter a valid phone number.");

/** Newline-separated list of URLs (social links, reference sites). */
const urlList = z
  .string()
  .max(2000)
  .optional()
  .default("")
  .refine(
    (v) =>
      v
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .every((s) => z.url().safeParse(/^https?:\/\//i.test(s) ? s : `https://${s}`).success),
    "Please enter one valid website address per line.",
  );

// ---------------------------------------------------------------------------
// Step schemas (lenient: used for saving drafts)
// ---------------------------------------------------------------------------

export const businessStep = z.object({
  businessName: optionalText(120),
  /** Sets the currency of the budget options (Canada: CAD, India: INR). */
  country: z.enum(COUNTRIES).optional(),
  businessType: optionalText(120),
  industry: z.enum(INDUSTRIES).optional(),
  description: optionalText(2000),
  address: optionalText(300),
  phone: optionalPhone,
  email: optionalEmail,
  existingWebsite: optionalUrl,
  domain: optionalText(253),
  socialLinks: urlList,
});

export const goalsStep = z.object({
  primaryGoal: z.enum(valuesOf(PRIMARY_GOALS)).optional(),
  primaryGoalOther: optionalText(300),
  mainGoals: optionalText(),
  idealCustomers: optionalText(),
  differentiators: optionalText(),
  keyOfferings: optionalText(),
});

export const websiteStep = z.object({
  pages: z.array(z.enum(valuesOf(PAGES))).max(PAGES.length).optional().default([]),
  pagesOther: optionalText(300),
  /** Slugs of services from the Service table. Validated against the DB on submit. */
  services: z.array(z.string().max(80)).max(20).optional().default([]),
});

export const brandStep = z.object({
  brandColors: optionalText(300),
  preferredFonts: optionalText(300),
  hasBrandGuidelines: z.boolean().optional().default(false),
  brandDescription: optionalText(),
  styles: z.array(z.enum(valuesOf(STYLES))).max(STYLES.length).optional().default([]),
});

export const contentStep = z.object({
  hasContent: z.enum(valuesOf(CONTENT_READINESS)).optional(),
  contentNotes: optionalText(),
});

export const inspirationStep = z.object({
  competitorSites: urlList,
  likedSites: urlList,
  likes: optionalText(),
  dislikes: optionalText(),
});

export const featuresStep = z.object({
  features: z.array(z.enum(valuesOf(FEATURES))).max(FEATURES.length).optional().default([]),
  featuresOther: optionalText(300),
});

export const finalStep = z.object({
  /** One of the country's budget options from Admin → Settings (stored as shown, e.g. "CA$2,000 – CA$5,000"). */
  budgetRange: z.string().trim().max(60).optional(),
  timeframe: z.enum(TIMEFRAMES).optional(),
  comments: optionalText(),
});

export const STEPS = [
  {
    key: "business",
    title: "Business",
    heading: "Tell us about your business",
    description: "Help us understand your business, customers and current online presence.",
    schema: businessStep,
  },
  {
    key: "goals",
    title: "Goals",
    heading: "What would you like your website to accomplish?",
    description: "Your goals help us plan the right structure and features.",
    schema: goalsStep,
  },
  {
    key: "website",
    title: "Website",
    heading: "What does your website need?",
    description: "Choose the pages and sections you would like, and the services you need help with.",
    schema: websiteStep,
  },
  {
    key: "brand",
    title: "Brand",
    heading: "Tell us about your brand",
    description: "Share your existing logo, colors, fonts and brand guidelines so we can create a consistent visual experience.",
    schema: brandStep,
  },
  {
    key: "content",
    title: "Content",
    heading: "What content do you already have?",
    description: "Let us know what text, photos and documents you have. You can upload files here.",
    schema: contentStep,
  },
  {
    key: "inspiration",
    title: "Inspiration",
    heading: "Show us what you like",
    description: "Websites you admire can help us understand your visual preferences and expectations.",
    schema: inspirationStep,
  },
  {
    key: "features",
    title: "Features",
    heading: "What functionality do you need?",
    description: "Select the features your website should include.",
    schema: featuresStep,
  },
  {
    key: "final",
    title: "Budget and timeline",
    heading: "Budget and timeline",
    description: "Your budget and preferred timeline help us recommend an appropriate scope.",
    schema: finalStep,
  },
  {
    key: "review",
    title: "Review",
    heading: "Review your project information",
    description: "Please review your information before submitting your project request.",
    schema: null,
  },
] as const;

export type StepKey = (typeof STEPS)[number]["key"];
export type DataStepKey = Exclude<StepKey, "review">;
export const STEP_KEYS = STEPS.map((s) => s.key) as StepKey[];

export function isStepKey(value: unknown): value is StepKey {
  return typeof value === "string" && (STEP_KEYS as string[]).includes(value);
}

export const questionnaireDraftSchema = z.object({
  business: businessStep.optional(),
  goals: goalsStep.optional(),
  website: websiteStep.optional(),
  brand: brandStep.optional(),
  content: contentStep.optional(),
  inspiration: inspirationStep.optional(),
  features: featuresStep.optional(),
  final: finalStep.optional(),
});

export type QuestionnaireDraft = z.infer<typeof questionnaireDraftSchema>;
export type BusinessAnswers = z.infer<typeof businessStep>;
export type GoalsAnswers = z.infer<typeof goalsStep>;
export type WebsiteAnswers = z.infer<typeof websiteStep>;
export type BrandAnswers = z.infer<typeof brandStep>;
export type ContentAnswers = z.infer<typeof contentStep>;
export type InspirationAnswers = z.infer<typeof inspirationStep>;
export type FeaturesAnswers = z.infer<typeof featuresStep>;
export type FinalAnswers = z.infer<typeof finalStep>;

export function stepSchema(step: DataStepKey) {
  return STEPS.find((s) => s.key === step)!.schema!;
}

/** Parses stored JSON into a safe draft, dropping anything invalid. */
export function parseDraft(value: unknown): QuestionnaireDraft {
  const result = questionnaireDraftSchema.safeParse(value ?? {});
  if (result.success) return result.data;
  // Keep valid steps even if one step is malformed.
  const draft: QuestionnaireDraft = {};
  const source = (value ?? {}) as Record<string, unknown>;
  for (const step of STEPS) {
    if (!step.schema) continue;
    const parsed = step.schema.safeParse(source[step.key]);
    if (parsed.success) (draft as Record<string, unknown>)[step.key] = parsed.data;
  }
  return draft;
}

// ---------------------------------------------------------------------------
// Submission validation (strict)
// ---------------------------------------------------------------------------

export interface SubmissionIssue {
  step: DataStepKey;
  field: string;
  message: string;
}

/**
 * Checks the minimum information required to submit a project.
 * Returns an empty array when the questionnaire is complete.
 */
export function validateForSubmission(draft: QuestionnaireDraft): SubmissionIssue[] {
  const issues: SubmissionIssue[] = [];
  const b = draft.business;
  if (!b?.businessName) issues.push({ step: "business", field: "businessName", message: "Please enter your business name." });
  if (!b?.country) issues.push({ step: "business", field: "country", message: "Please select your country." });
  if (!b?.industry) issues.push({ step: "business", field: "industry", message: "Please select an industry." });
  if (!b?.description || b.description.length < 20)
    issues.push({
      step: "business",
      field: "description",
      message: "Please describe your business in a sentence or two.",
    });

  const g = draft.goals;
  if (!g?.primaryGoal) issues.push({ step: "goals", field: "primaryGoal", message: "Please select a primary goal." });
  if (g?.primaryGoal === "OTHER" && !g.primaryGoalOther)
    issues.push({ step: "goals", field: "primaryGoalOther", message: "Please describe your goal." });

  if (!draft.website?.pages?.length)
    issues.push({ step: "website", field: "pages", message: "Please select at least one page." });

  if (!draft.content?.hasContent)
    issues.push({ step: "content", field: "hasContent", message: "Please tell us what content you already have." });

  if (!draft.final?.budgetRange)
    issues.push({ step: "final", field: "budgetRange", message: "Please select a budget range." });
  if (!draft.final?.timeframe)
    issues.push({ step: "final", field: "timeframe", message: "Please select a timeline." });

  return issues;
}

export function countryOptionLabel(country: string | undefined) {
  return country && country in COUNTRY_INFO ? COUNTRY_INFO[country as keyof typeof COUNTRY_INFO].name : "";
}

export function splitLines(value: string | undefined) {
  return (value ?? "")
    .split(/\n+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (/^https?:\/\//i.test(s) ? s : `https://${s}`));
}
