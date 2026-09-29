import { Icons } from "@/components/ui/icons";
import Link from "next/link";
import { ContactSection } from "@/components/marketing/contact-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { BrandCurve } from "@/components/marketing/brand-curve";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { Entrance } from "@/components/motion/entrance";
import { PortalPreview } from "@/components/marketing/mockups/compositions";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { Section, SectionHeader } from "@/components/marketing/section";
import { ServicesOverview } from "@/components/marketing/services-overview";
import { SolutionsOverview } from "@/components/marketing/what-we-build";
import { WhyGrid } from "@/components/marketing/why-grid";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/marketing/arrow-link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { getSiteSettings, listPublishedServices } from "@/services/catalog";
import { getVisitorCountry } from "@/server/country";

/** Operating principles, stated as facts about how we work — not badges. */
const PRINCIPLES = [
  { label: "Clear scope before development begins", icon: Icons.scope },
  { label: "Transparent, written pricing", icon: Icons.pricing },
  { label: "Direct communication throughout your project", icon: Icons.messages },
  { label: "Your approval before launch", icon: Icons.approved },
];

const ABOUT_POINTS = [
  { text: "Clear scope before development begins", icon: Icons.scope },
  { text: "Regular project updates", icon: Icons.notifications },
  { text: "Direct communication with our team", icon: Icons.messages },
  { text: "Files, messages and approvals in one place", icon: Icons.files },
  { text: "Your approval before launch", icon: Icons.approved },
];

export const metadata: Metadata = {
  title: { absolute: siteConfig.defaultTitle },
  description: siteConfig.defaultDescription,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const [services, settings, country] = await Promise.all([listPublishedServices(), getSiteSettings(), getVisitorCountry()]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-glow" />
        <div className="container-page grid gap-10 pb-14 pt-10 sm:gap-12 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:pb-24 lg:pt-20">
          <Entrance className="max-w-[35rem] lg:self-end">
            <p className="eyebrow">Digital solutions for small businesses</p>
            <h1 className="mt-4 text-[1.875rem] font-semibold leading-[1.15] sm:text-[2.5rem] sm:leading-[1.1] lg:text-[2.875rem]">
              Websites and digital solutions built for{" "}
              <span className="relative inline-block whitespace-nowrap text-accent">
                your business
                <BrandCurve className="absolute -bottom-[0.28em] left-0 h-[0.3em] w-[96%]" />
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-[17px]">
              Professional websites, online stores, booking systems and business applications for small businesses and independent
              vendors. We handle the process from planning and design to development and launch, with clear scope, transparent
              pricing and direct communication throughout the project.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a Project <Icons.forward aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </div>
          </Entrance>
          <div className="self-center lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <HeroVisual />
          </div>
          <ul
            aria-label="How we work with you"
            className="grid max-w-[35rem] animate-rise gap-3 border-t border-border pt-6 text-sm text-muted [animation-delay:300ms] lg:mt-9 lg:self-start"
          >
            {PRINCIPLES.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2.5">
                <Icon className="text-accent" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Services */}
      <Section id="services">
        <SectionHeader
          eyebrow="Services"
          title="Digital solutions for the way your business works"
          description="From a professional business website to a custom business application, we build practical solutions around your customers, services and day-to-day operations."
          action={{ href: "/services", label: "View all services" }}
        />
        <div className="mt-10 sm:mt-12">
          <ServicesOverview services={services} />
        </div>
      </Section>

      {/* Product showcase: the client portal is a real part of every project */}
      <Section id="about" tone="muted">
        <div className="grid items-center gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-16">
          <Reveal>
            <PortalPreview />
            <p className="mt-3 flex items-center gap-2 text-xs text-faint">
              <Icons.info aria-hidden /> A simplified view of the client portal, shown with a sample project.
            </p>
          </Reveal>
          <div>
            <SectionHeader
              eyebrow={`Working with ${settings.businessName}`}
              title="A clear process from planning to launch"
              description="Your project is managed through a private client portal where you can review requirements, exchange files, communicate with our team and approve designs and deliverables."
            />
            <Reveal>
              <ul className="mt-8 divide-y divide-border border-y border-border">
                {ABOUT_POINTS.map(({ text, icon: Icon }) => (
                  <li key={text} className="flex items-start gap-3.5 py-4 text-[15px] font-medium text-heading">
                    <Icon className="mt-0.5 text-accent" aria-hidden />
                    {text}
                  </li>
                ))}
              </ul>
              <ArrowLink href="/about" className="mt-6">
                About CoreGravity
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Solutions */}
      <Section id="solutions">
        <SectionHeader
          eyebrow="Solutions"
          title="Solutions for your business"
          description="Websites, online stores, booking systems, portals and tools that help small businesses attract customers and run day-to-day operations."
          action={{ href: "/solutions", label: "View all solutions" }}
        />
        <div className="mt-10 sm:mt-12">
          <SolutionsOverview />
        </div>
      </Section>

      {/* Process */}
      <Section id="process" tone="muted">
        <SectionHeader
          eyebrow="Process"
          title="A straightforward process from idea to launch"
          description="Five clear stages, with regular updates and your approval at the key decisions."
          action={{ href: "/process", label: "See our process" }}
        />
        <div className="mt-10 sm:mt-14">
          <ProcessSteps />
        </div>
      </Section>

      {/* Why */}
      <Section>
        <SectionHeader eyebrow={`Why ${settings.businessName}`} title="Built around your business needs" />
        <div className="mt-10 sm:mt-12">
          <WhyGrid />
        </div>
      </Section>

      <CtaSection href="#contact" />

      {/* Contact */}
      <Section id="contact" tone="muted" className="border-b-0">
        <ContactSection
          contactEmail={settings.contactEmail}
          country={country}
          budgetRanges={{ CA: settings.budgetRangesCa, IN: settings.budgetRangesIn }}
        />
      </Section>
    </>
  );
}
