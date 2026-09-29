import type { Metadata } from "next";
import Link from "next/link";
import { IconTile, Icons } from "@/components/ui/icons";
import type { LucideIcon } from "@/components/ui/icons";
import { SubmitButton } from "@/components/forms/submit-button";
import { Button } from "@/components/ui/button";
import { STEPS } from "@/domain/questionnaire";
import { findDraftProject } from "@/services/projects";
import { startProjectAction } from "@/server/actions/client";
import { getActor } from "@/server/session";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Complete the CoreGravity project questionnaire so we can understand your business, requirements and goals. Your progress is saved automatically.",
  alternates: { canonical: "/start-project" },
};

const STEP_ICONS: Record<string, LucideIcon> = {
  business: Icons.business,
  goals: Icons.goals,
  website: Icons.website,
  brand: Icons.design,
  content: Icons.document,
  inspiration: Icons.images,
  features: Icons.features,
  final: Icons.checklist,
  review: Icons.requirementsApproved,
};

export default async function StartProjectPage() {
  const actor = await getActor();
  const draft = actor ? await findDraftProject(actor) : null;

  return (
    <div className="relative isolate overflow-hidden border-b border-border bg-canvas">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-glow" />
      <div className="container-page grid gap-12 py-16 sm:py-20 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div>
          <p className="eyebrow">
            <Icons.requirements aria-hidden /> Project questionnaire
          </p>
          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Tell us about your business</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Complete the project questionnaire so we can understand your business, requirements and goals. Your progress is
            saved automatically, so you can return whenever you&apos;re ready.
          </p>
          <p className="mt-3 flex items-center gap-2 text-sm font-medium text-foreground">
            <Icons.time className="text-accent" aria-hidden /> Approximately 10 minutes
          </p>
          <p className="mt-3 max-w-xl text-sm text-muted">
            The questionnaire is designed for website projects. For an online store, booking system, business application or
            mobile app, you can also{" "}
            <Link href="/contact" className="font-medium text-accent hover:underline">
              send us an enquiry
            </Link>{" "}
            and we&apos;ll follow up with the right questions.
          </p>

          <div className="mt-8 max-w-md surface-raised rounded-2xl p-6 shadow-card">
            {!actor ? (
              <>
                <p className="text-sm font-semibold">Create a client account to get started</p>
                <p className="mt-1 text-sm text-muted">Your account keeps your answers, files, messages and approvals in one private place.</p>
                <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                  <Button asChild className="sm:flex-1">
                    <Link href="/signup?callbackUrl=/start-project">
                      <Icons.signup aria-hidden /> Create Account
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" className="sm:flex-1">
                    <Link href="/login?callbackUrl=/start-project">
                      <Icons.login aria-hidden /> Sign In
                    </Link>
                  </Button>
                </div>
              </>
            ) : actor.role === "ADMIN" ? (
              <>
                <p className="text-sm font-semibold">You&apos;re signed in with a studio account</p>
                <p className="mt-1 text-sm text-muted">
                  Project requests are started by clients. To create one for a prospective client, convert a lead in Admin.
                </p>
                <Button asChild variant="secondary" className="mt-5">
                  <Link href="/admin/leads">
                    <Icons.clients aria-hidden /> Go to Leads
                  </Link>
                </Button>
              </>
            ) : (
              <form action={startProjectAction}>
                <p className="text-sm font-semibold">{draft ? "Continue where you left off" : `Welcome, ${actor.firstName}`}</p>
                <p className="mt-1 text-sm text-muted">
                  {draft ? "Your answers so far have been saved." : "You can stop at any point and return later. Your progress is saved automatically."}
                </p>
                <SubmitButton className="mt-5" pendingText="Opening…">
                  {draft ? "Continue Questionnaire" : "Start a Project"} <Icons.forward aria-hidden />
                </SubmitButton>
              </form>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-wider text-faint">What we&apos;ll ask</h2>
          <ol className="surface mt-4 divide-y divide-border rounded-2xl">
            {STEPS.map((step) => {
              const Icon = STEP_ICONS[step.key] ?? Icons.checklist;
              return (
                <li key={step.key} className="flex gap-3 p-4">
                  <IconTile icon={Icon} />
                  <div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-sm text-muted">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
