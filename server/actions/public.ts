"use server";

import { AuthError } from "next-auth";
import { cookies } from "next/headers";
import { COUNTRY_COOKIE, isCountry } from "@/domain/country";
import { AppError } from "@/lib/errors";
import { safeRedirectPath } from "@/lib/utils";
import { rateLimits } from "@/providers/rate-limit";
import { registerClient } from "@/services/accounts";
import { createLead } from "@/services/leads";
import { runAction, type ActionResult } from "../action";
import { signIn, signOut } from "../auth";
import { clientIp } from "../request";

const text = (form: FormData, key: string) => String(form.get(key) ?? "");

const TOO_MANY_REQUESTS = "Too many requests were submitted in a short period. Please wait a moment and try again.";

/** Saves the visitor's country choice. A manual choice always overrides detection. */
export async function setCountryAction(country: string): Promise<ActionResult> {
  return runAction(async () => {
    if (!isCountry(country)) throw new AppError("VALIDATION", "CoreGravity currently serves customers in Canada and India.");
    (await cookies()).set(COUNTRY_COOKIE, country, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: true });
  });
}

export async function submitContactAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  return runAction(async () => {
    // Honeypot: real users never fill this hidden field.
    if (text(form, "website")) return;
    const limit = await rateLimits.contact().limit(`contact:${await clientIp()}`);
    if (!limit.success) throw new AppError("RATE_LIMITED", TOO_MANY_REQUESTS);
    await createLead({
      name: text(form, "name"),
      businessName: text(form, "businessName"),
      email: text(form, "email"),
      phone: text(form, "phone"),
      country: text(form, "country") as never,
      service: text(form, "projectType"),
      budgetRange: text(form, "budgetRange"),
      message: text(form, "message"),
    });
  }, "Thank you. Your enquiry has been submitted.");
}

export async function signupAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const result = await runAction(async () => {
    const limit = await rateLimits.signup().limit(`signup:${await clientIp()}`);
    if (!limit.success) throw new AppError("RATE_LIMITED", TOO_MANY_REQUESTS);
    await registerClient({
      firstName: text(form, "firstName"),
      lastName: text(form, "lastName"),
      email: text(form, "email"),
      password: text(form, "password"),
      businessName: text(form, "businessName"),
      country: text(form, "country") as never,
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
      return { ok: false, error: "The email address or password is incorrect, or there have been too many attempts. Please try again." };
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
