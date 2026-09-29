import type { Metadata } from "next";
import { Icons } from "@/components/ui/icons";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { WhyGrid } from "@/components/marketing/why-grid";
import { getSiteSettings } from "@/services/catalog";

export const metadata: Metadata = {
  title: "About",
  description:
    "CoreGravity helps small businesses and independent vendors in Canada and India build professional websites, online stores, booking systems and business applications.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  "Clear communication",
  "Practical solutions",
  "Professional execution",
  "Transparent scope and pricing",
  "Long-term maintainability",
  "Customer approval before launch",
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`About ${settings.businessName}`}
        description="A digital partner for small businesses, local businesses and independent vendors."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeader title="Practical digital solutions, built properly" />
          <div className="space-y-4 text-[17px] leading-relaxed text-muted">
            <p>
              {settings.businessName} helps small businesses and independent vendors build a stronger online presence and improve
              the way they operate.
            </p>
            <p>We design and develop professional websites, online stores, booking systems, business applications and mobile apps.</p>
            <p>
              Our approach is straightforward: understand the business, define the scope, communicate clearly and build carefully.
            </p>
            <p>We believe good technology should make your business easier to run — not harder.</p>
            <p>
              We work with businesses in Canada and India
              {settings.serviceArea ? `, including ${settings.serviceArea}` : ""}.
            </p>
            <h3 className="pt-4 text-base font-semibold text-heading">Our principles</h3>
            <ul className="grid gap-3 sm:grid-cols-2">
              {PRINCIPLES.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] text-foreground">
                  <Icons.success className="mt-1 shrink-0 text-accent" aria-hidden /> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section tone="muted">
        <SectionHeader eyebrow={`Why ${settings.businessName}`} title="Built around your business needs" />
        <div className="mt-12">
          <WhyGrid />
        </div>
      </Section>
      <CtaSection />
    </>
  );
}
