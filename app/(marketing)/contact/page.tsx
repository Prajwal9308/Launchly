import type { Metadata } from "next";
import { ContactSection } from "@/components/marketing/contact-section";
import { PageHero, Section } from "@/components/marketing/section";
import { getSiteSettings } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about the website, web application or mobile app you want to build. We'll reply with next steps.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero eyebrow="Contact" eyebrowIcon="mail" title="Start a project" description="Share a few details about what you want to build. There's no obligation — we'll reply with next steps." />
      <Section>
        <ContactSection contactEmail={settings.contactEmail} heading={false} />
      </Section>
    </>
  );
}
