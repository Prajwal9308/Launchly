import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section } from "@/components/marketing/section";
import { WhatWeBuild } from "@/components/marketing/what-we-build";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Business websites, online stores, booking and appointment systems, business applications, customer portals and business automation for small businesses and independent vendors.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Solutions for your business"
        description="Digital solutions designed to help small businesses attract customers, manage operations and deliver a better customer experience."
      />
      <Section>
        <WhatWeBuild />
        <p className="mt-8 text-sm text-muted">
          Not sure what you need? Tell us about your business and we&apos;ll help you identify the right approach.
        </p>
      </Section>
      <CtaSection />
    </>
  );
}
