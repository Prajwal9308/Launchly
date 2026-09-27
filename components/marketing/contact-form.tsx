"use client";

import { useActionState } from "react";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { submitContactAction } from "@/server/actions/public";

export function ContactForm({ services }: { services: string[] }) {
  const [state, action] = useActionState(submitContactAction, null);

  if (state?.ok) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center shadow-card">
        <p className="text-base font-semibold">Message sent</p>
        <p className="mt-1.5 text-sm text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5 rounded-xl border border-border bg-background p-6 shadow-card sm:p-8" noValidate>
      <FormStatus state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" required error={fieldError(state, "name")}>
          {(p) => <Input {...p} name="name" autoComplete="name" required />}
        </Field>
        <Field id="businessName" label="Business" optional error={fieldError(state, "businessName")}>
          {(p) => <Input {...p} name="businessName" autoComplete="organization" />}
        </Field>
        <Field id="email" label="Email" required error={fieldError(state, "email")}>
          {(p) => <Input {...p} name="email" type="email" autoComplete="email" required />}
        </Field>
        <Field id="phone" label="Phone" optional error={fieldError(state, "phone")}>
          {(p) => <Input {...p} name="phone" type="tel" autoComplete="tel" />}
        </Field>
      </div>
      <Field id="service" label="Service" optional error={fieldError(state, "service")}>
        {(p) => (
          <Select {...p} name="service" defaultValue="">
            <option value="">Not sure yet</option>
            {services.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <Field id="message" label="Message" required hint="What does your business do, and what do you need help with?" error={fieldError(state, "message")}>
        {(p) => <Textarea {...p} name="message" rows={5} required />}
      </Field>
      {/* Honeypot field for bots — hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <SubmitButton className="w-full sm:w-auto" pendingText="Sending…">
        Send message
      </SubmitButton>
    </form>
  );
}
