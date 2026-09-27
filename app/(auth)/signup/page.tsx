import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth/signup-form";
import { safeRedirectPath } from "@/lib/utils";
import { getActor } from "@/server/session";

export const metadata: Metadata = { title: "Create account", robots: { index: false } };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; email?: string }> }) {
  const { callbackUrl, email } = await searchParams;
  const safeCallback = callbackUrl ? safeRedirectPath(callbackUrl) : undefined;
  if (await getActor()) redirect(safeCallback ?? "/dashboard");

  return (
    <div className="w-full max-w-md py-6">
      <div className="rounded-xl border border-border bg-background p-6 shadow-card sm:p-8">
        <h1 className="text-xl font-semibold">Create your client account</h1>
        <p className="mt-1 text-sm text-muted">Start your project and track its progress in one place.</p>
        <div className="mt-6">
          <SignupForm callbackUrl={safeCallback} email={typeof email === "string" ? email.slice(0, 254) : undefined} />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href={`/login${safeCallback ? `?callbackUrl=${encodeURIComponent(safeCallback)}` : ""}`} className="font-medium text-accent hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
