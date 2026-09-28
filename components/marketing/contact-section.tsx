import { Mail } from "lucide-react";
import Link from "next/link";
import { ContactForm } from "./contact-form";

const NEXT_STEPS = [
  "We read your project details and reply by email, usually with a few questions.",
  "We agree on scope, timeline and cost in writing before any work starts.",
  "Once we begin, you follow updates, share files and review designs in your project portal.",
];

/** Contact block used on the homepage and the Contact page. */
export function ContactSection({ contactEmail, heading = true }: { contactEmail: string; heading?: boolean }) {
  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
      <div>
        {heading && (
          <>
            <p className="text-sm font-semibold text-accent">Contact</p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.15] sm:text-4xl">Start a project</h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Share a few details about what you want to build. There&apos;s no obligation — we&apos;ll reply with next steps.
            </p>
          </>
        )}
        <h3 className="mt-10 text-sm font-semibold">What happens next</h3>
        <ol className="mt-4 space-y-4">
          {NEXT_STEPS.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-background font-mono text-[11px] text-foreground">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
        <div className="mt-10 space-y-2 text-sm">
          <a href={`mailto:${contactEmail}`} className="inline-flex items-center gap-2 text-muted hover:text-foreground">
            <Mail className="size-4 text-faint" aria-hidden /> {contactEmail}
          </a>
          <p className="text-muted">
            Prefer a detailed brief?{" "}
            <Link href="/start-project" className="font-medium text-accent hover:underline">
              Use the project questionnaire
            </Link>
            .
          </p>
        </div>
      </div>
      <ContactForm />
    </div>
  );
}
