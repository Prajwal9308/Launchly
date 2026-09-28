import type { Metadata } from "next";
import { PageHero, Section } from "@/components/marketing/section";
import { LegalBody } from "@/components/marketing/legal-body";
import { isPlaceholderEmail } from "@/lib/site";
import { getSiteSettings } from "@/services/catalog";
import Link from "next/link";

export const metadata: Metadata = { title: "Privacy", description: "How PrimeTechLabs collects, uses and protects your information.", alternates: { canonical: "/privacy" } };

export default async function PrivacyPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero eyebrow="Legal" eyebrowIcon="shield-check" title="Privacy policy" description="How we collect, use and protect your information." />
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
            We use your information to respond to enquiries, deliver your project, communicate with you about your
            project, and operate the client portal. We do not sell your personal information.
          </p>
          <h2>Files and project data</h2>
          <p>
            Files and project information are stored securely and are only accessible to you and to us. You can ask us to
            delete your project data at any time, subject to any records we are required to keep.
          </p>
          <h2>Service providers</h2>
          <p>
            We use a small number of providers to run this website and client portal: Vercel for hosting and file storage, a
            managed PostgreSQL database host, Resend for email notifications and Google for optional sign-in. When enabled, we
            use Anthropic&apos;s AI service to help summarise questionnaire answers into a project brief. These providers
            process your information only to provide their services to us.
          </p>
          <h2>Your rights</h2>
          <p>[Placeholder: describe access, correction and deletion rights applicable in your jurisdiction.]</p>
          <h2>Contact</h2>
          <p>
            Questions about this policy:{" "}
            {isPlaceholderEmail(settings.contactEmail) ? (
              <Link href="/contact">use our contact form</Link>
            ) : (
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            )}
            .
          </p>
        </LegalBody>
      </Section>
    </>
  );
}
