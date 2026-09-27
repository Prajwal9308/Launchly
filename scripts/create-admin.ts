/**
 * Creates or promotes a studio admin.
 *
 *   npm run create-admin -- you@example.com                 # promote an existing user (e.g. after Google sign-in)
 *   npm run create-admin -- you@example.com "Password-123"  # create a password admin if the user doesn't exist
 *
 * Uses DATABASE_URL from the environment (.env, or `vercel env pull`).
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../db/generated/prisma/client";

const [emailArg, password] = process.argv.slice(2);
const email = emailArg?.trim().toLowerCase();
if (!email || !email.includes("@")) {
  console.error('Usage: npm run create-admin -- <email> ["password"]');
  process.exit(1);
}

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    await db.user.update({ where: { id: existing.id }, data: { role: "ADMIN" } });
    // A studio account shouldn't remain a member of client organizations.
    await db.organizationMember.deleteMany({ where: { userId: existing.id } });
    console.log(`${email} is now an admin.`);
    return;
  }
  if (!password || password.length < 12) {
    console.error("No user with that email. Sign in once with Google, or pass a password of at least 12 characters.");
    process.exit(1);
  }
  const [firstName, ...rest] = email.split("@")[0].split(/[._-]/);
  await db.user.create({
    data: {
      email,
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
      firstName: firstName ? firstName[0].toUpperCase() + firstName.slice(1) : "Admin",
      lastName: rest.join(" "),
    },
  });
  console.log(`Created admin ${email}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
