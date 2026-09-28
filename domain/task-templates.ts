import type { TaskPriority } from "@/db/enums";
import type { QuestionnaireDraft } from "./questionnaire";

/**
 * Default tasks created when a project is submitted. Edit these templates to
 * change the standard workflow; `key` links a task back to its template.
 */
export interface TaskTemplate {
  key: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  /** Days after submission the task is due. */
  dueInDays: number;
  clientVisible?: boolean;
}

export const BASE_TASKS: TaskTemplate[] = [
  { key: "review-requirements", title: "Review requirements", priority: "HIGH", dueInDays: 2 },
  { key: "review-assets", title: "Review assets", description: "Check uploaded logos, photos and documents.", priority: "MEDIUM", dueInDays: 3 },
  { key: "create-sitemap", title: "Create sitemap", priority: "MEDIUM", dueInDays: 5 },
  { key: "homepage-design", title: "Homepage design", priority: "HIGH", dueInDays: 10 },
  { key: "client-review", title: "Client review", priority: "MEDIUM", dueInDays: 14 },
  { key: "revisions", title: "Revisions", priority: "MEDIUM", dueInDays: 18 },
  { key: "development", title: "Development", priority: "HIGH", dueInDays: 28 },
  { key: "testing", title: "Testing", description: "Cross-browser, mobile, forms and performance checks.", priority: "MEDIUM", dueInDays: 32 },
  { key: "client-approval", title: "Client approval", priority: "MEDIUM", dueInDays: 35 },
  { key: "launch", title: "Launch", priority: "HIGH", dueInDays: 38 },
];

export const ECOMMERCE_TASKS: TaskTemplate[] = [
  { key: "ecommerce-catalog", title: "Set up product catalog", priority: "MEDIUM", dueInDays: 24 },
  { key: "ecommerce-checkout", title: "Configure checkout and payments", priority: "HIGH", dueInDays: 26 },
  { key: "ecommerce-test-orders", title: "Test order flow end to end", priority: "HIGH", dueInDays: 31 },
];

export const SEO_TASKS: TaskTemplate[] = [
  { key: "seo-page-plan", title: "Plan page titles and meta descriptions", priority: "MEDIUM", dueInDays: 8 },
  { key: "seo-technical", title: "Technical SEO setup (sitemap, structured data)", priority: "MEDIUM", dueInDays: 30 },
  { key: "seo-search-console", title: "Submit sitemap to search engines", priority: "LOW", dueInDays: 40 },
];

export const BOOKING_TASKS: TaskTemplate[] = [
  { key: "booking-setup", title: "Set up online booking", priority: "MEDIUM", dueInDays: 26 },
];

export const BLOG_TASKS: TaskTemplate[] = [
  { key: "blog-setup", title: "Set up blog", priority: "LOW", dueInDays: 27 },
];

/** Service slugs that trigger additional task templates (current and legacy slugs). */
export const ECOMMERCE_SERVICES = ["ecommerce-development", "ecommerce-websites"];
export const SEO_SERVICE = "seo-foundations";

/** Picks templates based on the client's answers. Order is preserved in `sortOrder`. */
export function selectTaskTemplates(draft: QuestionnaireDraft): TaskTemplate[] {
  const services = draft.website?.services ?? [];
  const features = draft.features?.features ?? [];
  const pages = draft.website?.pages ?? [];

  const templates = [...BASE_TASKS];
  const insertBefore = (key: string, extra: TaskTemplate[]) => {
    const index = templates.findIndex((t) => t.key === key);
    templates.splice(index, 0, ...extra);
  };

  if (services.includes(SEO_SERVICE)) {
    // Search engine submission only makes sense after launch.
    insertBefore("launch", SEO_TASKS.filter((t) => t.key !== "seo-search-console"));
    templates.push(...SEO_TASKS.filter((t) => t.key === "seo-search-console"));
  }
  if (ECOMMERCE_SERVICES.some((s) => services.includes(s)) || features.includes("ECOMMERCE") || features.includes("PAYMENTS")) {
    insertBefore("testing", ECOMMERCE_TASKS);
  }
  if (features.includes("BOOKING") || pages.includes("BOOKING")) insertBefore("testing", BOOKING_TASKS);
  if (features.includes("BLOG") || pages.includes("BLOG")) insertBefore("testing", BLOG_TASKS);

  return templates;
}
