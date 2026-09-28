import { ArrowRight, FileSignature, Layers, MessagesSquare, MonitorSmartphone, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { ContactSection } from "@/components/marketing/contact-section";
import { CtaSection } from "@/components/marketing/cta-section";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { Section, SectionHeader } from "@/components/marketing/section";
import { ServicesOverview } from "@/components/marketing/services-overview";
import { WhyGrid } from "@/components/marketing/why-grid";
import { Reveal } from "@/components/motion/reveal";
import { ArrowLink } from "@/components/marketing/arrow-link";
import { Button } from "@/components/ui/button";
import { getSiteSettings, listPublishedServices } from "@/services/catalog";

const HERO_POINTS = [
  { label: "Written scope and quote", icon: FileSignature },
  { label: "Talk directly to your developers", icon: MessagesSquare },
  { label: "Nothing goes live without your approval", icon: ShieldCheck },
];

const ABOUT_POINTS = [
  { text: "You talk directly to the people designing and building your product.", icon: MessagesSquare },
  { text: "Scope, timeline and cost are agreed in writing before work begins.", icon: FileSignature },
  { text: "Web and mobile under one roof, so your product works across platforms.", icon: MonitorSmartphone },
];

export default async function HomePage() {
  const [services, settings] = await Promise.all([listPublishedServices(), getSiteSettings()]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-canvas">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-glow" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-70" />
        <div className="container-page grid items-center gap-12 pb-16 pt-12 sm:gap-14 sm:pb-20 sm:pt-20 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:pb-24 lg:pt-24">
          <div className="max-w-xl animate-rise">
            <p className="eyebrow">
              <Sparkles className="size-3.5" aria-hidden /> Web &amp; mobile studio
            </p>
            <h1 className="mt-5 text-[2.25rem] font-bold leading-[1.06] sm:text-5xl sm:leading-[1.04] lg:text-[3.5rem]">
              Websites and mobile apps for your business, <span className="text-gradient">scoped in writing and built to last.</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted sm:mt-6 sm:text-lg">
              We design and build websites, web apps and iOS &amp; Android apps for businesses and founders. You talk directly
              to the people building it, get a written scope and quote before work starts, and approve everything before it
              goes live.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">
                  Get a free quote <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/services">
                  <Layers aria-hidden /> See our services
                </Link>
              </Button>
            </div>
            <ul className="mt-8 grid gap-2.5 text-sm text-muted sm:flex sm:flex-wrap sm:gap-x-5">
              {HERO_POINTS.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-subtle text-accent">
                    <Icon className="size-3.5" aria-hidden />
                  </span>
                  {label}
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
          eyebrowIcon="layers"
          title="What we do"
          description="From a first website to a custom app, we design and build around how your business actually works."
          action={{ href: "/services", label: "All services" }}
        />
        <div className="mt-10 sm:mt-12">
          <ServicesOverview services={services} />
        </div>
      </Section>

      {/* Why */}
      <Section>
        <SectionHeader eyebrow={`Why ${settings.businessName}`} eyebrowIcon="sparkles" title="What you can expect from us" />
        <div className="mt-10 sm:mt-12">
          <WhyGrid />
        </div>
      </Section>

      {/* Process */}
      <Section id="process" tone="muted">
        <SectionHeader
          eyebrow="Process"
          eyebrowIcon="workflow"
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
          <SectionHeader eyebrow="About" eyebrowIcon="users" title="A small studio, focused on doing it properly" />
          <Reveal>
            <p className="text-base leading-relaxed text-muted sm:text-[17px]">
              {settings.businessName} helps businesses and entrepreneurs turn ideas into practical digital products — from a
              professional website to a custom web application or mobile app. We care about clean design, solid engineering and
              keeping you informed, so you always know what&apos;s being built and why.
            </p>
            <ul className="mt-7 space-y-3">
              {ABOUT_POINTS.map(({ text, icon: Icon }) => (
                <li key={text} className="surface flex items-center gap-4 rounded-xl p-4 text-[15px] text-foreground">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-subtle text-accent ring-1 ring-inset ring-accent-border/60">
                    <Icon className="size-[18px]" aria-hidden />
                  </span>
                  {text}
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
