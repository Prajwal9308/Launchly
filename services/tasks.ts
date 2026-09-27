import { z } from "zod";
import { db, type Prisma } from "@/db";
import { notFound, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, isUuid, requireAdmin } from "./authz";

export const TASK_STATUSES = ["TODO", "IN_PROGRESS", "BLOCKED", "DONE"] as const;
export const TASK_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;

const dueDate = z
  .string()
  .trim()
  .optional()
  .transform((v, ctx) => {
    if (!v) return null;
    const date = new Date(`${v}T12:00:00Z`);
    if (Number.isNaN(date.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      ctx.addIssue({ code: "custom", message: "Enter a valid date." });
      return z.NEVER;
    }
    return date;
  });

export const taskInputSchema = z.object({
  title: z.string().trim().min(1, "Title is required.").max(200),
  description: z.string().trim().max(5000).optional().default(""),
  priority: z.enum(TASK_PRIORITIES).default("MEDIUM"),
  status: z.enum(TASK_STATUSES).default("TODO"),
  dueDate,
  assigneeId: z.string().optional().default(""),
  clientVisible: z.boolean().default(true),
});

export type TaskInput = z.input<typeof taskInputSchema>;

async function resolveAssignee(assigneeId: string) {
  if (!assigneeId) return null;
  // Only studio users can be assigned tasks.
  const user = isUuid(assigneeId)
    ? await db.user.findFirst({ where: { id: assigneeId, role: "ADMIN" }, select: { id: true } })
    : null;
  if (!user) throw validation(undefined, { assigneeId: ["Choose a valid team member."] });
  return user.id;
}

function parse(input: TaskInput) {
  const parsed = taskInputSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  return parsed.data;
}

export async function createTask(actor: Actor, projectId: string, input: TaskInput) {
  requireAdmin(actor);
  const data = parse(input);
  const assigneeId = await resolveAssignee(data.assigneeId);
  return db.$transaction(async (tx) => {
    await assertProjectAccess(tx, actor, projectId);
    const last = await tx.projectTask.aggregate({ where: { projectId }, _max: { sortOrder: true } });
    const task = await tx.projectTask.create({
      data: {
        projectId,
        title: data.title,
        description: data.description || null,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate,
        assigneeId,
        clientVisible: data.clientVisible,
        createdById: actor.id,
        sortOrder: (last._max.sortOrder ?? -1) + 1,
        completedAt: data.status === "DONE" ? new Date() : null,
      },
    });
    await recordActivity(tx, {
      type: "TASK_CREATED",
      projectId,
      actorId: actor.id,
      visibility: data.clientVisible ? "CLIENT" : "INTERNAL",
      message: `Task added: ${task.title}`,
    });
    return task;
  });
}

async function loadTaskForAdmin(actor: Actor, taskId: string) {
  requireAdmin(actor);
  const task = isUuid(taskId) ? await db.projectTask.findUnique({ where: { id: taskId } }) : null;
  if (!task) throw notFound("This task could not be found.");
  return task;
}

export async function updateTask(actor: Actor, taskId: string, input: TaskInput) {
  const task = await loadTaskForAdmin(actor, taskId);
  const data = parse(input);
  const assigneeId = await resolveAssignee(data.assigneeId);
  const becameDone = data.status === "DONE" && task.status !== "DONE";

  return db.$transaction(async (tx) => {
    const updated = await tx.projectTask.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description || null,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate,
        assigneeId,
        clientVisible: data.clientVisible,
        completedAt: data.status === "DONE" ? (task.completedAt ?? new Date()) : null,
      },
    });
    await recordActivity(tx, {
      type: becameDone ? "TASK_COMPLETED" : "PROJECT_UPDATED",
      projectId: task.projectId,
      actorId: actor.id,
      visibility: becameDone && updated.clientVisible ? "CLIENT" : "INTERNAL",
      message: becameDone ? `Task completed: ${updated.title}` : `Task updated: ${updated.title}`,
    });
    return updated;
  });
}

export async function setTaskStatus(actor: Actor, taskId: string, status: (typeof TASK_STATUSES)[number]) {
  const task = await loadTaskForAdmin(actor, taskId);
  if (!TASK_STATUSES.includes(status)) throw validation("Invalid task status.");
  if (task.status === status) return task;

  return db.$transaction(async (tx) => {
    const updated = await tx.projectTask.update({
      where: { id: taskId },
      data: { status, completedAt: status === "DONE" ? new Date() : null },
    });
    if (status === "DONE") {
      await recordActivity(tx, {
        type: "TASK_COMPLETED",
        projectId: task.projectId,
        actorId: actor.id,
        visibility: task.clientVisible ? "CLIENT" : "INTERNAL",
        message: `Task completed: ${task.title}`,
      });
    }
    return updated;
  });
}

export const completeTask = (actor: Actor, taskId: string) => setTaskStatus(actor, taskId, "DONE");

export async function deleteTask(actor: Actor, taskId: string) {
  const task = await loadTaskForAdmin(actor, taskId);
  await db.$transaction(async (tx) => {
    await tx.projectTask.delete({ where: { id: taskId } });
    await recordActivity(tx, {
      type: "PROJECT_UPDATED",
      projectId: task.projectId,
      actorId: actor.id,
      visibility: "INTERNAL",
      message: `Task removed: ${task.title}`,
    });
  });
}

export interface TaskListParams {
  status?: string;
  q?: string;
  mine?: boolean;
  page?: number;
  pageSize?: number;
}

/** All tasks across projects, for the studio's task board. */
export async function listAllTasks(actor: Actor, params: TaskListParams) {
  requireAdmin(actor);
  const pageSize = params.pageSize ?? 25;
  const page = Math.max(1, params.page ?? 1);
  const where: Prisma.ProjectTaskWhereInput = {
    project: { status: { notIn: ["DRAFT", "CANCELLED"] } },
  };
  if (params.status === "open" || !params.status) where.status = { not: "DONE" };
  else if ((TASK_STATUSES as readonly string[]).includes(params.status)) {
    where.status = params.status as (typeof TASK_STATUSES)[number];
  }
  if (params.mine) where.assigneeId = actor.id;
  const q = params.q?.trim().slice(0, 100);
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { project: { name: { contains: q, mode: "insensitive" } } },
      { project: { business: { name: { contains: q, mode: "insensitive" } } } },
    ];
  }
  const [items, total] = await Promise.all([
    db.projectTask.findMany({
      where,
      orderBy: [{ dueDate: { sort: "asc", nulls: "last" } }, { sortOrder: "asc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        project: { select: { id: true, name: true, number: true, business: { select: { name: true } } } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    db.projectTask.count({ where }),
  ]);
  return { items, total, page, pageSize };
}

export async function listAdmins(actor: Actor) {
  requireAdmin(actor);
  return db.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, firstName: true, lastName: true },
    orderBy: { firstName: "asc" },
  });
}
