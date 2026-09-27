/**
 * Migrates and seeds the dedicated E2E database. Runs as part of the
 * Playwright webServer command (Playwright starts the server before globalSetup).
 */
import { execSync } from "node:child_process";

const url = process.env.DATABASE_URL ?? "";
if (!/e2e|test/.test(url)) throw new Error("Refusing to prepare: DATABASE_URL must point to an e2e/test database.");
// SEED_FORCE: this database is disposable (name-checked above).
const env = { ...process.env, NODE_ENV: "development" as const, SEED_FORCE: "1" };
execSync("npx prisma migrate deploy", { stdio: "inherit", env });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit", env });
