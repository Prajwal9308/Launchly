import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { DemoWorkNotice, PortfolioCard } from "@/components/marketing/portfolio-card";
import { PageHero, Section } from "@/components/marketing/section";
import { listPublishedPortfolio } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Website concepts and projects for restaurants, trades, salons, dental practices and other local businesses.",
  alternates: { canonical: "/portfolio" },
};

export default async function PortfolioPage() {
  const items = await listPublishedPortfolio();
  return (
    <>
      <PageHero eyebrow="Portfolio" title="Our work" description="A look at the kind of websites we design and build.">
        {items.some((i) => i.isDemo) && <DemoWorkNotice />}
      </PageHero>
      <Section>
        {items.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <PortfolioCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">Portfolio projects will be added soon.</p>
        )}
      </Section>
      <CtaSection />
    </>
  );
}
