import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { ProcessSteps } from "@/components/marketing/process-steps";
import { PageHero, Section, SectionHeader } from "@/components/marketing/section";

export const metadata: Metadata = {
  title: "Process",
  description: "How we plan, design, build and launch your website — with a client portal to follow every step.",
  alternates: { canonical: "/process" },
};

const PORTAL = [
  { title: "Always know the status", body: "See the current stage, what's done and what's next on your project dashboard." },
  { title: "Share files in one place", body: "Upload your logo, photos, menus and documents directly to your project." },
  { title: "Review and approve designs", body: "See each design version, request changes or approve — every decision is recorded." },
  { title: "Message the studio", body: "Project conversations stay together instead of getting lost in email threads." },
];

export default function ProcessPage() {
  return (
    <>
      <PageHero
        eyebrow="Process"
        title="How we work"
        description="A clear process with defined steps, regular updates and explicit approvals before anything goes live."
      />
      <Section>
        <ProcessSteps />
      </Section>
      <Section tone="muted">
        <SectionHeader
          eyebrow="Client portal"
          title="Your project, visible at every stage"
          description="Every client gets a private portal for their project."
        />
        <dl className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PORTAL.map((item) => (
            <div key={item.title}>
              <dt className="text-[15px] font-semibold">{item.title}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-muted">{item.body}</dd>
            </div>
          ))}
        </dl>
      </Section>
      <CtaSection />
    </>
  );
}
