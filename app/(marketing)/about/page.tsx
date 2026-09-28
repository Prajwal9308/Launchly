import type { Metadata } from "next";
import { Icons } from "@/components/ui/icons";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { WhyGrid } from "@/components/marketing/why-grid";
import { getSiteSettings } from "@/services/catalog";

export const metadata: Metadata = {
  title: "About",
  description: "ViperByte is a web and mobile app development studio helping businesses and entrepreneurs build practical digital products.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  "Plain language, clear scope and honest timelines.",
  "Products designed around real users and real business requirements.",
  "Clean, maintainable products that can grow with your business.",
  "Nothing goes live without your approval.",
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`About ${settings.businessName}`}
        description="A web and mobile app development studio for businesses and entrepreneurs."
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeader title="Practical digital products, built properly" />
          <div className="space-y-4 text-[17px] leading-relaxed text-muted">
            <p>
              {settings.businessName} designs and develops websites, web applications and mobile apps. We work with businesses
              that need a professional online presence, and with entrepreneurs who have an idea they want to turn into a real
              product.
            </p>
            <p>
              We&apos;re a new studio, and we&apos;d rather earn trust through how we work than through big claims: a clear
              scope before we start, direct communication with the people building your product, and careful execution.
            </p>
            {settings.serviceArea && <p>We work with clients in {settings.serviceArea}.</p>}
            <ul className="space-y-3 pt-4">
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
