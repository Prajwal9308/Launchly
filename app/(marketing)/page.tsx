import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { HeroPreview } from "@/components/marketing/hero-preview";
import { NamedIcon } from "@/components/marketing/icons";
import { DemoWorkNotice, PortfolioCard } from "@/components/marketing/portfolio-card";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { Section, SectionHeader } from "@/components/marketing/section";
import { ServiceGrid } from "@/components/marketing/service-grid";
import { Testimonials } from "@/components/marketing/testimonials";
import { Button } from "@/components/ui/button";
import { FAQS } from "@/content/faq";
import { INDUSTRY_LIST } from "@/content/industries";
import { listPublishedPortfolio, listPublishedPricing, listPublishedServices } from "@/services/catalog";

const REASONS = [
  {
    title: "Customers look you up first",
    body: "Many people check a business online before they call, book or visit. A clear website answers their questions up front.",
  },
  {
    title: "Explain what you do, clearly",
    body: "Your services, prices, hours and service area — organized so visitors quickly understand whether you're the right fit.",
  },
  {
    title: "Make it easy to get in touch",
    body: "Prominent calls, contact forms, bookings and directions, designed to work well on a phone.",
  },
  {
    title: "Look credible on every device",
    body: "A modern, consistent website helps your business look as professional online as it is in person.",
  },
];

export default async function HomePage() {
  const [services, portfolio, pricing] = await Promise.all([
    listPublishedServices(),
    listPublishedPortfolio({ featuredOnly: true, take: 3 }),
    listPublishedPricing(),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-canvas),var(--color-background)_70%)]"
        />
        <div className="container-page relative grid items-center gap-16 pb-24 pt-16 sm:pt-20 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:pb-28 lg:pt-24">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted shadow-xs">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden />
              Web design & development for small businesses
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] sm:text-5xl lg:text-[3.4rem]">
              Websites Built to Grow Your Business
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              We design and build modern, professional websites that help businesses attract customers, communicate their
              value, and grow online.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/start-project">
                  Start Your Project <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
              {["Clear, step-by-step process", "Review every design", "Track progress online"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-accent" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* Services */}
      <Section id="services">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader
            eyebrow="Services"
            title="Everything your business needs online"
            description="From a focused landing page to a full e-commerce store, each project is planned around your goals."
          />
          <Button asChild variant="secondary" className="self-start md:self-auto">
            <Link href="/services">All services</Link>
          </Button>
        </div>
        <div className="mt-12">
          <ServiceGrid services={services.slice(0, 6)} />
        </div>
      </Section>

      {/* Why */}
      <Section tone="muted">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <SectionHeader
            eyebrow="Why it matters"
            title="Why your business needs a professional website"
            description="Your website is often the first impression a customer has of your business. It should be clear, fast and easy to act on."
          />
          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
            {REASONS.map((reason) => (
              <div key={reason.title}>
                <dt className="flex items-center gap-2 text-[15px] font-semibold">
                  <span className="flex size-5 items-center justify-center rounded-full bg-accent-subtle text-accent">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  {reason.title}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-muted">{reason.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Process */}
      <Section id="process">
        <SectionHeader
          eyebrow="How it works"
          title="A simple, transparent process"
          description="You'll always know where your project stands and what happens next."
        />
        <div className="mt-12">
          <ProcessSteps />
        </div>
      </Section>

      {/* Portfolio */}
      <Section tone="muted">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="Work" title="Recent work" description="A selection of website concepts across industries." />
          <Button asChild variant="secondary" className="self-start md:self-auto">
            <Link href="/portfolio">View portfolio</Link>
          </Button>
        </div>
        {portfolio.length ? (
          <>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {portfolio.map((item) => (
                <PortfolioCard key={item.id} item={item} />
              ))}
            </div>
            {portfolio.some((p) => p.isDemo) && (
              <div className="mt-6">
                <DemoWorkNotice />
              </div>
            )}
          </>
        ) : (
          <p className="mt-10 text-sm text-muted">Portfolio projects will be added soon.</p>
        )}
      </Section>

      {/* Industries */}
      <Section>
        <SectionHeader
          eyebrow="Industries"
          title="Built for local and service businesses"
          description="We work with businesses that depend on customers finding them, trusting them and getting in touch."
        />
        <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {INDUSTRY_LIST.map((industry) => (
            <li key={industry.name} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3.5 text-sm font-medium">
              <NamedIcon name={industry.icon} className="size-4 shrink-0 text-faint" />
              {industry.name}
            </li>
          ))}
        </ul>
      </Section>

      {/* Testimonials */}
      <Section tone="muted">
        <SectionHeader eyebrow="Testimonials" title="What working with us looks like" />
        <div className="mt-12">
          <Testimonials />
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeader
          eyebrow="Pricing"
          title="Straightforward packages"
          description="A starting point for common projects. Every proposal is confirmed after we review your requirements."
        />
        <div className="mt-12">
          <PricingCards packages={pricing} />
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="muted">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div>
            <SectionHeader eyebrow="FAQ" title="Common questions" />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              More answers on the{" "}
              <Link href="/faq" className="font-medium text-accent hover:underline">
                FAQ page
              </Link>
              , or{" "}
              <Link href="/contact" className="font-medium text-accent hover:underline">
                contact us
              </Link>
              .
            </p>
          </div>
          <FaqList items={FAQS.slice(0, 5)} />
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
