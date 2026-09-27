import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { StorageProvider } from "./types";

/** Stores files on the local filesystem, outside the public directory. */
export class LocalStorageProvider implements StorageProvider {
  readonly name = "local";
  private readonly root: string;

  constructor(root: string) {
    this.root = path.resolve(root);
  }

  private resolve(key: string) {
    // Keys are generated server-side, but guard against traversal anyway.
    if (!/^[a-zA-Z0-9/_.-]+$/.test(key) || key.includes("..")) {
      throw new Error("Invalid storage key");
    }
    const full = path.resolve(this.root, key);
    if (!full.startsWith(this.root + path.sep)) throw new Error("Invalid storage key");
    return full;
  }

  async put(key: string, data: Uint8Array) {
    const full = this.resolve(key);
    await mkdir(path.dirname(full), { recursive: true });
    await writeFile(full, data);
  }

  async get(key: string) {
    try {
      return new Uint8Array(await readFile(this.resolve(key)));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
      throw error;
    }
  }

  async delete(key: string) {
    await rm(this.resolve(key), { force: true });
  }
}
