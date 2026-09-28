import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { convertLead, createLead, listLeads, updateLeadStatus } from "@/services/leads";
import { createAdmin, createClient, resetDb } from "../helpers";

beforeEach(resetDb);

describe("leads", () => {
  it("stores a valid contact form submission and notifies admins", async () => {
    const admin = await createAdmin();
    await createLead({ name: "Pat", businessName: "Pat's Pizza", email: "PAT@example.test", phone: "555 010 9999", service: "Landing Pages", message: "We need a landing page for catering." });
    const lead = await db.lead.findFirstOrThrow();
    expect(lead).toMatchObject({ email: "pat@example.test", status: "NEW", source: "contact_form" });
    expect(await db.notification.count({ where: { userId: admin.id, type: "LEAD_CREATED" } })).toBe(1);
    expect(await db.activityEvent.count({ where: { type: "LEAD_CREATED", visibility: "INTERNAL" } })).toBe(1);
  });

  it("validates contact form input", async () => {
    await expect(createLead({ name: "", email: "nope", message: "   " })).rejects.toMatchObject({
      code: "VALIDATION",
      fieldErrors: { name: expect.any(Array), email: expect.any(Array), message: expect.any(Array) },
    });
  });

  it("updates status and filters by it", async () => {
    const admin = await createAdmin();
    const { id } = await createLead({ name: "Sam", email: "sam@example.test", message: "Looking for a redesign." });
    await updateLeadStatus(admin, id, "CONTACTED");
    const result = await listLeads(admin, { status: "CONTACTED" });
    expect(result.total).toBe(1);
    await expect(updateLeadStatus(admin, id, "CONVERTED")).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("converts a lead for an existing client into a draft project on their account", async () => {
    const admin = await createAdmin();
    const client = await createClient("Existing Co", "existing@example.test");
    const { id } = await createLead({ name: "Existing", email: "existing@example.test", message: "Second website please." });
    const { projectId, invited } = await convertLead(admin, id);
    expect(invited).toBe(false);
    const project = await db.project.findUniqueOrThrow({ where: { id: projectId }, include: { organization: { include: { members: true } } } });
    expect(project.status).toBe("DRAFT");
    expect(project.organization.members.map((m) => m.userId)).toContain(client.id);
    expect((await db.lead.findUniqueOrThrow({ where: { id } })).status).toBe("CONVERTED");
    await expect(convertLead(admin, id)).rejects.toMatchObject({ code: "CONFLICT" });
  });
});

describe("studio inbox", () => {
  it("routes studio emails to STUDIO_NOTIFY_EMAIL while still notifying each admin in-app", async () => {
    const { notifyAdmins } = await import("@/services/notifications");
    const admin = await createAdmin();
    process.env.STUDIO_NOTIFY_EMAIL = "studio@example.test";
    try {
      const recipients = await db.$transaction((tx) => notifyAdmins(tx, { type: "LEAD_CREATED", title: "t" }));
      expect(recipients.map((r) => r.email)).toEqual(["studio@example.test"]);
      expect(await db.notification.count({ where: { userId: admin.id } })).toBe(1);
    } finally {
      delete process.env.STUDIO_NOTIFY_EMAIL;
    }
    const recipients = await db.$transaction((tx) => notifyAdmins(tx, { type: "LEAD_CREATED", title: "t" }));
    expect(recipients.map((r) => r.email)).toEqual([admin.email]);
  });
});
