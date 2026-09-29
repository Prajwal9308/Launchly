import type { Metadata } from "next";
import { ContactSection } from "@/components/marketing/contact-section";
import { PageHero, Section } from "@/components/marketing/section";
import { getSiteSettings } from "@/services/catalog";
import { getVisitorCountry } from "@/server/country";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell us about your business and the website, online store, booking system or business application you need. We'll review your request and contact you with the next steps.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [settings, country] = await Promise.all([getSiteSettings(), getVisitorCountry()]);
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Tell us about your business"
        description="Share a few details about what you need. We'll review your request and contact you with the appropriate next steps."
      />
      <Section>
        <ContactSection
          contactEmail={settings.contactEmail}
          heading={false}
          country={country}
          budgetRanges={{ CA: settings.budgetRangesCa, IN: settings.budgetRangesIn }}
        />
      </Section>
    </>
  );
}
