import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { HeroStage } from "@/components/marketing/hero-stage";
import { NamedIcon } from "@/components/marketing/icons";
import { DemoWorkNotice, PortfolioCard } from "@/components/marketing/portfolio-card";
import { PricingCards } from "@/components/marketing/pricing-cards";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { Section, SectionHeader } from "@/components/marketing/section";
import { ServiceBento } from "@/components/marketing/service-bento";
import { Testimonials } from "@/components/marketing/testimonials";
import { Button } from "@/components/ui/button";
import { Tilt } from "@/components/ui/tilt";
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
      <section className="relative isolate overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.045)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_75%_60%_at_40%_0%,black,transparent_75%)]"
        />
        <div className="container-page grid items-center gap-14 pb-20 pt-14 sm:pt-20 lg:grid-cols-[1fr_1.12fr] lg:gap-6 lg:pb-28 lg:pt-24">
          <div className="max-w-xl">
            <p className="glass inline-flex animate-rise items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/60 [animation-duration:2.4s]" />
                <span className="relative size-2 rounded-full bg-accent" />
              </span>
              Web design & development for small businesses
            </p>
            <h1 className="text-lit mt-7 animate-rise text-[2.75rem] font-semibold leading-[1.02] [animation-delay:80ms] sm:text-[3.6rem] xl:text-[4.2rem]">
              Websites Built to Grow Your Business
            </h1>
            <p className="mt-7 animate-rise text-lg leading-relaxed text-muted [animation-delay:160ms] sm:text-xl sm:leading-relaxed">
              We design and build modern, professional websites that help businesses attract customers, communicate their
              value, and grow online.
            </p>
            <div className="mt-10 flex animate-rise flex-col gap-3 [animation-delay:240ms] sm:flex-row">
              <Button asChild size="lg">
                <Link href="/start-project">
                  Start Your Project <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/portfolio">View Our Work</Link>
              </Button>
            </div>
            <ul className="mt-10 flex animate-rise flex-wrap gap-x-6 gap-y-2 text-sm text-muted [animation-delay:320ms]">
              {["Clear, step-by-step process", "Review every design", "Track progress online"].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Check className="size-4 text-accent" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
          <HeroStage />
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
        <div className="mt-14">
          <ServiceBento services={services} />
        </div>
      </Section>

      {/* Why */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeader
              eyebrow="Why it matters"
              title="Your website is your first impression"
              description="Most customers meet your business online first. It should be clear, fast and easy to act on."
            />
          </div>
          <dl className="grid gap-4 sm:grid-cols-2">
            {REASONS.map((reason, i) => (
              <div key={reason.title} className={i === 0 ? "glass rounded-3xl p-7" : "glass-recessed rounded-3xl p-7"}>
                <dt className="flex items-center gap-3 text-base font-semibold">
                  <span className="flex size-7 items-center justify-center rounded-full border border-accent-border bg-accent-subtle text-accent">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  {reason.title}
                </dt>
                <dd className="mt-3 text-sm leading-relaxed text-muted">{reason.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Process */}
      <Section id="process">
        <SectionHeader eyebrow="How it works" title="A simple, transparent process" description="You'll always know where your project stands and what happens next." />
        <div className="mt-16">
          <ProcessSteps />
        </div>
      </Section>

      {/* Portfolio */}
      <Section>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="Work" title="Recent work" description="A selection of website concepts across industries." />
          <Button asChild variant="secondary" className="self-start md:self-auto">
            <Link href="/portfolio">View portfolio</Link>
          </Button>
        </div>
        {portfolio.length ? (
          <>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
          align="center"
          eyebrow="Industries"
          title="Built for local and service businesses"
          description="We work with businesses that depend on customers finding them, trusting them and getting in touch."
        />
        <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">
          {INDUSTRY_LIST.map((industry) => (
            <li key={industry.name} className="glass-recessed flex items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:border-white/20 hover:bg-white/[0.05]">
              <NamedIcon name={industry.icon} className="size-4 shrink-0 text-accent" />
              {industry.name}
            </li>
          ))}
        </ul>
      </Section>

      {/* Testimonials */}
      <Section>
        <SectionHeader eyebrow="Testimonials" title="What working with us looks like" />
        <div className="mt-14">
          <Testimonials />
        </div>
      </Section>

      {/* Pricing */}
      <Section id="pricing">
        <SectionHeader
          align="center"
          eyebrow="Pricing"
          title="Straightforward packages"
          description="A starting point for common projects. Every proposal is confirmed after we review your requirements."
        />
        <div className="mt-14">
          <PricingCards packages={pricing} />
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <div>
            <SectionHeader eyebrow="FAQ" title="Common questions" />
            <p className="mt-5 text-sm leading-relaxed text-muted">
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
          <Tilt className="rounded-3xl" max={2} glare={false}>
            <div className="glass rounded-3xl px-6 sm:px-8">
              <FaqList items={FAQS.slice(0, 5)} />
            </div>
          </Tilt>
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
