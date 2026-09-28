import { connection } from "next/server";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getSiteSettings, listPublishedServices } from "@/services/catalog";
import { getActor } from "@/server/session";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  // Rendered per request: content comes from the database and must not be baked in at build time.
  await connection();
  const [settings, actor, services] = await Promise.all([getSiteSettings(), getActor(), listPublishedServices()]);
  const signedInHref = actor ? (actor.role === "ADMIN" ? "/admin" : "/dashboard") : null;

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader businessName={settings.businessName} signedInHref={signedInHref} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter
        businessName={settings.businessName}
        tagline={settings.tagline}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        services={services.map((s) => ({ slug: s.slug, name: s.name }))}
      />
    </div>
  );
}
