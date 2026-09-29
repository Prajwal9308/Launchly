import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/db";
import { COUNTRIES } from "@/domain/country";
import { conflict, validation } from "@/lib/errors";
import { fieldErrorsOf } from "@/lib/validation";
import { sendEmail } from "@/providers/email";
import { emailTemplates } from "@/providers/email/templates";
import type { Actor } from "./actor";
import { recordActivity } from "./activity";
import { notifyAdmins } from "./notifications";

const BCRYPT_COST = 12;

export const passwordSchema = z
  .string()
  .min(10, "Your password must be at least 10 characters.")
  .max(128, "Your password must be 128 characters or fewer.")
  .refine((v) => /[a-zA-Z]/.test(v) && /\d/.test(v), "Your password must include at least one letter and one number.");

const phoneSchema = z
  .string()
  .trim()
  .max(40)
  .refine((v) => !v || /^[+()\-.\s\d]{7,}$/.test(v), "Please enter a valid phone number.");

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name.").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name.").max(60),
  email: z.email("Please enter a valid email address.").trim().toLowerCase().max(254),
  password: passwordSchema,
  businessName: z.string().trim().min(1, "Please enter your business name.").max(120),
  country: z.enum(COUNTRIES, "Please select your country."),
  phone: phoneSchema.optional().default(""),
});

export type SignupInput = z.input<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.email().trim().toLowerCase().max(254),
  password: z.string().min(1).max(128),
});

export function hashPassword(password: string) {
  return bcrypt.hash(password, BCRYPT_COST);
}

// Used to keep login timing similar whether or not the email exists.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= bcrypt.hash("timing-equalizer", BCRYPT_COST));

/**
 * Registers a client. If the studio converted a lead for this email, the new
 * user joins that existing organization instead of creating a new one.
 */
export async function registerClient(input: SignupInput) {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const data = parsed.data;

  const existing = await db.user.findUnique({ where: { email: data.email }, select: { id: true } });
  if (existing) throw conflict("An account with this email address already exists. Please sign in instead.");

  const passwordHash = await hashPassword(data.password);

  const user = await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        email: data.email,
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        role: "CLIENT",
        clientProfile: { create: { phone: data.phone || null } },
      },
    });

    const invitedOrg = await tx.organization.findFirst({
      where: { inviteEmail: data.email, members: { none: {} } },
      orderBy: { createdAt: "desc" },
    });

    if (invitedOrg) {
      await tx.organizationMember.create({ data: { organizationId: invitedOrg.id, userId: user.id, role: "OWNER" } });
      await tx.organization.update({
        where: { id: invitedOrg.id },
        data: { inviteEmail: null, country: invitedOrg.country ?? data.country },
      });
    } else {
      await tx.organization.create({
        data: {
          name: data.businessName,
          country: data.country,
          members: { create: { userId: user.id, role: "OWNER" } },
          businesses: { create: { name: data.businessName, phone: data.phone || null, email: data.email } },
        },
      });
    }

    await recordActivity(tx, {
      type: "USER_REGISTERED",
      actorId: user.id,
      visibility: "INTERNAL",
      message: `${data.firstName} ${data.lastName} created a client account`,
      metadata: { businessName: data.businessName },
    });
    await notifyAdmins(tx, {
      type: "USER_REGISTERED",
      title: "New client account",
      body: `${data.firstName} ${data.lastName} · ${data.businessName}`,
      href: "/admin/clients",
    });
    return user;
  });

  await sendEmail(emailTemplates.welcome(user.email, user.firstName));
  return { id: user.id, email: user.email };
}

/**
 * Verifies credentials for Auth.js. Returns null on any failure without
 * revealing whether the email exists. Records a login activity on success.
 */
export async function verifyCredentials(email: string, password: string) {
  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) return null;

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? (await getDummyHash()));
  if (!user || !user.passwordHash || !valid) return null;

  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await recordActivity(tx, {
      type: user.role === "ADMIN" ? "ADMIN_LOGIN" : "CLIENT_LOGIN",
      actorId: user.id,
      visibility: "INTERNAL",
      message: `${user.firstName} ${user.lastName} logged in`,
    });
  });

  return { id: user.id, email: user.email, role: user.role, name: `${user.firstName} ${user.lastName}` };
}

export const profileSchema = z.object({
  firstName: z.string().trim().min(1, "Please enter your first name.").max(60),
  lastName: z.string().trim().min(1, "Please enter your last name.").max(60),
  phone: phoneSchema.optional().default(""),
  /** Clients only: the country of their business account (sets their currency). */
  country: z.enum(COUNTRIES, "Please select your country.").optional(),
});

export async function updateProfile(actor: Actor, input: z.input<typeof profileSchema>) {
  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  await db.user.update({
    where: { id: actor.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      clientProfile:
        actor.role === "CLIENT"
          ? { upsert: { create: { phone: parsed.data.phone || null }, update: { phone: parsed.data.phone || null } } }
          : undefined,
    },
  });
  if (actor.role === "CLIENT" && parsed.data.country) {
    await db.organization.updateMany({
      where: { members: { some: { userId: actor.id } } },
      data: { country: parsed.data.country },
    });
  }
}

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Please enter your current password.").max(128),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "The passwords do not match.",
  });

export async function changePassword(actor: Actor, input: z.input<typeof changePasswordSchema>) {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const user = await db.user.findUniqueOrThrow({ where: { id: actor.id } });
  if (!user.passwordHash) throw validation("Your account uses Google sign-in, so there is no password to change.");
  const valid = user.passwordHash && (await bcrypt.compare(parsed.data.currentPassword, user.passwordHash));
  if (!valid) throw validation("Your current password is incorrect.", { currentPassword: ["This password is incorrect."] });
  await db.user.update({ where: { id: actor.id }, data: { passwordHash: await hashPassword(parsed.data.newPassword) } });
}

export async function getAccount(actor: Actor) {
  const { passwordHash, accounts, ...user } = await db.user.findUniqueOrThrow({
    where: { id: actor.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      clientProfile: { select: { phone: true } },
      memberships: { select: { organization: { select: { id: true, name: true, country: true } } } },
      passwordHash: true,
      accounts: { select: { provider: true } },
    },
  });
  // Never return the hash itself — only whether password login is available.
  return { ...user, hasPassword: Boolean(passwordHash), providers: accounts.map((a) => a.provider) };
}

// ---------------------------------------------------------------------------
// OAuth sign-in (e.g. Google)
// ---------------------------------------------------------------------------

export interface OAuthProfile {
  provider: string;
  providerAccountId: string;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
}

/** Emails that become studio admins on their first verified Google sign-in (env ADMIN_EMAILS, comma-separated). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

async function recordLogin(userId: string, role: "ADMIN" | "CLIENT", name: string, provider: string) {
  await db.$transaction(async (tx) => {
    await tx.user.update({ where: { id: userId }, data: { lastLoginAt: new Date() } });
    await recordActivity(tx, {
      type: role === "ADMIN" ? "ADMIN_LOGIN" : "CLIENT_LOGIN",
      actorId: userId,
      visibility: "INTERNAL",
      message: `${name} logged in`,
      metadata: { provider },
    });
  });
}

/**
 * Signs a user in with an OAuth provider. Returns null when sign-in must be refused.
 *
 * 1. A known provider account signs in as its linked user.
 * 2. Otherwise the provider must have verified the email address. An existing
 *    user with that email gets the provider linked. For client accounts, any
 *    password is removed: passwords were set without email verification, so
 *    keeping one would let someone who registered this email first keep access.
 * 3. Otherwise a new client account is created (joining an invited
 *    organization from a converted lead when one exists).
 */
export async function signInWithOAuth(profile: OAuthProfile) {
  const email = profile.email.trim().toLowerCase();
  const linked = await db.account.findUnique({
    where: { provider_providerAccountId: { provider: profile.provider, providerAccountId: profile.providerAccountId } },
    include: { user: true },
  });
  const listedAdmin = profile.emailVerified && adminEmails().includes(email);

  if (linked) {
    let u = linked.user;
    if (listedAdmin && u.role !== "ADMIN" && u.email === email) u = await promoteToAdmin(u.id);
    await recordLogin(u.id, u.role, `${u.firstName} ${u.lastName}`, profile.provider);
    return { id: u.id, role: u.role, email: u.email };
  }

  if (!profile.emailVerified || !z.email().safeParse(email).success) return null;

  const firstName = profile.firstName.trim().slice(0, 60) || email.split("@")[0];
  const lastName = profile.lastName.trim().slice(0, 60);
  let welcome = false;

  const user = await db.$transaction(async (tx) => {
    const existing = await tx.user.findUnique({ where: { email } });
    if (existing) {
      await tx.account.create({
        data: { userId: existing.id, type: "oidc", provider: profile.provider, providerAccountId: profile.providerAccountId },
      });
      if (existing.role === "CLIENT" && existing.passwordHash) {
        await tx.user.update({ where: { id: existing.id }, data: { passwordHash: null } });
      }
      return existing;
    }

    if (listedAdmin) {
      // Studio accounts don't belong to a client organization.
      return tx.user.create({
        data: {
          email,
          firstName,
          lastName,
          role: "ADMIN",
          accounts: { create: { type: "oidc", provider: profile.provider, providerAccountId: profile.providerAccountId } },
        },
      });
    }

    const created = await tx.user.create({
      data: {
        email,
        firstName,
        lastName,
        role: "CLIENT",
        clientProfile: { create: {} },
        accounts: { create: { type: "oidc", provider: profile.provider, providerAccountId: profile.providerAccountId } },
      },
    });
    const invitedOrg = await tx.organization.findFirst({
      where: { inviteEmail: email, members: { none: {} } },
      orderBy: { createdAt: "desc" },
    });
    if (invitedOrg) {
      await tx.organizationMember.create({ data: { organizationId: invitedOrg.id, userId: created.id, role: "OWNER" } });
      await tx.organization.update({ where: { id: invitedOrg.id }, data: { inviteEmail: null } });
    } else {
      // The business is created from the questionnaire; until then the account is named after the person.
      await tx.organization.create({
        data: { name: `${firstName} ${lastName}`.trim(), members: { create: { userId: created.id, role: "OWNER" } } },
      });
    }
    await recordActivity(tx, {
      type: "USER_REGISTERED",
      actorId: created.id,
      visibility: "INTERNAL",
      message: `${firstName} ${lastName} created a client account`.replace(/\s+/g, " "),
      metadata: { provider: profile.provider },
    });
    await notifyAdmins(tx, {
      type: "USER_REGISTERED",
      title: "New client account",
      body: `${firstName} ${lastName} · signed up with ${profile.provider}`,
      href: "/admin/clients",
    });
    welcome = true;
    return created;
  });

  if (welcome) await sendEmail(emailTemplates.welcome(user.email, user.firstName));
  const final = listedAdmin && user.role !== "ADMIN" ? await promoteToAdmin(user.id) : user;
  await recordLogin(final.id, final.role, `${final.firstName} ${final.lastName}`, profile.provider);
  return { id: final.id, role: final.role, email: final.email };
}

/**
 * Promotes a user listed in ADMIN_EMAILS after Google verified the address.
 * Removes client organization memberships and any unverified password.
 */
async function promoteToAdmin(userId: string) {
  return db.$transaction(async (tx) => {
    await tx.organizationMember.deleteMany({ where: { userId } });
    const user = await tx.user.update({ where: { id: userId }, data: { role: "ADMIN", passwordHash: null } });
    await recordActivity(tx, {
      type: "PROJECT_UPDATED",
      actorId: userId,
      visibility: "INTERNAL",
      message: `${user.firstName} ${user.lastName} was granted studio admin access (ADMIN_EMAILS)`,
    });
    return user;
  });
}

/** Resolves the app user linked to a provider account (used when issuing the session token). */
export async function findOAuthUser(provider: string, providerAccountId: string) {
  const account = await db.account.findUnique({
    where: { provider_providerAccountId: { provider, providerAccountId } },
    select: { user: { select: { id: true, role: true } } },
  });
  return account?.user ?? null;
}
