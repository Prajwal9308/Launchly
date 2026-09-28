"use client";

import { useFormAction } from "@/components/forms/use-form-action";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/server/actions/public";

export function SignupForm({ callbackUrl, email }: { callbackUrl?: string; email?: string }) {
  const { state, onSubmit, pending } = useFormAction(signupAction);
  const err = (name: string) => fieldError(state, name);
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <FormStatus state={state} />
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={err("firstName")}>
          {(p) => <Input {...p} name="firstName" autoComplete="given-name" required autoFocus />}
        </Field>
        <Field id="lastName" label="Last name" error={err("lastName")}>
          {(p) => <Input {...p} name="lastName" autoComplete="family-name" required />}
        </Field>
      </div>
      <Field id="email" label="Email" error={err("email")}>
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" defaultValue={email} required />}
      </Field>
      <Field id="businessName" label="Business name" error={err("businessName")}>
        {(p) => <Input {...p} name="businessName" autoComplete="organization" required />}
      </Field>
      <Field id="phone" label="Phone" optional error={err("phone")}>
        {(p) => <Input {...p} name="phone" type="tel" autoComplete="tel" />}
      </Field>
      <Field id="password" label="Password" hint="At least 10 characters, including a letter and a number." error={err("password")}>
        {(p) => <Input {...p} name="password" type="password" autoComplete="new-password" required minLength={10} />}
      </Field>
      <SubmitButton pending={pending} className="w-full" pendingText="Creating account…">
        Create account
      </SubmitButton>
      <p className="text-center text-xs leading-relaxed text-faint">
        By creating an account you agree to our{" "}
        <a href="/terms" className="underline hover:text-foreground">
          terms
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-foreground">
          privacy policy
        </a>
        .
      </p>
    </form>
  );
}
