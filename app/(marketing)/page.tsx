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
import { getSiteSettings, listPublishedServices } from "@/services/catalog";

/** Operating principles, stated as facts about how we work — not badges. */
const PRINCIPLES = [
  { label: "Written scope before work begins", icon: Icons.scope },
  { label: "Direct communication with your developers", icon: Icons.messages },
  { label: "Nothing launches without your approval", icon: Icons.approved },
];

const ABOUT_POINTS = [
  { text: "You talk directly to the people designing and building your product.", icon: Icons.messages },
  { text: "Scope, timeline and cost are agreed in writing before work begins.", icon: Icons.scope },
  { text: "Web and mobile under one roof, so your product works across platforms.", icon: Icons.crossPlatform },
];

export default async function HomePage() {
  const [services, settings] = await Promise.all([listPublishedServices(), getSiteSettings()]);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border bg-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-glow" />
        <div className="container-page grid gap-10 pb-14 pt-10 sm:gap-12 sm:pb-20 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0 lg:pb-24 lg:pt-20">
          <Entrance className="max-w-[35rem] lg:self-end">
            <p className="eyebrow">Web &amp; mobile development studio</p>
            <h1 className="mt-4 text-[1.875rem] font-semibold leading-[1.15] sm:text-[2.5rem] sm:leading-[1.1] lg:text-[2.875rem]">
              Websites, apps and digital products, built with{" "}
              <span className="relative inline-block whitespace-nowrap text-accent">
                precision.
                <BrandCurve className="absolute -bottom-[0.28em] left-0 h-[0.3em] w-[96%]" />
              </span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-muted sm:text-[17px]">
              We design and build websites, web applications and mobile apps for businesses and founders, with a clear scope,
              transparent pricing and direct communication.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/contact">
                  Start a project <Icons.forward aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/process">How we work</Link>
              </Button>
            </div>
          </Entrance>
          <div className="self-center lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <HeroVisual />
          </div>
          <ul
            aria-label="How we work with clients"
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
          title="What we do"
          description="From a first website to a custom app, we design and build around how your business actually works."
          action={{ href: "/services", label: "All services" }}
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
              <Icons.info aria-hidden /> A simplified view of your project portal, with a sample project.
            </p>
          </Reveal>
          <div>
            <SectionHeader
              eyebrow="Working with us"
              title="Follow your product from brief to launch"
              description={`Every ${settings.businessName} project comes with a private portal for status updates, files, messages and design reviews, so you always know what's being built and why.`}
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
                More about us
              </ArrowLink>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Solutions */}
      <Section id="solutions">
        <SectionHeader
          eyebrow="What we build"
          title="Digital products for how your business works"
          description="Six kinds of product we design and build, each shown as a concept example on the Solutions page."
          action={{ href: "/solutions", label: "All solutions" }}
        />
        <div className="mt-10 sm:mt-12">
          <SolutionsOverview />
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

      {/* Why */}
      <Section>
        <SectionHeader eyebrow={`Why ${settings.businessName}`} title="What you can expect from us" />
        <div className="mt-10 sm:mt-12">
          <WhyGrid />
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
