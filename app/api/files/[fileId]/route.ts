import { getFileForDownload } from "@/services/files";
import { errorResponse, jsonError } from "@/server/http";
import { getActor } from "@/server/session";

const INLINE_TYPES = new Set(["image/png", "image/jpeg", "image/gif", "image/webp", "application/pdf"]);

/**
 * Authorized file download. Files are never served from a public directory;
 * every request checks the session and project ownership.
 */
export async function GET(request: Request, { params }: { params: Promise<{ fileId: string }> }) {
  const actor = await getActor();
  if (!actor) return jsonError(401, "Please sign in to view this file.");
  const { fileId } = await params;

  try {
    const { file, bytes } = await getFileForDownload(actor, fileId);
    const download = new URL(request.url).searchParams.has("download") || !INLINE_TYPES.has(file.mimeType);
    const encodedName = encodeURIComponent(file.originalName);
    return new Response(Buffer.from(bytes), {
      headers: {
        "Content-Type": file.mimeType,
        "Content-Length": String(bytes.length),
        "Content-Disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodedName}`,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
        // Uploaded content is untrusted: never let it run scripts or be framed elsewhere.
        "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
