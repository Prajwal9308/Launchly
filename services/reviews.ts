import { z } from "zod";
import { db, type Tx } from "@/db";
import { canTransition } from "@/domain/project-status";
import { conflict, notFound, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import { sendEmail, type EmailMessage } from "@/providers/email";
import { emailTemplates } from "@/providers/email/templates";
import { isAdmin, type Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, isUuid, requireAdmin, requireClient } from "./authz";
import { notifyAdmins, notifyProjectClients } from "./notifications";
import { transitionProjectStatus } from "./projects";

export const designReviewSchema = z
  .object({
    title: z.string().trim().min(1, "Give the design a name, e.g. Homepage.").max(80),
    fileId: z.string().optional().default(""),
    previewUrl: z
      .string()
      .trim()
      .max(500)
      .optional()
      .default("")
      .refine((v) => !v || z.url({ protocol: /^https$/ }).safeParse(v).success, "Enter a valid https:// link."),
    notes: z.string().trim().max(5000).optional().default(""),
    requestReview: z.boolean().default(false),
  })
  .refine((v) => v.fileId || v.previewUrl, { path: ["fileId"], message: "Upload a design file or add a preview link." });

export const revisionSchema = z.object({
  body: z.string().trim().min(5, "Tell us what you'd like changed.").max(10_000),
});

export const approvalDecisionSchema = z.object({
  confirm: z.literal(true, { error: "Please confirm your approval." }),
  comment: z.string().trim().max(5000).optional().default(""),
});

const reviewLabel = (r: { title: string; version: number }) => `${r.title} v${r.version}`;

async function loadReview(tx: Tx, actor: Actor, reviewId: string) {
  const review = isUuid(reviewId) ? await tx.designReview.findUnique({ where: { id: reviewId } }) : null;
  if (!review || (!isAdmin(actor) && review.status === "DRAFT")) throw notFound("This design review could not be found.");
  const project = await assertProjectAccess(tx, actor, review.projectId).catch(() => {
    throw notFound("This design review could not be found.");
  });
  return { review, project };
}

async function requestReviewInTx(tx: Tx, actor: Actor, reviewId: string, emails: EmailMessage[]) {
  const { review, project } = await loadReview(tx, actor, reviewId);
  if (review.status !== "DRAFT") throw conflict("This design has already been sent for review.");

  await tx.designReview.update({ where: { id: review.id }, data: { status: "IN_REVIEW", requestedAt: new Date() } });
  await recordActivity(tx, {
    type: "DESIGN_REVIEW_REQUESTED",
    projectId: project.id,
    actorId: actor.id,
    message: `${reviewLabel(review)} is ready for review`,
    metadata: { designReviewId: review.id },
  });
  if (/home/i.test(review.title)) {
    await tx.projectTask.updateMany({
      where: { projectId: project.id, templateKey: "homepage-design", status: { not: "DONE" } },
      data: { status: "DONE", completedAt: new Date() },
    });
  }
  if (canTransition(project.status, "CLIENT_REVIEW", project.statusBeforeHold)) {
    await transitionProjectStatus(tx, project, "CLIENT_REVIEW", actor.id);
  }
  const recipients = await notifyProjectClients(tx, project.id, {
    type: "DESIGN_READY",
    title: "Your design is ready for review",
    body: reviewLabel(review),
    href: `/dashboard/project/${project.id}/reviews`,
  });
  for (const r of recipients) emails.push(emailTemplates.designReady(r.email, project.name, review.title, review.version, project.id));
}

/** Creates a new design version. Earlier unapproved versions of the same design are superseded. */
export async function createDesignReview(actor: Actor, projectId: string, input: z.input<typeof designReviewSchema>) {
  requireAdmin(actor);
  const parsed = designReviewSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const data = parsed.data;
  const emails: EmailMessage[] = [];

  const review = await db.$transaction(async (tx) => {
    await assertProjectAccess(tx, actor, projectId);

    if (data.fileId) {
      const file = isUuid(data.fileId)
        ? await tx.projectFile.findFirst({
            where: { id: data.fileId, projectId, category: "DESIGN", designReview: { is: null } },
          })
        : null;
      if (!file) throw validation(undefined, { fileId: ["Upload the design file again."] });
    }

    // Keep version numbering per design name, case-insensitively.
    const previous = await tx.designReview.findFirst({
      where: { projectId, title: { equals: data.title, mode: "insensitive" } },
      orderBy: { version: "desc" },
    });
    const title = previous?.title ?? data.title;
    const version = (previous?.version ?? 0) + 1;

    await tx.designReview.updateMany({
      where: { projectId, title, status: { in: ["DRAFT", "IN_REVIEW", "CHANGES_REQUESTED"] } },
      data: { status: "SUPERSEDED" },
    });

    const review = await tx.designReview.create({
      data: {
        projectId,
        title,
        version,
        fileId: data.fileId || null,
        previewUrl: data.previewUrl || null,
        notes: data.notes || null,
        createdById: actor.id,
      },
    });
    await recordActivity(tx, {
      type: "DESIGN_UPLOADED",
      projectId,
      actorId: actor.id,
      visibility: "INTERNAL",
      message: `Uploaded design ${reviewLabel(review)}`,
      metadata: { designReviewId: review.id },
    });
    if (data.requestReview) await requestReviewInTx(tx, actor, review.id, emails);
    return review;
  });

  await Promise.all(emails.map(sendEmail));
  return review;
}

export async function requestDesignReview(actor: Actor, reviewId: string) {
  requireAdmin(actor);
  const emails: EmailMessage[] = [];
  await db.$transaction((tx) => requestReviewInTx(tx, actor, reviewId, emails));
  await Promise.all(emails.map(sendEmail));
}

/** Client asks for changes to a design under review. */
export async function requestRevision(actor: Actor, reviewId: string, input: z.input<typeof revisionSchema>) {
  requireClient(actor);
  const parsed = revisionSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const emails: EmailMessage[] = [];

  const revision = await db.$transaction(async (tx) => {
    const { review, project } = await loadReview(tx, actor, reviewId);
    if (review.status !== "IN_REVIEW") throw conflict("This design is no longer awaiting review.");

    const revision = await tx.revisionRequest.create({
      data: { projectId: project.id, designReviewId: review.id, requestedById: actor.id, body: parsed.data.body },
    });
    await tx.designReview.update({
      where: { id: review.id },
      data: { status: "CHANGES_REQUESTED", decidedAt: new Date() },
    });
    await recordActivity(tx, {
      type: "REVISION_REQUESTED",
      projectId: project.id,
      actorId: actor.id,
      message: `Changes requested on ${reviewLabel(review)}`,
      metadata: { designReviewId: review.id, revisionRequestId: revision.id },
    });
    if (canTransition(project.status, "REVISION", project.statusBeforeHold)) {
      await transitionProjectStatus(tx, project, "REVISION", actor.id);
    }
    const href = `/admin/projects/${project.id}/reviews`;
    const admins = await notifyAdmins(tx, {
      type: "REVISION_REQUESTED",
      title: "Changes requested",
      body: `${reviewLabel(review)} · ${project.name}`,
      href,
    });
    for (const a of admins) emails.push(emailTemplates.revisionRequested(a.email, project.name, href));
    return revision;
  });

  await Promise.all(emails.map(sendEmail));
  return revision;
}

/** Client explicitly approves a specific design version. Viewing never counts as approval. */
export async function approveDesign(actor: Actor, reviewId: string, input: z.input<typeof approvalDecisionSchema>) {
  requireClient(actor);
  const parsed = approvalDecisionSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const emails: EmailMessage[] = [];

  const approval = await db.$transaction(async (tx) => {
    const { review, project } = await loadReview(tx, actor, reviewId);
    if (review.status !== "IN_REVIEW") throw conflict("This design is no longer awaiting review.");

    const now = new Date();
    await tx.designReview.update({ where: { id: review.id }, data: { status: "APPROVED", decidedAt: now } });
    const approval = await tx.approval.create({
      data: {
        projectId: project.id,
        type: "DESIGN_APPROVAL",
        status: "APPROVED",
        designReviewId: review.id,
        version: reviewLabel(review),
        comment: parsed.data.comment || null,
        approvedById: actor.id,
        decidedAt: now,
      },
    });
    await recordActivity(tx, {
      type: "DESIGN_APPROVED",
      projectId: project.id,
      actorId: actor.id,
      message: `${reviewLabel(review)} approved`,
      metadata: { designReviewId: review.id, approvalId: approval.id },
    });
    const href = `/admin/projects/${project.id}/reviews`;
    const admins = await notifyAdmins(tx, {
      type: "APPROVAL_RECEIVED",
      title: "Design approved",
      body: `${reviewLabel(review)} · ${project.name}`,
      href,
    });
    for (const a of admins) emails.push(emailTemplates.approvalReceived(a.email, project.name, reviewLabel(review), href));
    return approval;
  });

  await Promise.all(emails.map(sendEmail));
  return approval;
}

export async function resolveRevision(actor: Actor, revisionId: string) {
  requireAdmin(actor);
  const revision = isUuid(revisionId) ? await db.revisionRequest.findUnique({ where: { id: revisionId } }) : null;
  if (!revision) throw notFound("This revision request could not be found.");
  await db.$transaction(async (tx) => {
    await tx.revisionRequest.update({
      where: { id: revisionId },
      data: { status: "RESOLVED", resolvedAt: new Date() },
    });
    await recordActivity(tx, {
      type: "PROJECT_UPDATED",
      projectId: revision.projectId,
      actorId: actor.id,
      message: "Revision request addressed",
    });
  });
}

export async function listDesignReviews(actor: Actor, projectId: string) {
  await assertProjectAccess(db, actor, projectId);
  return db.designReview.findMany({
    where: { projectId, ...(isAdmin(actor) ? {} : { status: { not: "DRAFT" } }) },
    orderBy: [{ title: "asc" }, { version: "desc" }],
    include: {
      file: { select: { id: true, originalName: true, mimeType: true } },
      revisionRequests: {
        orderBy: { createdAt: "desc" },
        include: { requestedBy: { select: { firstName: true, lastName: true } } },
      },
      approvals: {
        where: { status: "APPROVED" },
        include: { approvedBy: { select: { firstName: true, lastName: true } } },
      },
    },
  });
}
