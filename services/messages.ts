import { z } from "zod";
import { db } from "@/db";
import { conflict, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import { sendEmail, type EmailMessage } from "@/providers/email";
import { emailTemplates } from "@/providers/email/templates";
import { isAdmin, type Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, isUuid, requireAdmin } from "./authz";
import { notifyAdmins, notifyProjectClients } from "./notifications";

export const messageSchema = z.object({
  body: z.string().trim().min(1, "Write a message.").max(10_000, "Messages must be under 10,000 characters."),
  attachmentIds: z.array(z.string()).max(5, "Attach up to 5 files.").optional().default([]),
});

export async function sendMessage(actor: Actor, projectId: string, input: z.input<typeof messageSchema>) {
  const parsed = messageSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const { body, attachmentIds } = parsed.data;
  if (attachmentIds.some((id) => !isUuid(id))) throw validation("Invalid attachment.");

  const emails: EmailMessage[] = [];
  const message = await db.$transaction(async (tx) => {
    const project = await assertProjectAccess(tx, actor, projectId);
    if (project.status === "CANCELLED") throw conflict("This project is closed.");

    const message = await tx.projectMessage.create({ data: { projectId, senderId: actor.id, body } });

    if (attachmentIds.length) {
      // Only the sender's own unattached files in this project can be attached.
      const { count } = await tx.projectFile.updateMany({
        where: { id: { in: attachmentIds }, projectId, uploadedById: actor.id, messageId: null },
        data: { messageId: message.id },
      });
      if (count !== attachmentIds.length) throw validation("One or more attachments are invalid.");
    }

    await recordActivity(tx, {
      type: "MESSAGE_SENT",
      projectId,
      actorId: actor.id,
      message: isAdmin(actor) ? "CoreGravity sent a message" : `${actor.firstName} sent a message`,
    });

    const clientHref = `/dashboard/project/${projectId}/messages`;
    const adminHref = `/admin/projects/${projectId}/messages`;
    const notification = {
      type: "NEW_MESSAGE" as const,
      title: `New message from ${actor.firstName}`,
      body: body.slice(0, 140),
    };
    const recipients = isAdmin(actor)
      ? await notifyProjectClients(tx, projectId, { ...notification, href: clientHref }, actor.id)
      : await notifyAdmins(tx, { ...notification, href: adminHref }, actor.id);
    for (const r of recipients) {
      emails.push(emailTemplates.newMessage(r.email, project.name, isAdmin(actor) ? clientHref : adminHref));
    }
    return message;
  });

  await Promise.all(emails.map(sendEmail));
  return message;
}

/**
 * Lists a project's messages (newest page, returned oldest-first) and marks
 * messages from the other side as read.
 */
export async function listMessages(actor: Actor, projectId: string, options: { before?: string; take?: number } = {}) {
  await assertProjectAccess(db, actor, projectId);
  const take = Math.min(options.take ?? 50, 100);
  const before = options.before && !Number.isNaN(Date.parse(options.before)) ? new Date(options.before) : undefined;

  const messages = await db.projectMessage.findMany({
    where: { projectId, ...(before ? { createdAt: { lt: before } } : {}) },
    orderBy: { createdAt: "desc" },
    take: take + 1,
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, role: true } },
      attachments: { select: { id: true, originalName: true, mimeType: true, size: true } },
    },
  });
  const hasMore = messages.length > take;
  const page = messages.slice(0, take).reverse();

  const unreadIds = page
    .filter((m) => !m.readAt && (isAdmin(actor) ? m.sender?.role === "CLIENT" : m.sender?.role !== "CLIENT"))
    .map((m) => m.id);
  if (unreadIds.length) {
    await db.projectMessage.updateMany({ where: { id: { in: unreadIds } }, data: { readAt: new Date() } });
  }

  return { messages: page, hasMore, oldest: page[0]?.createdAt ?? null };
}

/** Studio inbox: projects with their latest message and unread count. */
export async function listMessageThreads(actor: Actor) {
  requireAdmin(actor);
  const projects = await db.project.findMany({
    where: { messages: { some: {} } },
    orderBy: { lastActivityAt: "desc" },
    take: 50,
    select: {
      id: true,
      name: true,
      number: true,
      business: { select: { name: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        include: { sender: { select: { firstName: true, lastName: true, role: true } } },
      },
      _count: { select: { messages: { where: { readAt: null, sender: { role: "CLIENT" } } } } },
    },
  });
  return projects
    .map((p) => ({ ...p, latest: p.messages[0], unread: p._count.messages }))
    .sort((a, b) => (b.latest?.createdAt.getTime() ?? 0) - (a.latest?.createdAt.getTime() ?? 0));
}
