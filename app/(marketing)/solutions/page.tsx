import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section } from "@/components/marketing/section";
import { WhatWeBuild } from "@/components/marketing/what-we-build";

export const metadata: Metadata = {
  title: "Solutions",
  description: "Business websites, web applications, iOS and Android apps and e-commerce stores, designed and built by ViperByte for businesses and entrepreneurs.",
  alternates: { canonical: "/solutions" },
};

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="What we build"
        description="Websites, web applications and mobile apps for businesses and entrepreneurs. Here are the kinds of products we design and develop."
      />
      <Section>
        <WhatWeBuild detailed />
        <p className="mt-8 text-sm text-muted">
          Not sure which category your idea fits? Describe it in plain language on the contact form and we&apos;ll help you work out the right approach.
        </p>
      </Section>
      <CtaSection />
    </>
  );
}
