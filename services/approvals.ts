import { z } from "zod";
import { db, type ApprovalType } from "@/db";
import { canTransition } from "@/domain/project-status";
import { conflict, notFound, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import { sendEmail, type EmailMessage } from "@/providers/email";
import { emailTemplates } from "@/providers/email/templates";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, isUuid, requireAdmin, requireClient } from "./authz";
import { notifyAdmins, notifyProjectClients } from "./notifications";
import { transitionProjectStatus } from "./projects";

export const APPROVAL_LABELS: Record<ApprovalType, string> = {
  DESIGN_APPROVAL: "Design approval",
  FINAL_APPROVAL: "Final approval",
  LAUNCH_APPROVAL: "Launch approval",
};

/** Approval types the studio can request directly (design approvals come from design reviews). */
export const REQUESTABLE_APPROVALS = ["FINAL_APPROVAL", "LAUNCH_APPROVAL"] as const;

export const approvalRequestSchema = z.object({
  type: z.enum(REQUESTABLE_APPROVALS),
  message: z.string().trim().max(5000).optional().default(""),
});

export const approvalResponseSchema = z.discriminatedUnion("decision", [
  z.object({
    decision: z.literal("APPROVE"),
    confirm: z.literal(true, { error: "Please confirm your approval." }),
    comment: z.string().trim().max(5000).optional().default(""),
  }),
  z.object({
    decision: z.literal("CHANGES"),
    comment: z.string().trim().min(5, "Tell us what needs to change.").max(5000),
  }),
]);

export async function requestApproval(actor: Actor, projectId: string, input: z.input<typeof approvalRequestSchema>) {
  requireAdmin(actor);
  const parsed = approvalRequestSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const { type, message } = parsed.data;
  const emails: EmailMessage[] = [];

  const approval = await db.$transaction(async (tx) => {
    const project = await assertProjectAccess(tx, actor, projectId);
    const pending = await tx.approval.findFirst({ where: { projectId, type, status: "PENDING" } });
    if (pending) throw conflict(`A ${APPROVAL_LABELS[type].toLowerCase()} is already pending.`);

    const approval = await tx.approval.create({
      data: { projectId, type, requestMessage: message || null, requestedById: actor.id },
    });
    await recordActivity(tx, {
      type: "APPROVAL_REQUESTED",
      projectId,
      actorId: actor.id,
      message: `${APPROVAL_LABELS[type]} requested`,
      metadata: { approvalId: approval.id },
    });
    if (type === "FINAL_APPROVAL" && canTransition(project.status, "CLIENT_APPROVAL", project.statusBeforeHold)) {
      await transitionProjectStatus(tx, project, "CLIENT_APPROVAL", actor.id);
    }
    const recipients = await notifyProjectClients(tx, projectId, {
      type: "APPROVAL_REQUESTED",
      title: `${APPROVAL_LABELS[type]} needed`,
      body: project.name,
      href: `/dashboard/project/${projectId}/reviews`,
    });
    for (const r of recipients) emails.push(emailTemplates.approvalRequested(r.email, project.name, projectId));
    return approval;
  });

  await Promise.all(emails.map(sendEmail));
  return approval;
}

/** Client approves or requests changes. Approval requires explicit confirmation. */
export async function respondToApproval(actor: Actor, approvalId: string, input: z.input<typeof approvalResponseSchema>) {
  requireClient(actor);
  const parsed = approvalResponseSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const data = parsed.data;
  const emails: EmailMessage[] = [];

  await db.$transaction(async (tx) => {
    const approval = isUuid(approvalId) ? await tx.approval.findUnique({ where: { id: approvalId } }) : null;
    if (!approval) throw notFound("This approval request could not be found.");
    const project = await assertProjectAccess(tx, actor, approval.projectId).catch(() => {
      throw notFound("This approval request could not be found.");
    });
    if (approval.status !== "PENDING") throw conflict("This approval request has already been answered.");

    const approved = data.decision === "APPROVE";
    await tx.approval.update({
      where: { id: approval.id },
      data: {
        status: approved ? "APPROVED" : "CHANGES_REQUESTED",
        approvedById: actor.id,
        decidedAt: new Date(),
        comment: data.comment || null,
        version: APPROVAL_LABELS[approval.type],
      },
    });
    await recordActivity(tx, {
      type: approved ? "APPROVAL_GRANTED" : "APPROVAL_CHANGES_REQUESTED",
      projectId: project.id,
      actorId: actor.id,
      message: approved
        ? `${APPROVAL_LABELS[approval.type]} granted`
        : `Changes requested before ${APPROVAL_LABELS[approval.type].toLowerCase()}`,
      metadata: { approvalId: approval.id },
    });

    if (approved && approval.type === "FINAL_APPROVAL") {
      await tx.projectTask.updateMany({
        where: { projectId: project.id, templateKey: "client-approval", status: { not: "DONE" } },
        data: { status: "DONE", completedAt: new Date() },
      });
      if (canTransition(project.status, "READY_TO_LAUNCH", project.statusBeforeHold)) {
        await transitionProjectStatus(tx, project, "READY_TO_LAUNCH", actor.id);
      }
    }
    if (!approved) {
      await tx.revisionRequest.create({
        data: { projectId: project.id, requestedById: actor.id, body: data.comment },
      });
      if (canTransition(project.status, "REVISION", project.statusBeforeHold)) {
        await transitionProjectStatus(tx, project, "REVISION", actor.id);
      }
    }

    const href = `/admin/projects/${project.id}/reviews`;
    const admins = await notifyAdmins(tx, {
      type: approved ? "APPROVAL_RECEIVED" : "REVISION_REQUESTED",
      title: approved ? `${APPROVAL_LABELS[approval.type]} received` : "Changes requested",
      body: project.name,
      href,
    });
    for (const a of admins) {
      emails.push(
        approved
          ? emailTemplates.approvalReceived(a.email, project.name, APPROVAL_LABELS[approval.type], href)
          : emailTemplates.revisionRequested(a.email, project.name, href),
      );
    }
  });

  await Promise.all(emails.map(sendEmail));
}

export async function cancelApproval(actor: Actor, approvalId: string) {
  requireAdmin(actor);
  const approval = isUuid(approvalId) ? await db.approval.findUnique({ where: { id: approvalId } }) : null;
  if (!approval || approval.status !== "PENDING") throw notFound("This approval request could not be found.");
  await db.$transaction(async (tx) => {
    await tx.approval.update({ where: { id: approvalId }, data: { status: "CANCELLED" } });
    await recordActivity(tx, {
      type: "PROJECT_UPDATED",
      projectId: approval.projectId,
      actorId: actor.id,
      message: `${APPROVAL_LABELS[approval.type]} request withdrawn`,
    });
  });
}

export async function listApprovals(actor: Actor, projectId: string) {
  await assertProjectAccess(db, actor, projectId);
  return db.approval.findMany({
    where: { projectId, status: { not: "CANCELLED" } },
    orderBy: { createdAt: "desc" },
    include: {
      approvedBy: { select: { firstName: true, lastName: true } },
      requestedBy: { select: { firstName: true, lastName: true } },
      designReview: { select: { id: true, title: true, version: true } },
    },
  });
}
