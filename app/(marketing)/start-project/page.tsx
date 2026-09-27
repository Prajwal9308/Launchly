import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/domain/questionnaire";
import { findDraftProject } from "@/services/projects";
import { startProjectAction } from "@/server/actions/client";
import { getActor } from "@/server/session";

export const metadata: Metadata = {
  title: "Start Your Project",
  description: "Create an account and tell us about your business. Your answers are saved as you go.",
  alternates: { canonical: "/start-project" },
};

export default async function StartProjectPage() {
  const actor = await getActor();
  const draft = actor ? await findDraftProject(actor) : null;

  return (
    <div className="border-b border-border bg-canvas">
      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium text-accent">Start Your Project</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Tell us about your business</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            We&apos;ll use your answers to plan your website. The questionnaire takes about 10 minutes, you can upload your
            logo and files as you go, and your progress is saved automatically.
          </p>

          <div className="mt-8 max-w-md rounded-xl border border-border bg-background p-6 shadow-card">
            {!actor ? (
              <>
                <p className="text-sm font-semibold">Create an account to get started</p>
                <p className="mt-1 text-sm text-muted">Your account lets you save progress and track your project afterwards.</p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="flex-1">
                    <Link href="/signup?callbackUrl=/start-project">Create Account</Link>
                  </Button>
                  <Button asChild variant="secondary" className="flex-1">
                    <Link href="/login?callbackUrl=/start-project">Log In</Link>
                  </Button>
                </div>
              </>
            ) : actor.role === "ADMIN" ? (
              <>
                <p className="text-sm font-semibold">You&apos;re signed in as the studio</p>
                <p className="mt-1 text-sm text-muted">
                  Projects are started by clients. To create one for a prospect, convert a lead from the admin dashboard.
                </p>
                <Button asChild variant="secondary" className="mt-5">
                  <Link href="/admin/leads">Go to leads</Link>
                </Button>
              </>
            ) : (
              <form action={startProjectAction}>
                <p className="text-sm font-semibold">{draft ? "Continue where you left off" : `Welcome, ${actor.firstName}`}</p>
                <p className="mt-1 text-sm text-muted">
                  {draft ? "Your answers so far are saved." : "Ready when you are. You can stop at any point and come back later."}
                </p>
                <SubmitButton className="mt-5" pendingText="Opening…">
                  {draft ? "Continue questionnaire" : "Begin questionnaire"} <ArrowRight aria-hidden />
                </SubmitButton>
              </form>
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-faint">What we&apos;ll ask</p>
          <ol className="mt-4 space-y-3">
            {STEPS.map((step, i) => (
              <li key={step.key} className="flex gap-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-medium text-muted">
                  {step.key === "review" ? <Check className="size-3" aria-hidden /> : i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-sm text-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
