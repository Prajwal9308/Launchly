import Link from "next/link";
import { HoverLift } from "@/components/ui/hover-lift";
import { IconTile, Icons } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import type { PricingPackage } from "@/db/types";
import { formatMoney, type CountryCode } from "@/domain/country";
import { cn } from "@/lib/utils";

function priceFor(pkg: PricingPackage, country: CountryCode) {
  return country === "CA" ? pkg.priceCad : pkg.priceInr;
}

/**
 * Pricing packages in the visitor's currency. Without a known country no
 * price is shown; the page asks the visitor to choose Canada or India.
 */
export function PricingCards({ packages, country, taxNote }: { packages: PricingPackage[]; country: CountryCode | null; taxNote: string }) {
  if (!packages.length) {
    return (
      <div className="surface rounded-3xl p-8 text-center">
        <IconTile icon={Icons.messages} size="lg" className="mx-auto" />
        <p className="mt-4 font-medium">Every project is quoted individually</p>
        <p className="mt-1 text-sm text-muted">Tell us what your business needs and we will prepare a written proposal.</p>
        <Button asChild className="mt-5">
          <Link href="/contact">
            Request a Quote <Icons.forward aria-hidden />
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", packages.length % 3 === 0 ? "lg:grid-cols-3" : packages.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3")}>
      {packages.map((pkg) => {
        const price = country ? priceFor(pkg, country) : null;
        return (
          <HoverLift key={pkg.id} className="rounded-2xl">
            <article
              className={cn(
                "relative flex h-full flex-col rounded-2xl p-7",
                pkg.highlighted ? "surface-raised !border-accent ring-1 ring-accent" : "surface",
              )}
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground shadow-xs">
                  <Icons.recommended className="fill-current" aria-hidden /> Recommended
                </span>
              )}
              <h2 className="text-base font-semibold">{pkg.name}</h2>
              <p className="mt-1.5 min-h-[4.25rem] text-sm leading-relaxed text-muted">{pkg.description}</p>
              <div className="mt-5">
                {country && price != null ? (
                  <>
                    <p className="flex flex-wrap items-baseline gap-x-1.5">
                      {pkg.pricePrefix && <span className="text-sm text-faint">{pkg.pricePrefix}</span>}
                      <span className="text-3xl font-semibold tracking-tight">{formatMoney(price, country)}</span>
                    </p>
                    {taxNote && <p className="mt-1 text-xs text-faint">{taxNote}</p>}
                  </>
                ) : country ? (
                  <>
                    <p className="text-2xl font-semibold tracking-tight">Quoted per project</p>
                    <p className="mt-1 text-xs text-faint">Written proposal before development begins</p>
                  </>
                ) : (
                  <>
                    <p className="text-2xl font-semibold tracking-tight">Select your country</p>
                    <p className="mt-1 text-xs text-faint">Choose Canada or India above to see pricing in your currency.</p>
                  </>
                )}
              </div>
              <p className="mt-6 border-t border-border pt-6 text-xs font-medium uppercase tracking-wider text-faint">Includes</p>
              <ul className="mt-3 flex-1 space-y-2.5">
                {pkg.features.map((feature) => (
                  <li key={feature} className="flex gap-2.5 text-sm text-muted">
                    <Icons.success className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild variant={pkg.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
                <Link href="/contact">
                  Request a Quote <span className="sr-only">for {pkg.name}</span> <Icons.forward aria-hidden />
                </Link>
              </Button>
            </article>
          </HoverLift>
        );
      })}
    </div>
  );
}
