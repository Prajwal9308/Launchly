import { db } from "@/db";
import type { QuestionnaireDraft } from "@/domain/questionnaire";
import { registerClient } from "@/services/accounts";
import type { Actor } from "@/services/actor";
import { saveQuestionnaireStep, startDraftProject, submitProject } from "@/services/projects";

/** Wipes every application table (test database only). */
export async function resetDb() {
  if (!process.env.DATABASE_URL?.includes("test")) throw new Error("resetDb only runs against a test database");
  const tables = await db.$queryRaw<{ tablename: string }[]>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`;
  const list = tables.map((t) => `"public"."${t.tablename}"`).join(", ");
  if (list) await db.$executeRawUnsafe(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`);
}

export function toActor(user: { id: string; role: "ADMIN" | "CLIENT"; email: string; firstName: string; lastName: string }): Actor {
  return { id: user.id, role: user.role, email: user.email, firstName: user.firstName, lastName: user.lastName };
}

let counter = 0;
const unique = () => `${Date.now().toString(36)}${(counter++).toString(36)}`;

export async function createAdmin(): Promise<Actor> {
  const user = await db.user.create({
    data: { email: `admin-${unique()}@example.test`, firstName: "Ada", lastName: "Admin", role: "ADMIN", passwordHash: "not-used" },
  });
  return toActor(user);
}

export const TEST_PASSWORD = "correct-horse-42";

export async function createClient(businessName = "Test Plumbing", email = `client-${unique()}@example.test`): Promise<Actor> {
  const { id } = await registerClient({ firstName: "Casey", lastName: "Client", email, password: TEST_PASSWORD, businessName, phone: "555-010-1234" });
  return toActor(await db.user.findUniqueOrThrow({ where: { id } }));
}

export async function seedServices() {
  const services = [
    { slug: "business-websites", name: "Business Websites" },
    { slug: "ecommerce-websites", name: "E-commerce Websites" },
    { slug: "seo-foundations", name: "SEO Foundations" },
  ];
  for (const [i, s] of services.entries()) {
    await db.service.upsert({ where: { slug: s.slug }, update: {}, create: { ...s, summary: s.name, sortOrder: i } });
  }
}

export const COMPLETE_ANSWERS: Required<Pick<QuestionnaireDraft, "business" | "goals" | "website" | "content" | "features" | "final">> = {
  business: {
    businessName: "Test Plumbing",
    businessType: "Family business",
    industry: "Plumbing",
    description: "We fix leaks, install water heaters and clear drains for homeowners.",
    address: "",
    phone: "",
    email: "",
    existingWebsite: "",
    domain: "",
    socialLinks: "",
  },
  goals: { primaryGoal: "CALLS", primaryGoalOther: "", idealCustomers: "Homeowners", differentiators: "", keyOfferings: "" },
  website: { pages: ["HOME", "SERVICES", "CONTACT"], pagesOther: "", services: ["business-websites"] },
  content: { hasContent: "PARTIAL", contentNotes: "" },
  features: { features: ["CONTACT_FORM"], featuresOther: "" },
  final: { budgetRange: "$3,000 – $6,000", timeframe: "1–3 months", comments: "" },
};

/** Creates and submits a complete project for the given client. */
export async function createSubmittedProject(client: Actor, overrides: Partial<typeof COMPLETE_ANSWERS> = {}) {
  const { id } = await startDraftProject(client);
  const answers = { ...COMPLETE_ANSWERS, ...overrides };
  for (const [step, data] of Object.entries(answers)) {
    await saveQuestionnaireStep(client, id, step as keyof typeof COMPLETE_ANSWERS, data);
  }
  await submitProject(client, id);
  return id;
}

/** Minimal valid PNG bytes (signature + padding) for upload tests. */
export const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 73, 72, 68, 82]);
