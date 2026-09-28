import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/marketing/cta-section";
import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { PageHero, Section } from "@/components/marketing/section";
import { listPublishedPortfolio } from "@/services/catalog";

export const metadata: Metadata = { title: "Recent projects", alternates: { canonical: "/portfolio" } };

/**
 * Only real, delivered projects are ever shown. Until at least one exists
 * (published and not marked as a sample), this page does not exist.
 */
export default async function PortfolioPage() {
  const items = (await listPublishedPortfolio()).filter((item) => !item.isDemo);
  if (!items.length) notFound();
  return (
    <>
      <PageHero eyebrow="Work" eyebrowIcon="briefcase" title="Recent projects" />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <PortfolioCard key={item.id} item={item} />
          ))}
        </div>
      </Section>
      <CtaSection />
    </>
  );
}
