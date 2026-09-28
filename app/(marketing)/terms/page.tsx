import type { Metadata } from "next";
import { PageHero, Section } from "@/components/marketing/section";
import { LegalBody } from "@/components/marketing/legal-body";
import { isPlaceholderEmail } from "@/lib/site";
import { getSiteSettings } from "@/services/catalog";
import Link from "next/link";

export const metadata: Metadata = { title: "Terms", description: "The terms that apply when you use the PrimeTechLabs website and client portal.", alternates: { canonical: "/terms" } };

export default async function TermsPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero eyebrow="Legal" eyebrowIcon="scale" title="Terms of use" description="The terms that apply when you use this website and our client portal." />
      <Section>
        <LegalBody>
          <p className="rounded-lg border border-warning-border bg-warning-subtle p-4 text-sm text-foreground">
            <strong>Draft notice:</strong> These terms are a starting template and have not been reviewed by a lawyer.
          </p>
          <h2>Using this website</h2>
          <p>
            This website and client portal are provided by {settings.businessName} to share information about our services and
            to manage client projects.
          </p>
          <h2>Client accounts</h2>
          <p>
            You are responsible for keeping your login details secure and for the accuracy of the information and files you
            provide. Only upload content you have the right to use.
          </p>
          <h2>Project agreements</h2>
          <p>
            Scope, pricing, timelines, payment terms and ownership for each project are set out in a separate project
            agreement.
          </p>
          <h2>Limitation of liability</h2>
          <p>[Placeholder: to be drafted with legal advice.]</p>
          <h2>Contact</h2>
          <p>
            Questions about these terms:{" "}
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
