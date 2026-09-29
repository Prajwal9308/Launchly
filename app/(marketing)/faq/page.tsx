import type { Metadata } from "next";
import { CtaSection } from "@/components/marketing/cta-section";
import { FaqList } from "@/components/marketing/faq-list";
import { PageHero, Section } from "@/components/marketing/section";
import { FAQS } from "@/content/faq";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about CoreGravity's services for small businesses, pricing in CAD and INR, timelines, website redesigns and ongoing support.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
  return (
    <>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" />
      <Section>
        <div className="max-w-3xl">
          <FaqList items={FAQS} />
        </div>
      </Section>
      <CtaSection />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
