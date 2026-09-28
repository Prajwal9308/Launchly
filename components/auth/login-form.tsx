"use client";

import { useFormAction } from "@/components/forms/use-form-action";
import { FormStatus } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/server/actions/public";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const { state, onSubmit, pending } = useFormAction(loginAction);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormStatus state={state} />
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      <Field id="email" label="Email">
        {(p) => <Input {...p} name="email" type="email" autoComplete="email" required autoFocus />}
      </Field>
      <Field id="password" label="Password">
        {(p) => <Input {...p} name="password" type="password" autoComplete="current-password" required />}
      </Field>
      <SubmitButton pending={pending} className="w-full" pendingText="Logging in…">
        Log in
      </SubmitButton>
    </form>
  );
}
