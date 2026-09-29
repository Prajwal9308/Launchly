import { MAX_DESIGN_UPLOAD_BYTES } from "@/domain/files";
import { rateLimits } from "@/providers/rate-limit";
import { uploadFile } from "@/services/files";
import { errorResponse, isSameOrigin, jsonError } from "@/server/http";
import { getActor } from "@/server/session";

/** Multipart upload: fields `file`, `projectId`, `category`. */
export async function POST(request: Request) {
  if (!isSameOrigin(request)) return jsonError(403, "Invalid request origin.");
  const actor = await getActor();
  if (!actor) return jsonError(401, "Please sign in to upload files.");

  const limit = await rateLimits.upload().limit(`upload:${actor.id}`);
  if (!limit.success) return jsonError(429, "Too many requests were submitted in a short period. Please wait a moment and try again.");

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_DESIGN_UPLOAD_BYTES + 64 * 1024) return jsonError(413, "This file is too large to upload.");

  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return jsonError(400, "Please choose a file to upload.");
    if (file.size > MAX_DESIGN_UPLOAD_BYTES) return jsonError(413, "This file is too large to upload.");

    const uploaded = await uploadFile(actor, {
      projectId: String(form.get("projectId") ?? ""),
      category: String(form.get("category") ?? "OTHER"),
      name: file.name,
      size: file.size,
      bytes: new Uint8Array(await file.arrayBuffer()),
    });
    return Response.json({ file: uploaded }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
