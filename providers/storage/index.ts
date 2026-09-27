import "server-only";
import { LocalStorageProvider } from "./local";
import type { StorageProvider } from "./types";

export type { StorageProvider } from "./types";

let provider: StorageProvider | undefined;

/**
 * Returns the configured storage provider. Only "local" ships today; S3,
 * Cloudflare R2 or Supabase Storage can be added by implementing StorageProvider.
 */
export function getStorage(): StorageProvider {
  if (provider) return provider;
  const kind = process.env.STORAGE_PROVIDER ?? "local";
  switch (kind) {
    case "local":
      provider = new LocalStorageProvider(process.env.STORAGE_LOCAL_DIR ?? "./storage/uploads");
      return provider;
    default:
      throw new Error(`Storage provider "${kind}" is not implemented. See docs/deployment.md.`);
  }
}
