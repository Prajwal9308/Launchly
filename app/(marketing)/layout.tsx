import { connection } from "next/server";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { MotionProvider } from "@/components/motion/motion-provider";
import { getSiteSettings, listPublishedServices } from "@/services/catalog";
import { getVisitorCountry } from "@/server/country";
import { getActor } from "@/server/session";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Rendered per request: content comes from the database and must not be baked in at build time.
  await connection();
  const [settings, actor, services, country] = await Promise.all([getSiteSettings(), getActor(), listPublishedServices(), getVisitorCountry()]);
  const signedInHref = actor ? (actor.role === "ADMIN" ? "/admin" : "/dashboard") : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader businessName={settings.businessName} signedInHref={signedInHref} country={country} />
      <main id="main" className="flex-1">
        <MotionProvider>{children}</MotionProvider>
      </main>
      <SiteFooter
        businessName={settings.businessName}
        legalName={settings.legalName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        services={services.map((s) => ({ slug: s.slug, name: s.name }))}
      />
    </div>
  );
}
