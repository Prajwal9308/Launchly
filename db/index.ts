import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/** Shared Prisma client. Reused across hot reloads in development. */
export const db = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}

export type DbClient = typeof db;
/** Either the root client or an interactive transaction client. */
export type Tx = Parameters<Parameters<DbClient["$transaction"]>[0]>[0] | DbClient;

export * from "./generated/prisma/client";
