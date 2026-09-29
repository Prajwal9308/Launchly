/**
 * Development seed. Creates FICTIONAL demo data:
 *   - studio admin + demo clients (development-only password)
 *   - services, pricing packages (no prices — configure them in admin), sample portfolio
 *   - projects at different workflow stages with tasks, messages, reviews and activity
 *
 * This RESETS application data. It refuses to run in production, and refuses to
 * run against a database containing non-demo users unless SEED_FORCE=1.
 */
import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type ProjectStatus, type Prisma } from "../db/generated/prisma/client";
import { buildProjectSummary, buildRequirementRows } from "../domain/requirements";
import { selectTaskTemplates } from "../domain/task-templates";
import type { QuestionnaireDraft } from "../domain/questionnaire";
import { wireframePng } from "../scripts/wireframe-png";
import { PACKAGES, PORTFOLIO, SERVICES } from "./catalog-data";

if (process.env.NODE_ENV === "production") {
  console.error("Refusing to seed in production.");
  process.exit(1);
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
const PASSWORD = process.env.SEED_DEV_PASSWORD || "Launchly-dev-2026";
const STORAGE_DIR = path.resolve(process.env.STORAGE_LOCAL_DIR ?? "./storage/uploads");
const DAY = 86_400_000;
const daysAgo = (n: number) => new Date(Date.now() - n * DAY);

async function guard() {
  const realUsers = await db.user.count({ where: { NOT: { email: { endsWith: "@example.com" } } } });
  if (realUsers > 0 && process.env.SEED_FORCE !== "1") {
    console.error(`Found ${realUsers} non-demo user(s). Seeding would delete data. Set SEED_FORCE=1 to override.`);
    process.exit(1);
  }
}

async function reset() {
  // Order respects foreign keys.
  await db.$transaction([
    db.notification.deleteMany(),
    db.activityEvent.deleteMany(),
    db.approval.deleteMany(),
    db.revisionRequest.deleteMany(),
    db.designReview.deleteMany(),
    db.projectFile.deleteMany(),
    db.projectMessage.deleteMany(),
    db.internalNote.deleteMany(),
    db.projectBrief.deleteMany(),
    db.projectTask.deleteMany(),
    db.projectService.deleteMany(),
    db.projectRequirement.deleteMany(),
    db.lead.deleteMany(),
    db.project.deleteMany(),
    db.business.deleteMany(),
    db.organizationMember.deleteMany(),
    db.organization.deleteMany(),
    db.clientProfile.deleteMany(),
    db.session.deleteMany(),
    db.account.deleteMany(),
    db.user.deleteMany(),
    db.service.deleteMany(),
    db.pricingPackage.deleteMany(),
    db.portfolioItem.deleteMany(),
    db.siteSettings.deleteMany(),
  ]);
}

interface DemoClient {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  business: string;
  industry: string;
  description: string;
  status: ProjectStatus;
  submittedDaysAgo: number;
  services: string[];
  accent: string;
  draft: Partial<QuestionnaireDraft>;
}

const CLIENTS: DemoClient[] = [
  {
    email: "client@example.com",
    firstName: "Jordan",
    lastName: "Reyes",
    phone: "(555) 010-2231",
    business: "Northstar Plumbing",
    industry: "Plumbing",
    description: "Family-run plumbing company offering residential repairs, water heater installation and drain cleaning.",
    status: "CLIENT_REVIEW",
    submittedDaysAgo: 12,
    services: ["web-development", "ui-ux-design"],
    accent: "#1d3b5c",
    draft: {
      goals: { primaryGoal: "CALLS", primaryGoalOther: "", mainGoals: "", idealCustomers: "Homeowners and property managers in the local area.", differentiators: "Upfront pricing and same-day appointments when available.", keyOfferings: "Emergency repairs, water heaters, drain cleaning." },
      website: { pages: ["HOME", "ABOUT", "SERVICES", "TESTIMONIALS", "CONTACT"], pagesOther: "Service areas", services: [] },
      features: { features: ["CONTACT_FORM", "MAPS", "REVIEWS"], featuresOther: "" },
    },
  },
  {
    email: "bella@example.com",
    firstName: "Sofia",
    lastName: "Marino",
    phone: "(555) 010-4410",
    business: "Bella Verde Restaurant",
    industry: "Restaurant & food",
    description: "Neighborhood Italian restaurant serving seasonal dishes, with dine-in, takeout and private events.",
    status: "NEW",
    submittedDaysAgo: 1,
    services: ["web-development", "ui-ux-design"],
    accent: "#7a8b3f",
    draft: {
      goals: { primaryGoal: "BOOKINGS", primaryGoalOther: "", mainGoals: "", idealCustomers: "Local diners, families and people planning small events.", differentiators: "Seasonal menu and a private dining room.", keyOfferings: "Dinner menu, private events, takeout." },
      website: { pages: ["HOME", "ABOUT", "GALLERY", "CONTACT", "BOOKING"], pagesOther: "Menu", services: [] },
      features: { features: ["BOOKING", "MAPS", "GALLERY", "SOCIAL"], featuresOther: "" },
    },
  },
  {
    email: "maple@example.com",
    firstName: "Ethan",
    lastName: "Brooks",
    phone: "(555) 010-7720",
    business: "Maple & Olive Landscaping",
    industry: "Landscaping",
    description: "Landscape design and seasonal garden maintenance for residential clients.",
    status: "DEVELOPMENT",
    submittedDaysAgo: 30,
    services: ["web-development", "business-solutions"],
    accent: "#3f6b3a",
    draft: {
      goals: { primaryGoal: "LEADS", primaryGoalOther: "", mainGoals: "", idealCustomers: "Homeowners planning garden projects.", differentiators: "Design and maintenance from the same team.", keyOfferings: "Garden design, planting, seasonal maintenance." },
      website: { pages: ["HOME", "SERVICES", "PORTFOLIO", "CONTACT"], pagesOther: "", services: [] },
      features: { features: ["CONTACT_FORM", "GALLERY"], featuresOther: "" },
    },
  },
  {
    email: "urbanglow@example.com",
    firstName: "Maya",
    lastName: "Chen",
    phone: "(555) 010-3398",
    business: "Urban Glow Salon",
    industry: "Salon & beauty",
    description: "Hair salon offering cuts, color and treatments.",
    status: "CLIENT_APPROVAL",
    submittedDaysAgo: 45,
    services: ["ui-ux-design", "web-development"],
    accent: "#9b5a6b",
    draft: {
      goals: { primaryGoal: "BOOKINGS", primaryGoalOther: "", mainGoals: "", idealCustomers: "Clients looking for color specialists.", differentiators: "Color-focused stylists.", keyOfferings: "Color, cuts, treatments." },
      website: { pages: ["HOME", "SERVICES", "PRICING", "GALLERY", "BOOKING", "CONTACT"], pagesOther: "", services: [] },
      features: { features: ["BOOKING", "SOCIAL", "GALLERY"], featuresOther: "" },
    },
  },
  {
    email: "harbor@example.com",
    firstName: "Daniel",
    lastName: "Okafor",
    phone: "(555) 010-8854",
    business: "Harbor Dental",
    industry: "Dental",
    description: "General and family dental practice.",
    status: "LAUNCHED",
    submittedDaysAgo: 75,
    services: ["web-development", "mobile-app-development"],
    accent: "#1f7a7a",
    draft: {
      goals: { primaryGoal: "BOOKINGS", primaryGoalOther: "", mainGoals: "", idealCustomers: "Families and new patients.", differentiators: "Evening appointments.", keyOfferings: "Checkups, cleanings, family dentistry." },
      website: { pages: ["HOME", "ABOUT", "SERVICES", "FAQ", "CONTACT"], pagesOther: "New patients", services: [] },
      features: { features: ["CONTACT_FORM", "MAPS", "BOOKING"], featuresOther: "" },
    },
  },
];

/** Status -> which template tasks are done. */
const DONE_UNTIL: Partial<Record<ProjectStatus, string[]>> = {
  NEW: [],
  CLIENT_REVIEW: ["review-requirements", "review-assets", "create-sitemap", "seo-page-plan", "homepage-design"],
  DEVELOPMENT: ["review-requirements", "review-assets", "create-sitemap", "homepage-design", "client-review", "revisions"],
  CLIENT_APPROVAL: ["review-requirements", "review-assets", "create-sitemap", "homepage-design", "client-review", "revisions", "development", "booking-setup", "testing"],
  LAUNCHED: ["*"],
};

async function storeDesign(projectId: string, accent: string, variant: number) {
  const key = `projects/${projectId}/${randomUUID()}.png`;
  const bytes = wireframePng({ accent, variant });
  await mkdir(path.dirname(path.join(STORAGE_DIR, key)), { recursive: true });
  await writeFile(path.join(STORAGE_DIR, key), bytes);
  return { key, size: bytes.length };
}

async function main() {
  await guard();
  await reset();
  const passwordHash = await bcrypt.hash(PASSWORD, 12);

  await db.siteSettings.create({
    data: {
      id: "default",
      businessName: "CoreGravity",
      tagline: "Professional websites and digital solutions for small businesses.",
      contactEmail: "hello@example.com",
      serviceArea: null,
    },
  });

  const admin = await db.user.create({
    data: { email: "admin@example.com", passwordHash, firstName: "Alex", lastName: "Morgan", role: "ADMIN", lastLoginAt: daysAgo(0) },
  });

  const services = await Promise.all(
    SERVICES.map((s, i) => db.service.create({ data: { ...s, sortOrder: i, pricingText: null } })),
  );
  const serviceBySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
  await db.pricingPackage.createMany({ data: PACKAGES.map((p, i) => ({ ...p, sortOrder: i })) });
  await db.portfolioItem.createMany({
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

  for (const c of CLIENTS) {
    const submittedAt = daysAgo(c.submittedDaysAgo);
    const user = await db.user.create({
      data: {
        email: c.email,
        passwordHash,
        firstName: c.firstName,
        lastName: c.lastName,
        role: "CLIENT",
        createdAt: daysAgo(c.submittedDaysAgo + 1),
        lastLoginAt: daysAgo(Math.min(c.submittedDaysAgo, 2)),
        clientProfile: { create: { phone: c.phone } },
      },
    });
    const org = await db.organization.create({
      data: { name: c.business, country: "CA", createdAt: user.createdAt, members: { create: { userId: user.id, role: "OWNER" } } },
    });
    const business = await db.business.create({
      data: {
        organizationId: org.id,
        name: c.business,
        industry: c.industry,
        description: c.description,
        phone: c.phone,
        email: c.email,
      },
    });

    const draft: QuestionnaireDraft = {
      business: {
        businessName: c.business,
        country: "CA",
        businessType: "Small business",
        industry: c.industry as NonNullable<QuestionnaireDraft["business"]>["industry"],
        description: c.description,
        address: "",
        phone: c.phone,
        email: c.email,
        existingWebsite: "",
        domain: "",
        socialLinks: "",
      },
      brand: { brandColors: "", preferredFonts: "", hasBrandGuidelines: false, brandDescription: "", styles: ["MODERN", "PROFESSIONAL"] },
      content: { hasContent: "PARTIAL", contentNotes: "We have photos; need help with service descriptions." },
      final: { budgetRange: "CA$5,000 – CA$10,000", timeframe: "1–3 months", comments: "" },
      ...c.draft,
    } as QuestionnaireDraft;
    draft.website = { ...draft.website!, services: c.services };

    const serviceNames = Object.fromEntries(c.services.map((s) => [s, serviceBySlug[s].name]));
    const templates = selectTaskTemplates(draft);
    const doneKeys = DONE_UNTIL[c.status] ?? [];

    const project = await db.project.create({
      data: {
        organizationId: org.id,
        businessId: business.id,
        createdById: user.id,
        name: `${c.business} website`,
        status: c.status,
        country: "CA",
        questionnaire: draft as Prisma.InputJsonValue,
        questionnaireStep: "review",
        budgetRange: draft.final?.budgetRange,
        timeframe: draft.final?.timeframe,
        submittedAt,
        requirementsApprovedAt: c.status === "NEW" ? null : daysAgo(c.submittedDaysAgo - 2),
        launchedAt: c.status === "LAUNCHED" ? daysAgo(3) : null,
        createdAt: daysAgo(c.submittedDaysAgo + 1),
        lastActivityAt: daysAgo(Math.min(c.submittedDaysAgo, 1)),
        requirements: {
          create: buildRequirementRows(draft, serviceNames).map((r, i) => ({ ...r, sortOrder: i })),
        },
        services: { create: c.services.map((s) => ({ serviceId: serviceBySlug[s].id })) },
        briefs: { create: { aiGenerated: false, generator: "system", content: { ...buildProjectSummary(draft) } } },
        tasks: {
          create: templates.map((t, i) => {
            const done = doneKeys.includes("*") || doneKeys.includes(t.key);
            return {
              title: t.title,
              description: t.description ?? null,
              priority: t.priority,
              templateKey: t.key,
              sortOrder: i,
              assigneeId: admin.id,
              status: done ? "DONE" : i === templates.findIndex((x) => !doneKeys.includes(x.key)) ? "IN_PROGRESS" : "TODO",
              completedAt: done ? daysAgo(Math.max(0, c.submittedDaysAgo - i * 3)) : null,
              dueDate: new Date(submittedAt.getTime() + t.dueInDays * DAY),
            } as const;
          }),
        },
      },
    });

    const events: Prisma.ActivityEventCreateManyInput[] = [
      { type: "USER_REGISTERED", visibility: "INTERNAL", actorId: user.id, message: `${c.firstName} ${c.lastName} created a client account`, createdAt: daysAgo(c.submittedDaysAgo + 1) },
      { type: "PROJECT_CREATED", projectId: project.id, actorId: user.id, message: "Project started", createdAt: daysAgo(c.submittedDaysAgo + 0.5) },
      { type: "PROJECT_SUBMITTED", projectId: project.id, actorId: user.id, message: "Project submitted", createdAt: submittedAt },
      { type: "TASK_CREATED", visibility: "INTERNAL", projectId: project.id, message: `${templates.length} tasks created from templates`, createdAt: submittedAt },
    ];
    if (c.status !== "NEW") {
      events.push(
        { type: "REQUIREMENTS_APPROVED", projectId: project.id, actorId: admin.id, message: "Requirements reviewed and approved", createdAt: daysAgo(c.submittedDaysAgo - 2) },
        { type: "STATUS_CHANGED", projectId: project.id, actorId: admin.id, message: "Status changed to Discovery", createdAt: daysAgo(c.submittedDaysAgo - 2) },
      );
    }

    // Messages
    const messages: Prisma.ProjectMessageCreateManyInput[] = [
      { projectId: project.id, senderId: admin.id, body: `Hi ${c.firstName}, thanks for submitting your project. I'm reviewing your answers and files now and will follow up with any questions.`, createdAt: new Date(submittedAt.getTime() + 3 * 3600_000), readAt: submittedAt },
    ];
    if (c.status !== "NEW") {
      messages.push({ projectId: project.id, senderId: user.id, body: "Thanks! Let me know if you need anything else from us.", createdAt: new Date(submittedAt.getTime() + 5 * 3600_000), readAt: submittedAt });
    }

    // Design reviews per stage
    if (c.status === "CLIENT_REVIEW" || c.status === "DEVELOPMENT" || c.status === "CLIENT_APPROVAL" || c.status === "LAUNCHED") {
      const v1 = await storeDesign(project.id, c.accent, 0);
      const file1 = await db.projectFile.create({
        data: { projectId: project.id, uploadedById: admin.id, category: "DESIGN", originalName: "homepage-v1.png", storageKey: v1.key, mimeType: "image/png", size: v1.size, createdAt: daysAgo(5) },
      });
      if (c.status === "CLIENT_REVIEW") {
        await db.designReview.create({
          data: { projectId: project.id, title: "Homepage", version: 1, fileId: file1.id, status: "IN_REVIEW", notes: "First homepage direction based on your questionnaire. Let us know what you think.", createdById: admin.id, requestedAt: daysAgo(1) },
        });
        events.push(
          { type: "DESIGN_UPLOADED", visibility: "INTERNAL", projectId: project.id, actorId: admin.id, message: "Uploaded design Homepage v1", createdAt: daysAgo(1.1) },
          { type: "DESIGN_REVIEW_REQUESTED", projectId: project.id, actorId: admin.id, message: "Homepage v1 is ready for review", createdAt: daysAgo(1) },
          { type: "STATUS_CHANGED", projectId: project.id, actorId: admin.id, message: "Status changed to Client review", createdAt: daysAgo(1) },
        );
        messages.push({ projectId: project.id, senderId: admin.id, body: "Your homepage design is ready for review. You can approve it or request changes from the Design Reviews tab.", createdAt: daysAgo(1), readAt: null });
      } else {
        const r1 = await db.designReview.create({
          data: { projectId: project.id, title: "Homepage", version: 1, fileId: file1.id, status: "CHANGES_REQUESTED", createdById: admin.id, requestedAt: daysAgo(14), decidedAt: daysAgo(13) },
        });
        await db.revisionRequest.create({
          data: { projectId: project.id, designReviewId: r1.id, requestedById: user.id, body: "Could the phone number be more prominent at the top of the page?", status: "RESOLVED", resolvedAt: daysAgo(11), createdAt: daysAgo(13) },
        });
        const v2 = await storeDesign(project.id, c.accent, 1);
        const file2 = await db.projectFile.create({
          data: { projectId: project.id, uploadedById: admin.id, category: "DESIGN", originalName: "homepage-v2.png", storageKey: v2.key, mimeType: "image/png", size: v2.size, createdAt: daysAgo(10) },
        });
        const r2 = await db.designReview.create({
          data: { projectId: project.id, title: "Homepage", version: 2, fileId: file2.id, status: "APPROVED", createdById: admin.id, requestedAt: daysAgo(10), decidedAt: daysAgo(9) },
        });
        await db.approval.create({
          data: { projectId: project.id, type: "DESIGN_APPROVAL", status: "APPROVED", designReviewId: r2.id, version: "Homepage v2", approvedById: user.id, decidedAt: daysAgo(9), comment: "Looks great." },
        });
        events.push(
          { type: "REVISION_REQUESTED", projectId: project.id, actorId: user.id, message: "Changes requested on Homepage v1", createdAt: daysAgo(13) },
          { type: "DESIGN_REVIEW_REQUESTED", projectId: project.id, actorId: admin.id, message: "Homepage v2 is ready for review", createdAt: daysAgo(10) },
          { type: "DESIGN_APPROVED", projectId: project.id, actorId: user.id, message: "Homepage v2 approved", createdAt: daysAgo(9) },
          { type: "STATUS_CHANGED", projectId: project.id, actorId: admin.id, message: "Status changed to Development", createdAt: daysAgo(8) },
        );
      }
    }
    if (c.status === "CLIENT_APPROVAL") {
      await db.approval.create({
        data: { projectId: project.id, type: "FINAL_APPROVAL", status: "PENDING", requestedById: admin.id, requestMessage: "The website is ready on the staging link we shared. Please review every page before approving.", createdAt: daysAgo(1) },
      });
      events.push({ type: "APPROVAL_REQUESTED", projectId: project.id, actorId: admin.id, message: "Final approval requested", createdAt: daysAgo(1) });
    }
    if (c.status === "LAUNCHED") {
      events.push({ type: "STATUS_CHANGED", projectId: project.id, actorId: admin.id, message: "Status changed to Launched", createdAt: daysAgo(3) });
    }
    if (c.status === "NEW") {
      await db.notification.create({
        data: { userId: admin.id, type: "PROJECT_SUBMITTED", title: "New project request", body: `${c.business} submitted a website project`, href: `/admin/projects/${project.id}`, createdAt: submittedAt },
      });
    }

    await db.projectMessage.createMany({ data: messages });
    await db.activityEvent.createMany({ data: events });
    await db.internalNote.create({
      data: { projectId: project.id, authorId: admin.id, body: "Demo note: internal notes are visible to the studio only.", createdAt: daysAgo(c.submittedDaysAgo - 1) },
    });
  }

  await db.lead.createMany({
    data: [
      { name: "Priya Shah", businessName: "Shah Family Bakery", email: "priya@example.com", phone: "+91 98200 10552", country: "IN", service: "Business Website", budgetRange: "₹75,000 – ₹1,50,000", message: "We're opening a second location and need a website that shows both, with our menu and hours.", status: "NEW", createdAt: daysAgo(0.5) },
      { name: "Marcus Hill", businessName: "Hill Roofing", email: "marcus@example.com", country: "CA", service: "Website Redesign", message: "Our current site is about 8 years old and doesn't work well on phones.", status: "CONTACTED", createdAt: daysAgo(4) },
      { name: "Elena Park", businessName: "Park Coaching", email: "elena@example.com", country: "CA", service: "Booking & Appointment System", message: "Looking for online booking for coaching sessions.", status: "QUALIFIED", createdAt: daysAgo(9) },
    ],
  });
  await db.notification.create({
    data: { userId: admin.id, type: "LEAD_CREATED", title: "New lead", body: "Priya Shah · Shah Family Bakery", href: "/admin/leads", createdAt: daysAgo(0.5) },
  });

  console.log("Seed complete (fictional demo data).");
  console.log(`  Admin:  admin@example.com  / ${PASSWORD}`);
  console.log(`  Client: client@example.com / ${PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
