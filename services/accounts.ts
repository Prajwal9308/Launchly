import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/db";
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
  .min(10, "Use at least 10 characters.")
  .max(128, "Use 128 characters or fewer.")
  .refine((v) => /[a-zA-Z]/.test(v) && /\d/.test(v), "Include at least one letter and one number.");

const phoneSchema = z
  .string()
  .trim()
  .max(40)
  .refine((v) => !v || /^[+()\-.\s\d]{7,}$/.test(v), "Please enter a valid phone number.");

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required.").max(60),
  lastName: z.string().trim().min(1, "Last name is required.").max(60),
  email: z.email("Please enter a valid email address.").trim().toLowerCase().max(254),
  password: passwordSchema,
  businessName: z.string().trim().min(1, "Business name is required.").max(120),
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
  if (existing) throw conflict("An account with this email already exists. Try logging in instead.");

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
      await tx.organization.update({ where: { id: invitedOrg.id }, data: { inviteEmail: null } });
    } else {
      await tx.organization.create({
        data: {
          name: data.businessName,
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
  firstName: z.string().trim().min(1, "First name is required.").max(60),
  lastName: z.string().trim().min(1, "Last name is required.").max(60),
  phone: phoneSchema.optional().default(""),
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
}

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password.").max(128),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export async function changePassword(actor: Actor, input: z.input<typeof changePasswordSchema>) {
  const parsed = changePasswordSchema.safeParse(input);
  if (!parsed.success) throw validation(undefined, fieldErrorsOf(parsed.error));
  const user = await db.user.findUniqueOrThrow({ where: { id: actor.id } });
  const valid = user.passwordHash && (await bcrypt.compare(parsed.data.currentPassword, user.passwordHash));
  if (!valid) throw validation("Your current password is incorrect.", { currentPassword: ["Incorrect password."] });
  await db.user.update({ where: { id: actor.id }, data: { passwordHash: await hashPassword(parsed.data.newPassword) } });
}

export async function getAccount(actor: Actor) {
  return db.user.findUniqueOrThrow({
    where: { id: actor.id },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
      clientProfile: { select: { phone: true } },
      memberships: { select: { organization: { select: { id: true, name: true } } } },
    },
  });
}
