import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Logo } from "@/components/marketing/logo";
import { getSiteSettings } from "@/services/catalog";

export const metadata: Metadata = { title: "Project questionnaire", robots: { index: false } };

/** Focused, distraction-free layout for the project questionnaire. */
export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  // Rendered per request: content comes from the database and must not be baked in at build time.
  await connection();
  const settings = await getSiteSettings();
  return (
    <div className="min-h-dvh bg-canvas">
      <header className="border-b border-border bg-background">
        <div className="container-page flex h-14 items-center justify-between">
          <Logo name={settings.businessName} />
          <Link href="/dashboard" className="text-sm text-muted hover:text-foreground">
            Save &amp; exit
          </Link>
        </div>
      </header>
      <main id="main" className="container-page py-8 sm:py-12">
        {children}
      </main>
    </div>
  );
}
