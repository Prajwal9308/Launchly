import { del, get, put } from "@vercel/blob";
import type { StorageProvider } from "./types";

/**
 * Vercel Blob storage using PRIVATE blobs: files are never publicly reachable.
 * Downloads always go through /api/files/[id], which checks permissions and
 * then reads the bytes server-side. Requires BLOB_READ_WRITE_TOKEN (set
 * automatically when a Blob store is connected to the Vercel project).
 */
export class VercelBlobStorageProvider implements StorageProvider {
  readonly name = "vercel-blob";

  async put(key: string, data: Uint8Array, contentType: string) {
    await put(key, Buffer.from(data), { access: "private", contentType, addRandomSuffix: false, allowOverwrite: false });
  }

  async get(key: string) {
    const result = await get(key, { access: "private" });
    if (!result || result.statusCode !== 200) return null;
    return new Uint8Array(await new Response(result.stream).arrayBuffer());
  }

  async delete(key: string) {
    await del(key).catch(() => undefined);
  }
}
