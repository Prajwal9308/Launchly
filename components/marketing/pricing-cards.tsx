import { Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PricingPackage } from "@/db/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PricingCards({ packages }: { packages: PricingPackage[] }) {
  if (!packages.length) {
    return (
      <div className="rounded-xl border border-border bg-background p-8 text-center">
        <p className="font-medium">Let&apos;s discuss your project</p>
        <p className="mt-1 text-sm text-muted">Every business is different. Tell us what you need and we&apos;ll put together a proposal.</p>
        <Button asChild className="mt-5">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
    );
  }
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", packages.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3")}>
      {packages.map((pkg) => (
        <article
          key={pkg.id}
          className={cn(
            "relative flex flex-col rounded-2xl border bg-background p-7",
            pkg.highlighted ? "border-accent shadow-popover ring-1 ring-accent/25" : "border-border shadow-card",
          )}
        >
          {pkg.highlighted && (
            <span className="absolute -top-3 left-7 whitespace-nowrap rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground shadow-xs">
              Most popular
            </span>
          )}
          <h3 className="text-base font-semibold">{pkg.name}</h3>
          <p className="mt-1.5 min-h-[4.25rem] text-sm leading-relaxed text-muted">{pkg.description}</p>
          <div className="mt-5">
            {pkg.priceCents != null ? (
              <p className="flex items-baseline gap-1.5">
                {pkg.pricePrefix && <span className="text-sm text-faint">{pkg.pricePrefix}</span>}
                <span className="text-3xl font-semibold tracking-tight">{formatPrice(pkg.priceCents)}</span>
              </p>
            ) : (
              <>
                <p className="text-2xl font-semibold tracking-tight">Custom quote</p>
                <p className="mt-1 text-xs text-faint">Let&apos;s discuss your project</p>
              </>
            )}
          </div>
          <ul className="mt-6 space-y-2.5 border-t border-border pt-6">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm text-muted">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild variant={pkg.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
            <Link href="/start-project">Start Your Project</Link>
          </Button>
        </article>
      ))}
    </div>
  );
}
