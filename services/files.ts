import { randomUUID } from "node:crypto";
import { db, type FileCategory, type Prisma } from "@/db";
import {
  CLIENT_FILE_CATEGORIES,
  DESIGN_EXTENSIONS,
  FILE_CATEGORY_LABELS,
  MAX_DESIGN_UPLOAD_BYTES,
  validateUpload,
} from "@/domain/files";
import { conflict, forbidden, notFound, validation } from "@/lib/errors";
import { getStorage } from "@/providers/storage";
import { isAdmin, type Actor } from "./actor";
import { recordActivity } from "./activity";
import { assertProjectAccess, isUuid } from "./authz";

const FILE_CATEGORIES = Object.keys(FILE_CATEGORY_LABELS) as FileCategory[];

export interface UploadInput {
  projectId: string;
  category: string;
  name: string;
  size: number;
  bytes: Uint8Array;
}

export async function uploadFile(actor: Actor, input: UploadInput) {
  const project = await assertProjectAccess(db, actor, input.projectId);
  if (project.status === "CANCELLED") throw conflict("Files cannot be added to a cancelled project.");

  const category = input.category as FileCategory;
  if (!FILE_CATEGORIES.includes(category)) throw validation("Please choose a valid document type.");
  if (!isAdmin(actor) && !CLIENT_FILE_CATEGORIES.includes(category)) throw forbidden();

  const isDesign = category === "DESIGN";
  const checked = validateUpload({
    name: input.name,
    size: input.size,
    bytes: input.bytes,
    allowedExtensions: isDesign ? DESIGN_EXTENSIONS : undefined,
    maxBytes: isDesign ? MAX_DESIGN_UPLOAD_BYTES : undefined,
  });
  if (!checked.ok) throw validation(checked.error);

  const storageKey = `projects/${project.id}/${randomUUID()}.${checked.extension}`;
  const storage = getStorage();
  await storage.put(storageKey, input.bytes, checked.mimeType);

  try {
    return await db.$transaction(async (tx) => {
      const file = await tx.projectFile.create({
        data: {
          projectId: project.id,
          uploadedById: actor.id,
          category,
          originalName: checked.name,
          storageKey,
          mimeType: checked.mimeType,
          size: input.size,
        },
        select: { id: true, originalName: true, mimeType: true, size: true, category: true, createdAt: true },
      });
      // Designs and message attachments are recorded by their own workflows.
      if (!isDesign && category !== "ATTACHMENT") {
        await recordActivity(tx, {
          type: "FILE_UPLOADED",
          projectId: project.id,
          actorId: actor.id,
          message: `Uploaded ${checked.name}`,
          metadata: { fileId: file.id, category },
        });
      }
      return file;
    });
  } catch (error) {
    await storage.delete(storageKey).catch(() => undefined);
    throw error;
  }
}

/** Visibility rule: clients never see design files that haven't been shared for review. */
function clientFileFilter(actor: Actor): Prisma.ProjectFileWhereInput {
  if (isAdmin(actor)) return {};
  return { NOT: { category: "DESIGN", OR: [{ designReview: { is: null } }, { designReview: { is: { status: "DRAFT" } } }] } };
}

export async function listProjectFiles(actor: Actor, projectId: string, category?: string) {
  await assertProjectAccess(db, actor, projectId);
  return db.projectFile.findMany({
    where: {
      projectId,
      ...clientFileFilter(actor),
      ...(category && FILE_CATEGORIES.includes(category as FileCategory) ? { category: category as FileCategory } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { uploadedBy: { select: { id: true, firstName: true, lastName: true, role: true } } },
  });
}

/** Returns file metadata and bytes after verifying the actor may access the project. */
export async function getFileForDownload(actor: Actor, fileId: string) {
  if (!isUuid(fileId)) throw notFound("This file could not be found.");
  const file = await db.projectFile.findFirst({
    where: { id: fileId, ...clientFileFilter(actor) },
  });
  if (!file) throw notFound("This file could not be found.");
  // Project-level ownership check (throws the same not-found error for other clients' files).
  await assertProjectAccess(db, actor, file.projectId).catch(() => {
    throw notFound("This file could not be found.");
  });
  const bytes = await getStorage().get(file.storageKey);
  if (!bytes) throw notFound("This file is no longer available.");
  return { file, bytes };
}

export async function deleteFile(actor: Actor, fileId: string) {
  if (!isUuid(fileId)) throw notFound("This file could not be found.");
  const file = await db.projectFile.findUnique({ where: { id: fileId }, include: { designReview: true } });
  if (!file) throw notFound("This file could not be found.");
  await assertProjectAccess(db, actor, file.projectId).catch(() => {
    throw notFound("This file could not be found.");
  });
  if (!isAdmin(actor) && file.uploadedById !== actor.id) throw forbidden("You can only remove files you uploaded.");
  if (file.designReview) throw conflict("This file is part of a design review and cannot be removed.");

  await db.$transaction(async (tx) => {
    await tx.projectFile.delete({ where: { id: fileId } });
    await recordActivity(tx, {
      type: "PROJECT_UPDATED",
      projectId: file.projectId,
      actorId: actor.id,
      visibility: "INTERNAL",
      message: `Removed file ${file.originalName}`,
    });
  });
  await getStorage().delete(file.storageKey).catch(() => undefined);
}
