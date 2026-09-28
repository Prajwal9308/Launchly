import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { findOAuthUser, signInWithOAuth, verifyCredentials } from "@/services/accounts";
import { convertLead, createLead } from "@/services/leads";
import { saveQuestionnaireStep, startDraftProject, submitProject } from "@/services/projects";
import { COMPLETE_ANSWERS, createAdmin, createClient, resetDb, TEST_PASSWORD, toActor } from "../helpers";

beforeEach(resetDb);

const google = (overrides: Partial<Parameters<typeof signInWithOAuth>[0]> = {}) => ({
  provider: "google",
  providerAccountId: "google-sub-123",
  email: "sam@example.test",
  emailVerified: true,
  firstName: "Sam",
  lastName: "Rivera",
  ...overrides,
});

describe("Google sign-in", () => {
  it("creates a client account without a password on first sign-in", async () => {
    const result = await signInWithOAuth(google());
    expect(result).toMatchObject({ role: "CLIENT", email: "sam@example.test" });
    const user = await db.user.findUniqueOrThrow({ where: { id: result!.id }, include: { accounts: true, memberships: { include: { organization: { include: { businesses: true } } } } } });
    expect(user.passwordHash).toBeNull();
    expect(user.accounts).toHaveLength(1);
    expect(user.memberships[0].organization.businesses).toHaveLength(0);
    expect(await db.activityEvent.count({ where: { type: "USER_REGISTERED" } })).toBe(1);
    expect(await findOAuthUser("google", "google-sub-123")).toMatchObject({ id: result!.id, role: "CLIENT" });
  });

  it("signs the same person in again without creating duplicates", async () => {
    const first = await signInWithOAuth(google());
    const second = await signInWithOAuth(google({ email: "changed@example.test" }));
    expect(second?.id).toBe(first?.id);
    expect(await db.user.count()).toBe(1);
    expect(await db.activityEvent.count({ where: { type: "CLIENT_LOGIN" } })).toBe(2);
  });

  it("refuses unverified email addresses", async () => {
    expect(await signInWithOAuth(google({ emailVerified: false }))).toBeNull();
    expect(await db.user.count()).toBe(0);
  });

  it("links to an existing client and removes the unverified password (pre-hijack protection)", async () => {
    // Someone registers the victim's email with a password before the victim ever signs in.
    const squatter = await createClient("Squat Co", "victim@example.test");
    expect(await verifyCredentials("victim@example.test", TEST_PASSWORD)).not.toBeNull();

    const result = await signInWithOAuth(google({ email: "victim@example.test" }));
    expect(result?.id).toBe(squatter.id);
    // The password set without email verification no longer works.
    expect(await verifyCredentials("victim@example.test", TEST_PASSWORD)).toBeNull();
  });

  it("keeps an admin's password and role when they link Google", async () => {
    const admin = await createAdmin();
    const result = await signInWithOAuth(google({ email: admin.email }));
    expect(result).toMatchObject({ id: admin.id, role: "ADMIN" });
    expect((await db.user.findUniqueOrThrow({ where: { id: admin.id } })).passwordHash).not.toBeNull();
  });

  it("joins the organization of a converted lead", async () => {
    const admin = await createAdmin();
    const lead = await createLead({ name: "Sam", businessName: "Sam's Salon", email: "sam@example.test", message: "Need a new website soon." });
    const { projectId } = await convertLead(admin, lead.id);
    const result = await signInWithOAuth(google());
    const project = await db.project.findUniqueOrThrow({ where: { id: projectId } });
    expect(await db.organizationMember.findFirst({ where: { userId: result!.id, organizationId: project.organizationId } })).not.toBeNull();
  });

  it("names the account after the business once the questionnaire is submitted", async () => {
    const result = await signInWithOAuth(google());
    const actor = toActor(await db.user.findUniqueOrThrow({ where: { id: result!.id } }));
    const { id } = await startDraftProject(actor);
    const draft = await db.project.findUniqueOrThrow({ where: { id } });
    expect((draft.questionnaire as { business: { businessName: string } }).business.businessName).toBe("");

    for (const [step, data] of Object.entries(COMPLETE_ANSWERS)) {
      await saveQuestionnaireStep(actor, id, step as keyof typeof COMPLETE_ANSWERS, data);
    }
    await submitProject(actor, id);
    const org = await db.organization.findUniqueOrThrow({ where: { id: draft.organizationId } });
    expect(org.name).toBe(COMPLETE_ANSWERS.business.businessName);
  });
});

describe("ADMIN_EMAILS", () => {
  const withAdmins = async (emails: string, fn: () => Promise<void>) => {
    const previous = process.env.ADMIN_EMAILS;
    process.env.ADMIN_EMAILS = emails;
    try {
      await fn();
    } finally {
      process.env.ADMIN_EMAILS = previous;
    }
  };

  it("creates a listed email as an admin with no client organization", () =>
    withAdmins("Owner@Example.test, other@example.test", async () => {
      const result = await signInWithOAuth(google({ email: "owner@example.test" }));
      expect(result?.role).toBe("ADMIN");
      expect(await db.organizationMember.count({ where: { userId: result!.id } })).toBe(0);
    }));

  it("promotes an existing client with a listed email and removes their password and memberships", () =>
    withAdmins("owner@example.test", async () => {
      const client = await createClient("Owner Co", "owner@example.test");
      const result = await signInWithOAuth(google({ email: "owner@example.test" }));
      expect(result).toMatchObject({ id: client.id, role: "ADMIN" });
      const user = await db.user.findUniqueOrThrow({ where: { id: client.id } });
      expect(user.passwordHash).toBeNull();
      expect(await db.organizationMember.count({ where: { userId: client.id } })).toBe(0);
    }));

  it("promotes an already-linked Google user once they are listed", async () => {
    const first = await signInWithOAuth(google({ email: "owner@example.test" }));
    expect(first?.role).toBe("CLIENT");
    await withAdmins("owner@example.test", async () => {
      expect((await signInWithOAuth(google({ email: "owner@example.test" })))?.role).toBe("ADMIN");
    });
  });

  it("never promotes unverified emails or password signups", () =>
    withAdmins("owner@example.test", async () => {
      expect(await signInWithOAuth(google({ email: "owner@example.test", emailVerified: false }))).toBeNull();
      const passwordUser = await createClient("X", "owner@example.test");
      expect(passwordUser.role).toBe("CLIENT");
    }));
});
