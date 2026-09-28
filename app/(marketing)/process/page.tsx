import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Process",
  description: "How we take websites and mobile apps from idea to launch: discover, plan, design, develop and launch.",
  alternates: { canonical: "/process" },
};

const WORKING_TOGETHER = [
  { title: "Scope in writing", body: "Features, timeline and cost are agreed before development begins, so there are no surprises." },
  { title: "Regular updates", body: "You'll know what's been done and what's next at every stage of the project." },
  { title: "One place for your project", body: "Share files, send messages and review designs in a private project portal." },
  { title: "Your approval first", body: "Designs and the finished product go live only after you explicitly approve them." },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero eyebrow="Process" title="From idea to launch" description="Five clear steps, whether you're building a website, a web application or a mobile app." />
      <Section>
        <ProcessSteps />
      </Section>
      <Section tone="muted">
        <SectionHeader eyebrow="Working together" title="How we work with you" />
        <dl className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {WORKING_TOGETHER.map((item) => (
            <div key={item.title} className="border-t border-border pt-5">
              <dt className="text-base font-semibold">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <CtaSection />
    </>
  );
}
