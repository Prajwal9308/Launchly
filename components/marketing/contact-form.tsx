"use client";

import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { useState } from "react";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { useFormAction } from "@/components/forms/use-form-action";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PROJECT_TYPES } from "@/content/faq";
import { COUNTRIES, COUNTRY_INFO, isCountry, SERVED_COUNTRIES_NOTE, type CountryCode } from "@/domain/country";
import { submitContactAction } from "@/server/actions/public";

/** Project enquiry form. Submissions become leads in the admin. */
export function ContactForm({
  defaultCountry,
  budgetRanges,
}: {
  defaultCountry: CountryCode | null;
  budgetRanges: Record<CountryCode, string[]>;
}) {
  const { state, onSubmit, pending } = useFormAction(submitContactAction);
  const [country, setCountry] = useState<CountryCode | "">(defaultCountry ?? "");

  if (state?.ok) {
    return (
      <div className="surface-raised flex flex-col items-center rounded-2xl p-10 text-center" role="status">
        <Icons.success className="size-6 text-success" aria-hidden />
        <p className="mt-4 text-lg font-semibold">Thank you. We&apos;ve received your enquiry.</p>
        <p className="mt-1.5 max-w-sm text-sm text-muted">We&apos;ll review your requirements and contact you with the next steps.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="surface-raised space-y-5 rounded-2xl p-5 sm:p-8" noValidate aria-label="Project enquiry">
      <FormStatus state={state} />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Full name" required error={fieldError(state, "name")}>
          {(p) => <Input {...p} name="name" autoComplete="name" required />}
        </Field>
        <Field id="businessName" label="Business name" required error={fieldError(state, "businessName")}>
          {(p) => <Input {...p} name="businessName" autoComplete="organization" required />}
        </Field>
        <Field id="email" label="Email address" required error={fieldError(state, "email")}>
          {(p) => <Input {...p} name="email" type="email" autoComplete="email" required />}
        </Field>
        <Field id="phone" label="Phone number" optional error={fieldError(state, "phone")}>
          {(p) => <Input {...p} name="phone" type="tel" autoComplete="tel" />}
        </Field>
      </div>
      <Field id="country" label="Country" required hint={SERVED_COUNTRIES_NOTE} error={fieldError(state, "country")}>
        {(p) => (
          <Select
            {...p}
            name="country"
            required
            value={country}
            onChange={(e) => setCountry(isCountry(e.target.value) ? e.target.value : "")}
            className="sm:max-w-[calc(50%-0.625rem)]"
          >
            <option value="">Select your country</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {COUNTRY_INFO[c].name}
              </option>
            ))}
          </Select>
        )}
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="projectType" label="What are you looking for?" optional error={fieldError(state, "service")}>
          {(p) => (
            <Select {...p} name="projectType" defaultValue="">
              <option value="">Select an option</option>
              {PROJECT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field
          id="budgetRange"
          label="Estimated budget"
          optional
          hint={country ? "Shown in your country's currency." : "Select your country to see budget ranges in your currency."}
          error={fieldError(state, "budgetRange")}
        >
          {(p) => (
            <Select {...p} key={country || "none"} name="budgetRange" defaultValue="" disabled={!country}>
              <option value="">Prefer not to say</option>
              {country &&
                budgetRanges[country].map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
            </Select>
          )}
        </Field>
      </div>
      <Field id="message" label="Project requirements" required error={fieldError(state, "message")}>
        {(p) => (
          <Textarea
            {...p}
            name="message"
            rows={5}
            required
            placeholder="Tell us about your business, what you need and what you would like the solution to accomplish."
          />
        )}
      </Field>
      {/* Honeypot field for bots — hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <SubmitButton pending={pending} className="w-full sm:w-auto" pendingText="Submitting…">
        Submit Enquiry <Icons.send aria-hidden />
      </SubmitButton>
      <p className="text-xs text-faint">
        We use the information you provide to respond to your enquiry and provide our services. See our{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>{" "}
        for details.
      </p>
    </form>
  );
}
