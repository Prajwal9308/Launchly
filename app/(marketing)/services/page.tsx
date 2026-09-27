import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section } from "@/components/marketing/section";
import { ServiceGrid } from "@/components/marketing/service-grid";
import { listPublishedServices } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website design, development, landing pages, e-commerce, redesigns, SEO foundations, maintenance and content updates for small businesses.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await listPublishedServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Websites and support for growing businesses"
        description="Choose what you need now and add more later. Every project starts with understanding your business and your customers."
      />
      <Section>
        <ServiceGrid services={services} detailed />
      </Section>
      <CtaSection />
    </>
  );
}
