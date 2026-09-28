import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section } from "@/components/marketing/section";
import { ServiceGrid } from "@/components/marketing/service-grid";
import { listPublishedServices } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Services",
  description: "Web development, mobile app development for iOS and Android, UI/UX design, e-commerce and custom business software.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await listPublishedServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Web and mobile development, end to end"
        description="Design, development and launch for websites, web applications and mobile apps — scoped around what your business actually needs."
      />
      <Section>
        <ServiceGrid services={services} />
      </Section>
      <CtaSection />
    </>
  );
}
