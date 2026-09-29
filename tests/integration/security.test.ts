import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { listProjectActivity } from "@/services/activity";
import { respondToApproval, requestApproval } from "@/services/approvals";
import { deleteFile, getFileForDownload, listProjectFiles, uploadFile } from "@/services/files";
import { listMessages, sendMessage } from "@/services/messages";
import { addInternalNote, listInternalNotes } from "@/services/notes";
import { getAdminOverview, getProjectDetail, listAdminProjects, listClientProjects, listProjectRequirements } from "@/services/project-queries";
import { approveRequirements, changeProjectStatus, saveQuestionnaireStep, submitProject } from "@/services/projects";
import { approveDesign, createDesignReview, listDesignReviews, requestRevision } from "@/services/reviews";
import { completeTask, createTask, updateTask } from "@/services/tasks";
import { convertLead, createLead, listLeads } from "@/services/leads";
import { saveService } from "@/services/catalog";
import { createAdmin, createClient, createSubmittedProject, PNG_BYTES, resetDb, seedServices } from "../helpers";

/**
 * Client data isolation. Every attempt below must fail securely: clients
 * receive NOT_FOUND (no existence leak) or FORBIDDEN, and nothing changes.
 */

const denied = { code: expect.stringMatching(/NOT_FOUND|FORBIDDEN/) };

async function world() {
  const admin = await createAdmin();
  const alice = await createClient("Alice Bakery");
  const bob = await createClient("Bob Barbers");
  const aliceProject = await createSubmittedProject(alice);
  const aliceFile = await uploadFile(alice, { projectId: aliceProject, category: "LOGO", name: "logo.png", size: PNG_BYTES.length, bytes: PNG_BYTES });
  const design = await uploadFile(admin, { projectId: aliceProject, category: "DESIGN", name: "home.png", size: PNG_BYTES.length, bytes: PNG_BYTES });
  await approveRequirements(admin, aliceProject);
  await changeProjectStatus(admin, aliceProject, "DESIGN");
  const review = await createDesignReview(admin, aliceProject, { title: "Homepage", fileId: design.id, requestReview: true });
  await sendMessage(alice, aliceProject, { body: "Private message from Alice" });
  await addInternalNote(admin, aliceProject, { body: "Internal: budget is tight" });
  const task = await db.projectTask.findFirstOrThrow({ where: { projectId: aliceProject, templateKey: "launch" } });
  return { admin, alice, bob, aliceProject, aliceFile, design, review, task };
}

beforeEach(async () => {
  await resetDb();
  await seedServices();
});

describe("client isolation", () => {
  it("client cannot access another client's project", async () => {
    const { bob, aliceProject } = await world();
    await expect(getProjectDetail(bob, aliceProject)).rejects.toMatchObject(denied);
    expect((await listClientProjects(bob)).map((p) => p.id)).not.toContain(aliceProject);
  });

  it("client cannot read another client's requirements, messages or activity", async () => {
    const { bob, aliceProject } = await world();
    await expect(listProjectRequirements(bob, aliceProject)).rejects.toMatchObject(denied);
    await expect(listMessages(bob, aliceProject)).rejects.toMatchObject(denied);
    await expect(listProjectActivity(bob, aliceProject)).rejects.toMatchObject(denied);
  });

  it("client cannot list, download or delete another client's files", async () => {
    const { bob, aliceProject, aliceFile } = await world();
    await expect(listProjectFiles(bob, aliceProject)).rejects.toMatchObject(denied);
    await expect(getFileForDownload(bob, aliceFile.id)).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(deleteFile(bob, aliceFile.id)).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(await db.projectFile.findUnique({ where: { id: aliceFile.id } })).not.toBeNull();
  });

  it("client cannot upload into, message or edit another client's project", async () => {
    const { bob, aliceProject } = await world();
    await expect(
      uploadFile(bob, { projectId: aliceProject, category: "LOGO", name: "x.png", size: PNG_BYTES.length, bytes: PNG_BYTES }),
    ).rejects.toMatchObject(denied);
    await expect(sendMessage(bob, aliceProject, { body: "hello" })).rejects.toMatchObject(denied);
    await expect(saveQuestionnaireStep(bob, aliceProject, "goals", {})).rejects.toMatchObject(denied);
    await expect(submitProject(bob, aliceProject)).rejects.toMatchObject(denied);
  });

  it("client cannot approve or request revisions on another client's design", async () => {
    const { bob, review } = await world();
    await expect(approveDesign(bob, review.id, { confirm: true })).rejects.toMatchObject(denied);
    await expect(requestRevision(bob, review.id, { body: "Change everything please" })).rejects.toMatchObject(denied);
    expect((await db.designReview.findUniqueOrThrow({ where: { id: review.id } })).status).toBe("IN_REVIEW");
    expect(await db.approval.count()).toBe(0);
  });

  it("client cannot answer another client's approval request", async () => {
    const { admin, bob, aliceProject } = await world();
    const approval = await requestApproval(admin, aliceProject, { type: "LAUNCH_APPROVAL" });
    await expect(respondToApproval(bob, approval.id, { decision: "APPROVE", confirm: true })).rejects.toMatchObject(denied);
    expect((await db.approval.findUniqueOrThrow({ where: { id: approval.id } })).status).toBe("PENDING");
  });

  it("rejects malformed and non-existent IDs without leaking", async () => {
    const { bob } = await world();
    await expect(getProjectDetail(bob, "../../etc")).rejects.toMatchObject({ code: "NOT_FOUND" });
    await expect(getProjectDetail(bob, "00000000-0000-4000-8000-000000000000")).rejects.toMatchObject({ code: "NOT_FOUND" });
  });
});

describe("admin-only operations", () => {
  it("client cannot change project status — even on their own project", async () => {
    const { alice, aliceProject } = await world();
    await expect(changeProjectStatus(alice, aliceProject, "LAUNCHED")).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(approveRequirements(alice, aliceProject)).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("client cannot create, modify or complete tasks (own or others')", async () => {
    const { alice, bob, aliceProject, task } = await world();
    await expect(completeTask(bob, task.id)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(completeTask(alice, task.id)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(updateTask(bob, task.id, { title: "pwned" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(createTask(alice, aliceProject, { title: "x" })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect((await db.projectTask.findUniqueOrThrow({ where: { id: task.id } })).status).not.toBe("DONE");
  });

  it("client cannot read or write internal notes", async () => {
    const { alice, aliceProject } = await world();
    await expect(listInternalNotes(alice, aliceProject)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(addInternalNote(alice, aliceProject, { body: "hi" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("client cannot use admin queries or manage leads/catalog", async () => {
    const { alice } = await world();
    await expect(listAdminProjects(alice, {})).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(getAdminOverview(alice)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(listLeads(alice, {})).rejects.toMatchObject({ code: "FORBIDDEN" });
    const lead = await createLead({ name: "X", businessName: "X Co", email: "x@example.test", country: "CA", message: "Hello there, need a site." });
    await expect(convertLead(alice, lead.id)).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(saveService(alice, null, { name: "Free stuff", summary: "x" })).rejects.toMatchObject({ code: "FORBIDDEN" });
  });

  it("client cannot upload studio design files", async () => {
    const { alice, aliceProject } = await world();
    await expect(
      uploadFile(alice, { projectId: aliceProject, category: "DESIGN", name: "d.png", size: PNG_BYTES.length, bytes: PNG_BYTES }),
    ).rejects.toMatchObject({ code: "FORBIDDEN" });
  });
});

describe("visibility within a client's own project", () => {
  it("hides internal activity and unshared design drafts from the owner", async () => {
    const { admin, alice, aliceProject } = await world();
    const events = await listProjectActivity(alice, aliceProject, 200);
    expect(events.every((e) => e.visibility === "CLIENT")).toBe(true);
    expect(events.find((e) => e.type === "NOTE_ADDED")).toBeUndefined();

    const draftFile = await uploadFile(admin, { projectId: aliceProject, category: "DESIGN", name: "about.png", size: PNG_BYTES.length, bytes: PNG_BYTES });
    await createDesignReview(admin, aliceProject, { title: "About", fileId: draftFile.id, requestReview: false });
    const reviews = await listDesignReviews(alice, aliceProject);
    expect(reviews.map((r) => r.title)).not.toContain("About");
    await expect(getFileForDownload(alice, draftFile.id)).rejects.toMatchObject({ code: "NOT_FOUND" });
  });

  it("the owner can download their own files and shared designs", async () => {
    const { alice, aliceFile, design } = await world();
    expect((await getFileForDownload(alice, aliceFile.id)).file.id).toBe(aliceFile.id);
    expect((await getFileForDownload(alice, design.id)).bytes.length).toBe(PNG_BYTES.length);
  });

  it("rejects spoofed file types even for the owner", async () => {
    const { alice, aliceProject } = await world();
    const html = new TextEncoder().encode("<html><script>alert(1)</script></html>");
    await expect(uploadFile(alice, { projectId: aliceProject, category: "PHOTO", name: "cat.jpg", size: html.length, bytes: html })).rejects.toMatchObject({
      code: "VALIDATION",
    });
  });
});
