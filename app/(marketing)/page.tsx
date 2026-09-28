import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { ContactSection } from "@/components/marketing/contact-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { Section, SectionHeader } from "@/components/marketing/section";
import { ServicesOverview } from "@/components/marketing/services-overview";
import { WhatWeBuild } from "@/components/marketing/what-we-build";
import { WhyGrid } from "@/components/marketing/why-grid";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/marketing/arrow-link";
import { Button } from "@/components/ui/button";
import { getSiteSettings, listPublishedServices } from "@/services/catalog";

const HERO_POINTS = ["Written scope", "Direct communication", "Your approval before launch"];

const ABOUT_POINTS = [
  "You talk directly to the people designing and building your product.",
  "Scope, timeline and cost are agreed in writing before work begins.",
  "Web and mobile under one roof, so your product works across platforms.",
];

export default async function HomePage() {
  const [services, settings] = await Promise.all([listPublishedServices(), getSiteSettings()]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:linear-gradient(to_bottom,black_20%,transparent)]"
        />
        <div className="container-page grid items-center gap-12 pb-16 pt-12 sm:gap-14 sm:pb-20 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:pb-24 lg:pt-24">
          <div className="max-w-xl animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted shadow-xs">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Web &amp; mobile app development studio
            </p>
            <h1 className="mt-5 text-[2.25rem] font-semibold leading-[1.06] sm:mt-6 sm:text-5xl sm:leading-[1.04] lg:text-[3.5rem]">
              Websites and mobile apps, built for your business.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
              {settings.businessName} designs and builds websites, web applications and iOS &amp; Android apps for businesses
              and entrepreneurs — with a clear plan, honest communication and clean, maintainable code.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a Project <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2 text-sm text-muted sm:flex sm:flex-wrap sm:gap-x-5">
              {HERO_POINTS.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 shrink-0 text-accent" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-rise [animation-delay:100ms]">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Services */}
      <Section id="services">
        <SectionHeader
          eyebrow="Services"
          title="What we do"
          description="From a first website to a custom app, we design and build around how your business actually works."
          action={{ href: "/services", label: "All services" }}
        />
        <div className="mt-10 sm:mt-12">
          <ServicesOverview services={services} />
        </div>
      </Section>

      {/* What We Build */}
      <Section id="what-we-build" tone="muted">
        <SectionHeader
          eyebrow="What We Build"
          title="Websites, web apps and mobile apps"
          description="The kinds of products we design and develop for businesses and entrepreneurs."
          action={{ href: "/solutions", label: "See solutions" }}
        />
        <div className="mt-10 sm:mt-12">
          <WhatWeBuild />
        </div>
      </Section>

      {/* Why */}
      <Section>
        <SectionHeader eyebrow={`Why ${settings.businessName}`} title="Built around your business needs" />
        <div className="mt-10 sm:mt-12">
          <WhyGrid />
        </div>
      </Section>

      {/* Process */}
      <Section id="process" tone="muted">
        <SectionHeader
          eyebrow="Process"
          title="From idea to launch"
          description="Five clear steps, with updates at each one."
          action={{ href: "/process", label: "How we work" }}
        />
        <div className="mt-10 sm:mt-14">
          <ProcessSteps />
        </div>
      </Section>

      {/* About */}
      <Section id="about">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeader eyebrow="About" title="A small studio, focused on doing it properly" />
          <Reveal>
            <p className="text-base leading-relaxed text-muted sm:text-[17px]">
              {settings.businessName} helps businesses and entrepreneurs turn ideas into practical digital products — from a
              professional website to a custom web application or mobile app. We care about clean design, solid engineering and
              keeping you informed, so you always know what&apos;s being built and why.
            </p>
            <ul className="mt-7 space-y-3">
              {ABOUT_POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] text-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {point}
                </li>
              ))}
            </ul>
            <ArrowLink href="/about" className="mt-6">
              More about us
            </ArrowLink>
          </Reveal>
        </div>
      </Section>

      <CtaSection href="#contact" />

      {/* Contact */}
      <Section id="contact" tone="muted" className="border-b-0">
        <ContactSection contactEmail={settings.contactEmail} />
      </Section>
    </>
  );
}
