import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { FAQS } from "@/content/faq";
import { listPublishedPricing } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Project types and what they include. Every proposal is confirmed in writing after reviewing your requirements.",
  alternates: { canonical: "/pricing" },
};

export default async function PricingPage() {
  const packages = await listPublishedPricing();
  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Project types"
        description="Use these as a starting point. We'll confirm scope and price once we've reviewed your project details."
      />
      <Section>
        <PricingCards packages={packages} />
      </Section>
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeader title="Pricing questions" />
          <FaqList items={FAQS.filter((f) => /cost|long|content|after launch/i.test(f.question))} />
        </div>
      </Section>
      <CtaSection />
    </>
  );
}
