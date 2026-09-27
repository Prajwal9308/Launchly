/**
 * Storage abstraction for uploaded files. File bytes live in the storage
 * provider; only metadata is stored in PostgreSQL.
 */
export interface StorageProvider {
  readonly name: string;
  put(key: string, data: Uint8Array, contentType: string): Promise<void>;
  get(key: string): Promise<Uint8Array | null>;
  delete(key: string): Promise<void>;
}
