import "server-only";
import { LocalStorageProvider } from "./local";
import { VercelBlobStorageProvider } from "./vercel-blob";
import type { StorageProvider } from "./types";

export type { StorageProvider } from "./types";

let provider: StorageProvider | undefined;

/**
 * Returns the configured storage provider: "local" (filesystem) or
 * "vercel-blob" (private Vercel Blob). S3, Cloudflare R2 or Supabase Storage
 * can be added by implementing StorageProvider.
 */
export function getStorage(): StorageProvider {
  if (provider) return provider;
  const kind = process.env.STORAGE_PROVIDER ?? "local";
  switch (kind) {
    case "local":
      provider = new LocalStorageProvider(process.env.STORAGE_LOCAL_DIR ?? "./storage/uploads");
      return provider;
    case "vercel-blob":
      if (!process.env.BLOB_READ_WRITE_TOKEN) throw new Error("BLOB_READ_WRITE_TOKEN is required for vercel-blob storage.");
      provider = new VercelBlobStorageProvider();
      return provider;
    default:
      throw new Error(`Storage provider "${kind}" is not implemented. See docs/deployment.md.`);
  }
}
