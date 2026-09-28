"use server";

import { AuthError } from "next-auth";
import { AppError } from "@/lib/errors";
import { safeRedirectPath } from "@/lib/utils";
import { rateLimits } from "@/providers/rate-limit";
import { registerClient } from "@/services/accounts";
import { createLead } from "@/services/leads";
import { runAction, type ActionResult } from "../action";
import { signIn, signOut } from "../auth";
import { clientIp } from "../request";

const text = (form: FormData, key: string) => String(form.get(key) ?? "");

export async function submitContactAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  return runAction(async () => {
    // Honeypot: real users never fill this hidden field.
    if (text(form, "website")) return;
    const limit = await rateLimits.contact().limit(`contact:${await clientIp()}`);
    if (!limit.success) throw new AppError("RATE_LIMITED", "Too many messages. Please try again later.");
    await createLead({
      name: text(form, "name"),
      businessName: text(form, "businessName"),
      email: text(form, "email"),
      phone: text(form, "phone"),
      service: text(form, "projectType"),
      budgetRange: text(form, "budgetRange"),
      message: text(form, "message"),
    });
  }, "Thanks — we've received your message and will get back to you soon.");
}

export async function signupAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const result = await runAction(async () => {
    const limit = await rateLimits.signup().limit(`signup:${await clientIp()}`);
    if (!limit.success) throw new AppError("RATE_LIMITED", "Too many sign-up attempts. Please try again later.");
    await registerClient({
      firstName: text(form, "firstName"),
      lastName: text(form, "lastName"),
      email: text(form, "email"),
      password: text(form, "password"),
      businessName: text(form, "businessName"),
      phone: text(form, "phone"),
    });
  });
  if (!result.ok) return result;

  // signIn throws a redirect on success, which Next.js handles.
  await signIn("credentials", {
    email: text(form, "email").trim().toLowerCase(),
    password: text(form, "password"),
    redirectTo: safeRedirectPath(text(form, "callbackUrl"), "/dashboard"),
  });
  return { ok: true };
}

export async function loginAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  try {
    await signIn("credentials", {
      email: text(form, "email"),
      password: text(form, "password"),
      redirectTo: safeRedirectPath(text(form, "callbackUrl"), "/post-login"),
    });
    return { ok: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Incorrect email or password, or too many attempts. Please try again." };
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

export async function googleSignInAction(form: FormData) {
  await signIn("google", { redirectTo: safeRedirectPath(text(form, "callbackUrl"), "/post-login") });
}
