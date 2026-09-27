import { beforeEach, describe, expect, it } from "vitest";
import { db } from "@/db";
import { requestApproval, respondToApproval } from "@/services/approvals";
import { uploadFile } from "@/services/files";
import { listMessages, sendMessage } from "@/services/messages";
import { getAdminOverview, getProjectDetail, listAdminProjects } from "@/services/project-queries";
import {
  approveRequirements,
  changeProjectStatus,
  markLaunched,
  saveQuestionnaireStep,
  startDraftProject,
  submitProject,
} from "@/services/projects";
import { approveDesign, createDesignReview, listDesignReviews, requestRevision } from "@/services/reviews";
import { createTask, setTaskStatus } from "@/services/tasks";
import { COMPLETE_ANSWERS, createAdmin, createClient, createSubmittedProject, PNG_BYTES, resetDb, seedServices } from "../helpers";

beforeEach(async () => {
  await resetDb();
  await seedServices();
});

describe("project creation and submission", () => {
  it("resumes the same draft instead of creating duplicates", async () => {
    const client = await createClient();
    const a = await startDraftProject(client);
    const b = await startDraftProject(client);
    expect(a.id).toBe(b.id);
    const draft = await db.project.findUniqueOrThrow({ where: { id: a.id } });
    expect(draft.status).toBe("DRAFT");
    expect((draft.questionnaire as { business: { businessName: string } }).business.businessName).toBe("Test Plumbing");
  });

  it("saves questionnaire progress per step", async () => {
    const client = await createClient();
    const { id } = await startDraftProject(client);
    await saveQuestionnaireStep(client, id, "goals", COMPLETE_ANSWERS.goals);
    const saved = await db.project.findUniqueOrThrow({ where: { id } });
    expect((saved.questionnaire as { goals: { primaryGoal: string } }).goals.primaryGoal).toBe("CALLS");
    expect(saved.questionnaireStep).toBe("goals");
  });

  it("rejects invalid step data", async () => {
    const client = await createClient();
    const { id } = await startDraftProject(client);
    await expect(saveQuestionnaireStep(client, id, "business", { existingWebsite: "::::" })).rejects.toMatchObject({
      code: "VALIDATION",
      fieldErrors: { existingWebsite: expect.any(Array) },
    });
  });

  it("refuses to submit an incomplete questionnaire", async () => {
    const client = await createClient();
    const { id } = await startDraftProject(client);
    await expect(submitProject(client, id)).rejects.toMatchObject({ code: "VALIDATION" });
  });

  it("submission creates requirements, services, tasks, brief, activity and notifies admins", async () => {
    const admin = await createAdmin();
    const client = await createClient();
    const id = await createSubmittedProject(client, {
      website: { pages: ["HOME", "CONTACT"], pagesOther: "", services: ["ecommerce-websites", "seo-foundations", "not-a-service"] },
    });

    const project = await db.project.findUniqueOrThrow({
      where: { id },
      include: { tasks: true, requirements: true, services: { include: { service: true } }, briefs: true, business: true },
    });
    expect(project.status).toBe("NEW");
    expect(project.submittedAt).not.toBeNull();
    expect(project.business?.industry).toBe("Plumbing");
    expect(project.requirements.length).toBeGreaterThan(5);
    expect(project.services.map((s) => s.service.slug).sort()).toEqual(["ecommerce-websites", "seo-foundations"]);
    const keys = project.tasks.map((t) => t.templateKey);
    expect(keys).toEqual(expect.arrayContaining(["review-requirements", "launch", "ecommerce-checkout", "seo-page-plan"]));
    expect(project.briefs[0]).toMatchObject({ aiGenerated: false, generator: "system" });

    const events = await db.activityEvent.findMany({ where: { projectId: id } });
    expect(events.map((e) => e.type)).toEqual(expect.arrayContaining(["PROJECT_CREATED", "PROJECT_SUBMITTED", "TASK_CREATED"]));
    const notification = await db.notification.findFirst({ where: { userId: admin.id, type: "PROJECT_SUBMITTED" } });
    expect(notification?.title).toBe("New project request");
  });

  it("cannot be submitted twice", async () => {
    const client = await createClient();
    const id = await createSubmittedProject(client);
    await expect(submitProject(client, id)).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("appears in the admin project list and overview", async () => {
    const admin = await createAdmin();
    const client = await createClient("Northwind Plumbing");
    await createSubmittedProject(client);
    const list = await listAdminProjects(admin, { q: "northwind" });
    expect(list.total).toBe(1);
    expect(list.items[0].nextAction).toBe("Review new project request");
    const overview = await getAdminOverview(admin);
    expect(overview.metrics.newRequests).toBe(1);
  });
});

describe("status transitions and tasks", () => {
  it("approving requirements completes the review task and moves to discovery", async () => {
    const admin = await createAdmin();
    const client = await createClient();
    const id = await createSubmittedProject(client);
    await approveRequirements(admin, id);
    const project = await db.project.findUniqueOrThrow({ where: { id }, include: { tasks: true } });
    expect(project.status).toBe("DISCOVERY");
    expect(project.tasks.find((t) => t.templateKey === "review-requirements")?.status).toBe("DONE");
    const note = await db.notification.findFirst({ where: { userId: client.id, type: "STATUS_CHANGED" } });
    expect(note).not.toBeNull();
  });

  it("rejects invalid transitions server-side", async () => {
    const admin = await createAdmin();
    const client = await createClient();
    const id = await createSubmittedProject(client);
    await expect(changeProjectStatus(admin, id, "LAUNCHED")).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
  });

  it("supports putting a project on hold and resuming", async () => {
    const admin = await createAdmin();
    const id = await createSubmittedProject(await createClient());
    await changeProjectStatus(admin, id, "ON_HOLD");
    expect((await db.project.findUniqueOrThrow({ where: { id } })).statusBeforeHold).toBe("NEW");
    await expect(changeProjectStatus(admin, id, "DESIGN")).rejects.toMatchObject({ code: "INVALID_TRANSITION" });
    await changeProjectStatus(admin, id, "NEW");
    expect((await db.project.findUniqueOrThrow({ where: { id } })).status).toBe("NEW");
  });

  it("creates and completes tasks with activity", async () => {
    const admin = await createAdmin();
    const id = await createSubmittedProject(await createClient());
    const task = await createTask(admin, id, { title: "Call client", priority: "HIGH", dueDate: "2030-01-15" });
    expect(task.dueDate?.toISOString().slice(0, 10)).toBe("2030-01-15");
    await setTaskStatus(admin, task.id, "DONE");
    const done = await db.projectTask.findUniqueOrThrow({ where: { id: task.id } });
    expect(done.completedAt).not.toBeNull();
    expect(await db.activityEvent.count({ where: { projectId: id, type: "TASK_COMPLETED" } })).toBe(1);
  });

  it("progress is derived from real state", async () => {
    const admin = await createAdmin();
    const client = await createClient();
    const id = await createSubmittedProject(client);
    const before = (await getProjectDetail(client, id)).progress;
    await approveRequirements(admin, id);
    const after = (await getProjectDetail(client, id)).progress;
    expect(after).toBeGreaterThan(before);
  });
});

describe("messages", () => {
  it("sends messages both ways with unread tracking", async () => {
    const admin = await createAdmin();
    const client = await createClient();
    const id = await createSubmittedProject(client);
    await sendMessage(admin, id, { body: "Hi! Quick question about your logo." });
    expect((await getProjectDetail(client, id)).unreadMessages).toBe(1);
    const { messages } = await listMessages(client, id);
    expect(messages).toHaveLength(1);
    expect((await getProjectDetail(client, id)).unreadMessages).toBe(0);
    await sendMessage(client, id, { body: "Sure, uploading it now." });
    expect(await db.notification.count({ where: { userId: admin.id, type: "NEW_MESSAGE" } })).toBe(1);
  });

  it("attaches only the sender's own files", async () => {
    const admin = await createAdmin();
    const client = await createClient();
    const id = await createSubmittedProject(client);
    const file = await uploadFile(client, { projectId: id, category: "ATTACHMENT", name: "a.png", size: PNG_BYTES.length, bytes: PNG_BYTES });
    await expect(sendMessage(admin, id, { body: "hijack", attachmentIds: [file.id] })).rejects.toMatchObject({ code: "VALIDATION" });
    const msg = await sendMessage(client, id, { body: "see attached", attachmentIds: [file.id] });
    expect((await db.projectFile.findUniqueOrThrow({ where: { id: file.id } })).messageId).toBe(msg.id);
  });
});

describe("design review, revision and approval", () => {
  async function setup() {
    const admin = await createAdmin();
    const client = await createClient();
    const id = await createSubmittedProject(client);
    await approveRequirements(admin, id);
    await changeProjectStatus(admin, id, "DESIGN");
    const upload = (name: string) => uploadFile(admin, { projectId: id, category: "DESIGN", name, size: PNG_BYTES.length, bytes: PNG_BYTES });
    return { admin, client, id, upload };
  }

  it("draft designs are hidden from the client until review is requested", async () => {
    const { admin, client, id, upload } = await setup();
    const file = await upload("home.png");
    await createDesignReview(admin, id, { title: "Homepage", fileId: file.id, requestReview: false });
    expect(await listDesignReviews(client, id)).toHaveLength(0);
  });

  it("request review → revision → v2 → approve, with version-specific approval", async () => {
    const { admin, client, id, upload } = await setup();
    const v1 = await createDesignReview(admin, id, { title: "Homepage", fileId: (await upload("v1.png")).id, requestReview: true });
    expect(v1.version).toBe(1);
    expect((await db.project.findUniqueOrThrow({ where: { id } })).status).toBe("CLIENT_REVIEW");
    expect(await db.notification.count({ where: { userId: client.id, type: "DESIGN_READY" } })).toBe(1);

    await requestRevision(client, v1.id, { body: "Please make the phone number bigger." });
    expect((await db.designReview.findUniqueOrThrow({ where: { id: v1.id } })).status).toBe("CHANGES_REQUESTED");
    expect((await db.project.findUniqueOrThrow({ where: { id } })).status).toBe("REVISION");

    const v2 = await createDesignReview(admin, id, { title: "homepage", fileId: (await upload("v2.png")).id, requestReview: true });
    expect(v2).toMatchObject({ title: "Homepage", version: 2 });
    expect((await db.designReview.findUniqueOrThrow({ where: { id: v1.id } })).status).toBe("SUPERSEDED");

    // Approval requires explicit confirmation.
    await expect(approveDesign(client, v2.id, { confirm: false as unknown as true })).rejects.toMatchObject({ code: "VALIDATION" });
    const approval = await approveDesign(client, v2.id, { confirm: true, comment: "Great" });
    expect(approval).toMatchObject({ type: "DESIGN_APPROVAL", status: "APPROVED", version: "Homepage v2", approvedById: client.id, designReviewId: v2.id });
    expect(await db.activityEvent.count({ where: { projectId: id, type: "DESIGN_APPROVED" } })).toBe(1);

    // A decided review can't be approved or revised again.
    await expect(approveDesign(client, v2.id, { confirm: true })).rejects.toMatchObject({ code: "CONFLICT" });
    await expect(requestRevision(client, v1.id, { body: "late change request" })).rejects.toMatchObject({ code: "CONFLICT" });
  });

  it("final approval flows to launch", async () => {
    const { admin, client, id } = await setup();
    await changeProjectStatus(admin, id, "CLIENT_REVIEW");
    await changeProjectStatus(admin, id, "DEVELOPMENT");
    await changeProjectStatus(admin, id, "TESTING");
    const approval = await requestApproval(admin, id, { type: "FINAL_APPROVAL", message: "Please review the staging site." });
    expect((await db.project.findUniqueOrThrow({ where: { id } })).status).toBe("CLIENT_APPROVAL");
    await expect(requestApproval(admin, id, { type: "FINAL_APPROVAL" })).rejects.toMatchObject({ code: "CONFLICT" });

    await expect(respondToApproval(client, approval.id, { decision: "APPROVE" } as never)).rejects.toMatchObject({ code: "VALIDATION" });
    await respondToApproval(client, approval.id, { decision: "APPROVE", confirm: true });
    const decided = await db.approval.findUniqueOrThrow({ where: { id: approval.id } });
    expect(decided).toMatchObject({ status: "APPROVED", approvedById: client.id });
    expect(decided.decidedAt).not.toBeNull();
    expect((await db.project.findUniqueOrThrow({ where: { id } })).status).toBe("READY_TO_LAUNCH");

    await markLaunched(admin, id);
    const launched = await db.project.findUniqueOrThrow({ where: { id }, include: { tasks: true } });
    expect(launched.status).toBe("LAUNCHED");
    expect(launched.launchedAt).not.toBeNull();
    expect(launched.tasks.find((t) => t.templateKey === "launch")?.status).toBe("DONE");
    expect((await getProjectDetail(client, id)).progress).toBe(100);
  });
});
