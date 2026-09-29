"use client";

import { useFormAction } from "@/components/forms/use-form-action";
import { FormStatus, fieldError } from "@/components/forms/form-status";
import { SubmitButton } from "@/components/forms/submit-button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { COUNTRIES, COUNTRY_INFO, SERVED_COUNTRIES_NOTE, type CountryCode } from "@/domain/country";
import { changePasswordAction, updateProfileAction } from "@/server/actions/client";

export function ProfileForm({
  firstName,
  lastName,
  phone,
  email,
  showPhone = true,
  country,
}: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  showPhone?: boolean;
  /** Clients only: their business's country, which sets their currency. Omit to hide the field. */
  country?: CountryCode | null;
}) {
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
      <Field id="email" label="Email address" hint="Please contact us if you need to change the email address you sign in with.">
        {(p) => <Input {...p} value={email} disabled readOnly />}
      </Field>
      {showPhone && (
        <Field id="phone" label="Phone" optional error={fieldError(state, "phone")}>
          {(p) => <Input {...p} name="phone" type="tel" defaultValue={phone} autoComplete="tel" />}
        </Field>
      )}
      {country !== undefined && (
        <Field id="country" label="Country" hint={`Sets the currency for your budgets and pricing. ${SERVED_COUNTRIES_NOTE}`} error={fieldError(state, "country")}>
          {(p) => (
            <Select {...p} name="country" defaultValue={country ?? ""} className="max-w-72">
              <option value="" disabled>
                Select your country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {COUNTRY_INFO[c].name} · {COUNTRY_INFO[c].currency}
                </option>
              ))}
            </Select>
          )}
        </Field>
      )}
      <SubmitButton pending={pending}>Save Changes</SubmitButton>
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
      <SubmitButton pending={pending} variant="secondary">Change Password</SubmitButton>
    </form>
  );
}
