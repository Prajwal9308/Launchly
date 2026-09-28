"use client";

import { useFormAction } from "@/components/forms/use-form-action";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { changePasswordAction, updateProfileAction } from "@/server/actions/client";

export function ProfileForm({ firstName, lastName, phone, email, showPhone = true }: { firstName: string; lastName: string; phone: string; email: string; showPhone?: boolean }) {
  const { state, onSubmit, pending } = useFormAction(updateProfileAction);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormStatus state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="firstName" label="First name" error={fieldError(state, "firstName")}>
          {(p) => <Input {...p} name="firstName" defaultValue={firstName} autoComplete="given-name" required />}
        </Field>
        <Field id="lastName" label="Last name" error={fieldError(state, "lastName")}>
          {(p) => <Input {...p} name="lastName" defaultValue={lastName} autoComplete="family-name" required />}
        </Field>
      </div>
      <Field id="email" label="Email" hint="Contact us if you need to change the email you log in with.">
        {(p) => <Input {...p} value={email} disabled readOnly />}
      </Field>
      {showPhone && (
        <Field id="phone" label="Phone" optional error={fieldError(state, "phone")}>
          {(p) => <Input {...p} name="phone" type="tel" defaultValue={phone} autoComplete="tel" />}
        </Field>
      )}
      <SubmitButton pending={pending}>Save changes</SubmitButton>
    </form>
  );
}

export function PasswordForm() {
  const { state, onSubmit, pending } = useFormAction(changePasswordAction);
  return (
    <form onSubmit={onSubmit} className="space-y-4" key={state?.ok ? "reset" : "form"}>
      <FormStatus state={state} />
      <Field id="currentPassword" label="Current password" error={fieldError(state, "currentPassword")}>
        {(p) => <Input {...p} name="currentPassword" type="password" autoComplete="current-password" required />}
      </Field>
      <Field id="newPassword" label="New password" hint="At least 10 characters, including a letter and a number." error={fieldError(state, "newPassword")}>
        {(p) => <Input {...p} name="newPassword" type="password" autoComplete="new-password" required />}
      </Field>
      <Field id="confirmPassword" label="Confirm new password" error={fieldError(state, "confirmPassword")}>
        {(p) => <Input {...p} name="confirmPassword" type="password" autoComplete="new-password" required />}
      </Field>
      <SubmitButton pending={pending} variant="secondary">Change password</SubmitButton>
    </form>
  );
}
