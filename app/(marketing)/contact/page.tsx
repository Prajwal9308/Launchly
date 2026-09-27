import { Mail, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/marketing/contact-form";
import { PageHero, Section } from "@/components/marketing/section";
import { getSiteSettings, listPublishedServices } from "@/services/catalog";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about your business and what you need. We'll reply with next steps.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const [settings, services] = await Promise.all([getSiteSettings(), listPublishedServices()]);
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's talk about your website" description="Send us a message and we'll get back to you with next steps." />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div className="space-y-8">
            <div className="space-y-3 text-sm">
              <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 text-muted hover:text-foreground">
                <Mail className="size-4 text-faint" aria-hidden /> {settings.contactEmail}
              </a>
              {settings.contactPhone && (
                <a href={`tel:${settings.contactPhone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-3 text-muted hover:text-foreground">
                  <Phone className="size-4 text-faint" aria-hidden /> {settings.contactPhone}
                </a>
              )}
            </div>
            <div className="rounded-xl border border-border bg-canvas p-5">
              <p className="text-sm font-semibold">Ready to start?</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                Skip the back-and-forth: create an account and complete the project questionnaire. It takes about 10 minutes
                and your progress is saved as you go.
              </p>
              <Link href="/start-project" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
                Start your project →
              </Link>
            </div>
          </div>
          <ContactForm services={services.map((s) => s.name)} />
        </div>
      </Section>
    </>
  );
}
