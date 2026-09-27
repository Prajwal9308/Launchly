import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { PasswordForm, ProfileForm } from "@/components/client/account-forms";
import { Card, CardContent } from "@/components/ui/card";
import { FormSection } from "@/components/ui/form-section";
import { formatDate } from "@/lib/format";
import { getAccount } from "@/services/accounts";
import { requireClientActor } from "@/server/session";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const actor = await requireClientActor();
  const account = await getAccount(actor);
  return (
    <div>
      <PageHeader title="Account" description={`Member since ${formatDate(account.createdAt)}`} />
      <Card>
        <CardContent className="divide-y divide-border">
          <FormSection title="Profile" description="Your contact details for this project.">
            <ProfileForm firstName={account.firstName} lastName={account.lastName} email={account.email} phone={account.clientProfile?.phone ?? ""} />
          </FormSection>
          <FormSection title="Business" description="The business linked to your account.">
            <p className="text-sm">{account.memberships.map((m) => m.organization.name).join(", ") || "—"}</p>
          </FormSection>
          <FormSection title="Sign-in" description="How you log in to your account.">
            {account.providers.includes("google") && <p className="text-sm">Connected to Google ({account.email}).</p>}
            {account.hasPassword ? (
              <PasswordForm />
            ) : (
              <p className="text-sm text-muted">You sign in with Google, so there&apos;s no password to manage here.</p>
            )}
          </FormSection>
        </CardContent>
      </Card>
    </div>
  );
}
