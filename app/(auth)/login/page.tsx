import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { safeRedirectPath } from "@/lib/utils";
import { getActor } from "@/server/session";

export const metadata: Metadata = { title: "Log in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const { callbackUrl } = await searchParams;
  const safeCallback = callbackUrl ? safeRedirectPath(callbackUrl) : undefined;
  const actor = await getActor();
  if (actor) redirect(safeCallback ?? (actor.role === "ADMIN" ? "/admin" : "/dashboard"));

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-border bg-background p-6 shadow-card sm:p-8">
        <h1 className="text-xl font-semibold">Log in</h1>
        <p className="mt-1 text-sm text-muted">Access your project dashboard.</p>
        <div className="mt-6">
          <LoginForm callbackUrl={safeCallback} />
        </div>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        New here?{" "}
        <Link href={`/signup${safeCallback ? `?callbackUrl=${encodeURIComponent(safeCallback)}` : ""}`} className="font-medium text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
