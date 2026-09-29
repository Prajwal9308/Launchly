import type { Metadata } from "next";
import { CountrySelect } from "@/components/marketing/country-select";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { FAQS } from "@/content/faq";
import { SERVED_COUNTRIES_NOTE } from "@/domain/country";
import { getSiteSettings, listPublishedPricing, taxNoteFor } from "@/services/catalog";
import { getVisitorCountry } from "@/server/country";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Starting prices for small business websites, online stores, booking systems, business applications and mobile apps, shown in your country's currency. Every project receives a written proposal.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const [packages, settings, country] = await Promise.all([listPublishedPricing(), getSiteSettings(), getVisitorCountry()]);
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Clear pricing for your project"
        description="Every project is different. After reviewing your requirements, we provide a written proposal with the scope, timeline, pricing and payment terms before development begins."
      >
        <div className="flex max-w-md flex-col gap-2">
          <CountrySelect country={country} showLabel className="max-w-64" />
          <p className="text-sm text-muted">
            {country
              ? `Prices are shown in the currency of the country you select. ${SERVED_COUNTRIES_NOTE}`
              : `Select your country to see prices in your currency. ${SERVED_COUNTRIES_NOTE}`}
          </p>
        </div>
      </PageHero>
      <Section>
        <PricingCards packages={packages} country={country} taxNote={country ? taxNoteFor(settings, country) : ""} />
        <p className="mt-8 max-w-3xl text-sm text-muted">
          Published prices are starting prices. Your final price depends on your requirements and is confirmed in your written
          proposal and Project Agreement before any work begins.
        </p>
      </Section>
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeader eyebrow="FAQ" title="Pricing questions" />
          <FaqList items={FAQS.filter((f) => /cost|long|ongoing support|countries/i.test(f.question))} />
        </div>
      </Section>
      <CtaSection />
    </>
  );
}
