/**
 * Runs during deployment (`npm run vercel-build`) after migrations.
 * Safe to run on every deploy: it only acts on a brand-new database.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../db/generated/prisma/client";
import { bootstrapCatalog } from "./bootstrap-catalog";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

bootstrapCatalog(db)
  .then((r) => console.log(r.bootstrapped ? "Bootstrapped default site content." : "Site content already set up; nothing to do."))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
