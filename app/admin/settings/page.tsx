import type { Metadata } from "next";
import { PageHeader } from "@/components/app/page-header";
import { SettingsForm } from "@/components/admin/catalog-forms";
import { PasswordForm, ProfileForm } from "@/components/client/account-forms";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FormSection } from "@/components/ui/form-section";
import { getAIProvider } from "@/providers/ai";
import { getAccount } from "@/services/accounts";
import { getSiteSettings } from "@/services/catalog";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const actor = await requireAdminActor();
  const [settings, account] = await Promise.all([getSiteSettings(), getAccount(actor)]);
  const ai = getAIProvider();
  const integrations = [
    { name: "Email", value: `${process.env.EMAIL_PROVIDER ?? "console"}`, note: "The console provider logs emails instead of sending them." },
    { name: "File storage", value: `${process.env.STORAGE_PROVIDER ?? "local"}`, note: "Local disk storage, outside the public folder." },
    { name: "AI briefs", value: ai ? `${ai.name} (${ai.model})` : "Not configured", note: "Optional. The app works fully without AI." },
    { name: "Payments", value: "Coming soon", note: "Invoices and payments are planned for a later phase." },
  ];

  return (
    <div>
      <PageHeader title="Settings" />
      <Card>
        <CardContent className="divide-y divide-border">
          <FormSection title="Studio details" description="Shown across the public website.">
            <SettingsForm settings={settings} />
          </FormSection>
          <FormSection title="Integrations" description="Configured with environment variables (see .env.example).">
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
            <PasswordForm />
          </FormSection>
        </CardContent>
      </Card>
    </div>
  );
}
