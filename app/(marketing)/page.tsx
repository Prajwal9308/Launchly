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
import { Button } from "@/components/ui/button";
import { getSiteSettings, listPublishedServices } from "@/services/catalog";

const HERO_POINTS = ["Websites & web apps", "iOS & Android apps", "Clear scope before we start"];

const ABOUT_POINTS = [
  "You work directly with the people designing and building your product.",
  "Scope, timeline and cost are agreed in writing before work begins.",
  "Web and mobile under one roof, so your product works together across platforms.",
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
        <div className="container-page grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pb-24 lg:pt-24">
          <div className="max-w-xl animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted shadow-xs">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Web &amp; mobile app development studio
            </p>
            <h1 className="mt-6 text-[2.5rem] font-semibold leading-[1.06] sm:text-5xl lg:text-[3.5rem]">
              Websites and mobile apps, built for your business.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-muted">
              {settings.businessName} designs and develops professional websites, web applications and mobile apps — helping
              businesses establish their digital presence and turn ideas into products people use.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a Project <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {HERO_POINTS.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-accent" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="animate-rise [animation-delay:120ms]">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Services */}
      <Section id="services">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Services"
            title="What we do"
            description="From a first website to a custom app, we design and build digital products around how your business works."
          />
          <Button asChild variant="secondary" className="self-start md:self-auto">
            <Link href="/services">All services</Link>
          </Button>
        </div>
        <div className="mt-12">
          <ServicesOverview services={services} />
        </div>
      </Section>

      {/* What We Build */}
      <Section id="what-we-build" tone="muted">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="What We Build"
            title="Websites, web apps and mobile apps"
            description="The kinds of products we design and develop for businesses and entrepreneurs."
          />
          <Button asChild variant="secondary" className="self-start md:self-auto">
            <Link href="/solutions">See solutions</Link>
          </Button>
        </div>
        <div className="mt-12">
          <WhatWeBuild />
        </div>
      </Section>

      {/* Why */}
      <Section>
        <SectionHeader eyebrow={`Why ${settings.businessName}`} title="Built around your business needs" />
        <div className="mt-12">
          <WhyGrid />
        </div>
      </Section>

      {/* Process */}
      <Section id="process" tone="muted">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="Process" title="From idea to launch" description="A straightforward process with clear steps and regular updates." />
          <Button asChild variant="secondary" className="self-start md:self-auto">
            <Link href="/process">How we work</Link>
          </Button>
        </div>
        <div className="mt-12">
          <ProcessSteps />
        </div>
      </Section>

      {/* About */}
      <Section id="about">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeader eyebrow="About" title="A modern development studio" />
          <div>
            <p className="text-[17px] leading-relaxed text-muted">
              {settings.businessName} helps businesses and entrepreneurs turn ideas into practical digital products — from a
              professional website to a custom web application or mobile app. We focus on clean design, solid engineering and
              clear communication, so you always know what&apos;s being built and why.
            </p>
            <ul className="mt-8 space-y-3">
              {ABOUT_POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-[15px] text-foreground">
                  <Check className="mt-1 size-4 shrink-0 text-accent" aria-hidden /> {point}
                </li>
              ))}
            </ul>
            <Link href="/about" className="mt-8 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
              More about us <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </Section>

      <CtaSection />

      {/* Contact */}
      <Section id="contact" tone="muted" className="border-b-0">
        <ContactSection contactEmail={settings.contactEmail} />
      </Section>
    </>
  );
}
