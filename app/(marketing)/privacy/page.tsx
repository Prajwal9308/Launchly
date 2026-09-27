import type { Metadata } from "next";
import { PageHero, Section } from "@/components/marketing/section";
import { LegalBody } from "@/components/marketing/legal-body";
import { getSiteSettings } from "@/services/catalog";

export const metadata: Metadata = { title: "Privacy", description: "How we handle your information.", alternates: { canonical: "/privacy" } };

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero title="Privacy policy" description="Placeholder policy — to be reviewed by a qualified legal professional before use." />
      <Section>
        <LegalBody>
          <p className="rounded-lg border border-warning-border bg-warning-subtle p-4 text-sm text-foreground">
            <strong>Draft notice:</strong> This page is a starting template. It has not been reviewed by a lawyer and may not
            meet the legal requirements that apply to your business or location.
          </p>
          <h2>Information we collect</h2>
          <p>
            When you contact us or create an account, we collect the information you provide, such as your name, email
            address, phone number, business details, project questionnaire answers and files you upload.
          </p>
          <h2>How we use it</h2>
          <p>
            We use your information to respond to enquiries, deliver your website project, communicate with you about your
            project, and operate the client portal. We do not sell your personal information.
          </p>
          <h2>Files and project data</h2>
          <p>
            Files and project information are stored securely and are only accessible to you and to us. You can ask us to
            delete your project data at any time, subject to any records we are required to keep.
          </p>
          <h2>Service providers</h2>
          <p>[Placeholder: list hosting, storage, email and analytics providers used to operate this service.]</p>
          <h2>Your rights</h2>
          <p>[Placeholder: describe access, correction and deletion rights applicable in your jurisdiction.]</p>
          <h2>Contact</h2>
          <p>
            Questions about this policy: <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>.
          </p>
        </LegalBody>
      </Section>
    </>
  );
}
