"use client";

import Link from "next/link";
import { Select } from "@/components/ui/select";
import { COUNTRIES, COUNTRY_INFO, SERVED_COUNTRIES_NOTE, type CountryCode } from "@/domain/country";

import { useFormAction } from "@/components/forms/use-form-action";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/server/actions/public";

export function SignupForm({ callbackUrl, email, country }: { callbackUrl?: string; email?: string; country?: CountryCode | null }) {
  const { state, onSubmit, pending } = useFormAction(signupAction);
  const err = (name: string) => fieldError(state, name);
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormStatus state={state} />
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" required error={err("firstName")}>
          {(p) => <Input {...p} name="firstName" autoComplete="given-name" required autoFocus />}
        </Field>
        <Field id="lastName" label="Last name" required error={err("lastName")}>
          {(p) => <Input {...p} name="lastName" autoComplete="family-name" required />}
        </Field>
      </div>
      <Field id="email" label="Email address" required error={err("email")}>
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" defaultValue={email} required />}
      </Field>
      <Field id="businessName" label="Business name" required error={err("businessName")}>
        {(p) => <Input {...p} name="businessName" autoComplete="organization" required />}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="country" label="Country" required error={err("country")}>
          {(p) => (
            <Select {...p} name="country" defaultValue={country ?? ""} required>
              <option value="">Select your country</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {COUNTRY_INFO[c].name}
                </option>
              ))}
            </Select>
          )}
        </Field>
        <Field id="phone" label="Phone" optional error={err("phone")}>
          {(p) => <Input {...p} name="phone" type="tel" autoComplete="tel" />}
        </Field>
      </div>
      <p className="-mt-2 text-xs text-faint">{SERVED_COUNTRIES_NOTE}</p>
      <Field id="password" label="Password" required hint="At least 10 characters, including a letter and a number." error={err("password")}>
        {(p) => <Input {...p} name="password" type="password" autoComplete="new-password" required minLength={10} />}
      </Field>
      <SubmitButton pending={pending} className="w-full" pendingText="Creating account…">
        Create Account
      </SubmitButton>
      <p className="text-center text-xs leading-relaxed text-faint">
        By creating an account, you agree to the CoreGravity{" "}
        <Link href="/terms" className="underline hover:text-foreground">
          Terms of Use
        </Link>{" "}
        and acknowledge our{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}
