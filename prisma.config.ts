import "dotenv/config";
import { defineConfig } from "prisma/config";

/**
 * Migrations need a direct (non-pooled) connection: poolers such as Neon's
 * PgBouncer don't support the advisory lock `prisma migrate` takes, which
 * shows up as a P1002 timeout. Prefer DATABASE_URL_UNPOOLED; otherwise derive
 * Neon's direct host by removing "-pooler" from the pooled one.
 */
function migrationUrl() {
  if (process.env.DATABASE_URL_UNPOOLED) return process.env.DATABASE_URL_UNPOOLED;
  const url = process.env.DATABASE_URL ?? "";
  return url.replace(/(@[^/?]+?)-pooler(\.[^/?]*neon\.tech)/, "$1$2");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: migrationUrl(),
  },
});
