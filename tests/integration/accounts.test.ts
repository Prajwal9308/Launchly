import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { registerClient, verifyCredentials } from "@/services/accounts";
import { convertLead, createLead } from "@/services/leads";
import { createAdmin, createClient, resetDb, TEST_PASSWORD } from "../helpers";

beforeEach(resetDb);

describe("authentication", () => {
  it("registers a client with organization, business and profile — never storing the plaintext password", async () => {
    const { id } = await registerClient({
      firstName: "Jo",
      lastName: "Smith",
      email: "Jo@Example.test",
      password: TEST_PASSWORD,
      businessName: "Jo's Bakery",
      country: "IN",
      phone: "555-010-2222",
    });
    const user = await db.user.findUniqueOrThrow({
      where: { id },
      include: { clientProfile: true, memberships: { include: { organization: { include: { businesses: true } } } } },
    });
    expect(user.email).toBe("jo@example.test");
    expect(user.role).toBe("CLIENT");
    expect(user.passwordHash).not.toContain(TEST_PASSWORD);
    expect(user.passwordHash).toMatch(/^\$2[aby]\$12\$/);
    expect(user.clientProfile?.phone).toBe("555-010-2222");
    expect(user.memberships[0].organization.businesses[0].name).toBe("Jo's Bakery");
    expect(await db.activityEvent.count({ where: { type: "USER_REGISTERED" } })).toBe(1);
  });

  it("rejects duplicate emails and weak passwords", async () => {
    await createClient("A", "dup@example.test");
    await expect(createClient("B", "DUP@example.test")).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(
      registerClient({ firstName: "a", lastName: "b", email: "weak@example.test", password: "short", businessName: "x", country: "CA" }),
    ).rejects.toMatchObject({ code: "VALIDATION" });
  });

  it("verifies credentials and records a login event", async () => {
    const client = await createClient();
    expect(await verifyCredentials(client.email, "wrong-password-1")).toBeNull();
    expect(await verifyCredentials("nobody@example.test", TEST_PASSWORD)).toBeNull();
    const user = await verifyCredentials(client.email.toUpperCase(), TEST_PASSWORD);
    expect(user).toMatchObject({ id: client.id, role: "CLIENT" });
    expect(await db.activityEvent.count({ where: { type: "CLIENT_LOGIN", actorId: client.id } })).toBe(1);
  });

  it("links a new signup to the organization created from a converted lead", async () => {
    const admin = await createAdmin();
    const lead = await createLead({ name: "Lee", businessName: "Lee's Garage", email: "lee@example.test", country: "CA", message: "I need a new website please." });
    const { projectId, invited } = await convertLead(admin, lead.id);
    expect(invited).toBe(true);

    const lee = await createClient("Ignored Name", "lee@example.test");
    const membership = await db.organizationMember.findFirstOrThrow({ where: { userId: lee.id } });
    const project = await db.project.findUniqueOrThrow({ where: { id: projectId } });
    expect(membership.organizationId).toBe(project.organizationId);
    expect(await db.organization.count()).toBe(1);
  });
});
