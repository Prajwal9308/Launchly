import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section } from "@/components/marketing/section";
import { ServiceGrid } from "@/components/marketing/service-grid";
import { listPublishedServices } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, e-commerce, booking and appointment systems, business applications, mobile apps and UI/UX design for small businesses in Canada and India.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await listPublishedServices();
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Professional digital services for small businesses"
        description="From business websites and online stores to booking systems and custom applications, we build practical digital solutions around your business needs."
      />
      <Section>
        <ServiceGrid services={services} />
      </Section>
      <CtaSection />
    </>
  );
}
