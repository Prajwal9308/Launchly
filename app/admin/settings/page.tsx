import { Icons } from "@/components/ui/icons";
import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { SettingsForm } from "@/components/admin/catalog-forms";
import { PasswordForm, ProfileForm } from "@/components/client/account-forms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FormSection } from "@/components/ui/form-section";
import { Alert } from "@/components/ui/alert";
import { getAIProvider } from "@/providers/ai";
import { googleEnabled } from "@/server/auth";
import { getAccount } from "@/services/accounts";
import { getSiteSettings } from "@/services/catalog";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const actor = await requireAdminActor();
  const [settings, account] = await Promise.all([getSiteSettings(), getAccount(actor)]);
  const ai = getAIProvider();
  const emailProvider = process.env.EMAIL_PROVIDER ?? "console";
  const storageProvider = process.env.STORAGE_PROVIDER ?? "local";
  const integrations = [
    {
      name: "Email",
      value: emailProvider,
      note: emailProvider === "console" ? "Emails are written to the server log and not sent." : "Transactional emails are sent through this provider.",
    },
    {
      name: "File storage",
      value: storageProvider,
      note: storageProvider === "local" ? "Files are stored on the server's local disk, outside the public folder." : "Files are stored with this provider.",
    },
    { name: "Google sign-in", value: googleEnabled ? "Enabled" : "Not configured", note: "Optional. Clients can always sign in with email and password." },
    {
      name: "AI briefs",
      value: ai ? `${ai.name} (${ai.model})` : "Not configured",
      note: "Optional. The Privacy Policy mentions AI processing only while this is configured.",
    },
    { name: "Payments", value: "Not configured", note: "Online payments are not available yet. Share invoices as project documents." },
  ];
  const legalMissing = [
    !settings.legalName && "legal business name",
    !settings.businessAddress && "business address",
    !settings.governingJurisdiction && "governing jurisdiction",
    !settings.legalEffectiveDate && "effective date",
  ].filter(Boolean) as string[];

  return (
    <div>
      <PageHeader icon={Icons.settings} title="Settings" />
      {legalMissing.length > 0 && (
        <Alert tone="warning" title="Legal details are incomplete" className="mb-6">
          Add the {legalMissing.join(", ")} before launch. Legal pages should also be reviewed by qualified legal counsel.
        </Alert>
      )}
      <Card>
        <CardContent className="divide-y divide-border">
          <FormSection title="Business settings" description="Business details, supported countries, budget ranges, tax wording and legal details.">
            <SettingsForm settings={settings} />
          </FormSection>
          <FormSection title="Integrations" description="Configured with environment variables (see .env.example). Only configured integrations are active.">
            <dl className="divide-y divide-border rounded-lg border border-border">
              {integrations.map((i) => (
                <div key={i.name} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <dt className="text-sm font-medium">{i.name}</dt>
                    <p className="text-xs text-faint">{i.note}</p>
                  </div>
                  <dd>
                    <Badge tone="outline">{i.value}</Badge>
                  </dd>
                </div>
              ))}
            </dl>
          </FormSection>
          <FormSection title="Your profile">
            <ProfileForm firstName={account.firstName} lastName={account.lastName} email={account.email} phone="" showPhone={false} />
          </FormSection>
          <FormSection title="Password">
            {account.hasPassword ? <PasswordForm /> : <p className="text-sm text-muted">You sign in with Google, so there is no password to manage here.</p>}
          </FormSection>
        </CardContent>
      </Card>
    </div>
  );
}
