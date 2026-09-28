"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { useFormAction } from "@/components/forms/use-form-action";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BUDGET_RANGES, PROJECT_TYPES } from "@/content/faq";
import { submitContactAction } from "@/server/actions/public";

/** Project inquiry form. Submissions become leads in the admin. */
export function ContactForm() {
  const { state, onSubmit, pending } = useFormAction(submitContactAction);

  if (state?.ok) {
    return (
      <div className="surface-raised flex flex-col items-center rounded-2xl p-10 text-center" role="status">
        <CheckCircle2 className="size-8 text-success" aria-hidden />
        <p className="mt-4 text-lg font-semibold">Thanks — we&apos;ve received your project details.</p>
        <p className="mt-1.5 max-w-sm text-sm text-muted">We&apos;ll review them and get back to you by email with next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-raised space-y-5 rounded-2xl p-5 sm:p-8" noValidate aria-label="Project inquiry">
      <FormStatus state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" required error={fieldError(state, "name")}>
          {(p) => <Input {...p} name="name" autoComplete="name" required />}
        </Field>
        <Field id="email" label="Email" required error={fieldError(state, "email")}>
          {(p) => <Input {...p} name="email" type="email" autoComplete="email" required />}
        </Field>
      </div>
      <Field id="businessName" label="Company / Business" optional error={fieldError(state, "businessName")}>
        {(p) => <Input {...p} name="businessName" autoComplete="organization" />}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="projectType" label="Project type" error={fieldError(state, "service")}>
          {(p) => (
            <Select {...p} name="projectType" defaultValue="">
              <option value="">Select a project type</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="budgetRange" label="Budget range" optional error={fieldError(state, "budgetRange")}>
          {(p) => (
            <Select {...p} name="budgetRange" defaultValue="">
              <option value="">Prefer not to say</option>
              {BUDGET_RANGES.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </Select>
          )}
        </Field>
      </div>
      <Field id="message" label="Project details" required hint="What would you like to build, and who is it for?" error={fieldError(state, "message")}>
        {(p) => <Textarea {...p} name="message" rows={5} required placeholder="e.g. A booking app for our clinic, so patients can schedule and pay online." />}
      </Field>
      {/* Honeypot field for bots — hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <SubmitButton pending={pending} className="w-full sm:w-auto" pendingText="Sending…">
        Send project details
      </SubmitButton>
      <p className="text-xs text-faint">
        We only use these details to reply to your enquiry. See our{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
