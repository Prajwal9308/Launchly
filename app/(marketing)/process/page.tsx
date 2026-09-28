import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { IconBadge } from "@/components/marketing/icons";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Process",
  description: "How we take websites and mobile apps from idea to launch: discover, plan, design, develop and launch.",
  alternates: { canonical: "/process" },
};

const WORKING_TOGETHER = [
  { title: "Scope in writing", icon: "file-signature", body: "Features, timeline and cost are agreed before development begins, so there are no surprises." },
  { title: "Regular updates", icon: "bell-ring", body: "You'll know what's been done and what's next at every stage of the project." },
  { title: "One place for your project", icon: "folder-kanban", body: "Share files, send messages and review designs in a private project portal." },
  { title: "Your approval first", icon: "badge-check", body: "Designs and the finished product go live only after you explicitly approve them." },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero eyebrow="Process" eyebrowIcon="workflow" title="From idea to launch" description="Five clear steps, whether you're building a website, a web application or a mobile app." />
      <Section>
        <ProcessSteps headingLevel="h2" />
      </Section>
      <Section tone="muted">
        <SectionHeader eyebrow="Working together" eyebrowIcon="messages" title="How we work with you" />
        <dl className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {WORKING_TOGETHER.map((item) => (
            <div key={item.title} className="surface rounded-2xl p-6">
              <IconBadge name={item.icon} />
              <dt className="mt-5 text-base font-semibold">{item.title}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <CtaSection />
    </>
  );
}
