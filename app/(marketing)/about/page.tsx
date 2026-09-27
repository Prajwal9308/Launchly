import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";
import { getSiteSettings } from "@/services/catalog";

export const metadata: Metadata = {
  title: "About",
  description: "An independent web design and development studio for small and local businesses.",
  alternates: { canonical: "/about" },
};

const PRINCIPLES = [
  { title: "Clarity over complexity", body: "Plain language, clear scope and no surprises. You'll know what's included before work begins." },
  { title: "Built around your customers", body: "Every page is planned around what your customers need to know and do." },
  { title: "Honest expectations", body: "We don't promise rankings, revenue or overnight results. We promise careful, professional work." },
  { title: "Your approval, every step", body: "Designs and final websites go live only after you've explicitly approved them." },
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="About"
        title={`About ${settings.businessName}`}
        description="An independent web design and development studio helping small businesses establish a professional online presence."
      />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">
          <SectionHeader title="Professional websites, without the agency overhead" />
          <div className="space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              Many small businesses need a website that clearly explains what they do and makes it easy for customers to get
              in touch — without a long, complicated agency engagement.
            </p>
            <p>
              We work directly with business owners to plan, design and build websites that fit their business. You work
              with the person designing and building your site, and you can follow every step in your client portal.
            </p>
            {settings.serviceArea && <p>We work with businesses in {settings.serviceArea}.</p>}
          </div>
        </div>
      </Section>
      <Section tone="muted">
        <SectionHeader title="How we work" />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="border-t border-border pt-5">
              <dt className="text-[15px] font-semibold">{p.title}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted">{p.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <CtaSection />
    </>
  );
}
