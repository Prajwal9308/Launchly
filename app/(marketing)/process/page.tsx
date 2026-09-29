import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { IconBadge } from "@/components/marketing/icons";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Process",
  description:
    "How CoreGravity plans, designs, builds and launches websites and business applications for small businesses, with written scope and your approval at each key stage.",
  alternates: { canonical: "/process" },
};

const WORKING_TOGETHER = [
  { title: "Written proposal", icon: "file-signature", body: "Scope, timeline, pricing and payment terms are confirmed in writing before development begins." },
  { title: "Regular updates", icon: "notifications", body: "You will know what has been completed and what comes next at every stage." },
  { title: "One client portal", icon: "folder-kanban", body: "Review requirements, exchange files, send messages and approve designs in one private place." },
  { title: "Your approval first", icon: "badge-check", body: "Designs and the finished website or application go live only after you approve them." },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="A straightforward process from idea to launch"
        description="We keep every project organized with clear stages, regular communication and defined approvals."
      />
      <Section>
        <ProcessSteps headingLevel="h2" />
        <div className="mt-12 max-w-2xl border-t border-border pt-8">
          <h2 className="text-base font-semibold">After launch</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            We can continue supporting your business with maintenance, improvements and new features when needed.
          </p>
        </div>
      </Section>
      <Section tone="muted">
        <SectionHeader eyebrow="Working together" title="How we work with you" />
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
