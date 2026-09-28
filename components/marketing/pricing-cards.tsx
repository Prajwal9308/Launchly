import { ArrowRight, CircleCheck, MessagesSquare, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HoverLift } from "@/components/ui/hover-lift";
import type { PricingPackage } from "@/db/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PricingCards({ packages }: { packages: PricingPackage[] }) {
  if (!packages.length) {
    return (
      <div className="surface rounded-3xl p-8 text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
          <MessagesSquare className="size-5" aria-hidden />
        </span>
        <p className="mt-4 font-medium">Let&apos;s discuss your project</p>
        <p className="mt-1 text-sm text-muted">Every business is different. Tell us what you need and we&apos;ll put together a proposal.</p>
        <Button asChild className="mt-5">
          <Link href="/contact">
            Contact us <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    );
  }
  return (
    <div className={cn("grid gap-4 md:grid-cols-2", packages.length >= 4 ? "xl:grid-cols-4" : "lg:grid-cols-3")}>
      {packages.map((pkg) => (
        <HoverLift key={pkg.id} className="rounded-2xl">
        <article
          className={cn(
            "relative flex h-full flex-col rounded-2xl p-7",
            pkg.highlighted ? "surface-raised !border-accent ring-1 ring-accent" : "surface",
          )}
        >
          {pkg.highlighted && (
            <span className="absolute -top-3 left-7 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground shadow-xs">
              <Star className="size-3 fill-current" aria-hidden /> Recommended
            </span>
          )}
          <h2 className="text-base font-semibold">{pkg.name}</h2>
          <p className="mt-1.5 min-h-[4.25rem] text-sm leading-relaxed text-muted">{pkg.description}</p>
          <div className="mt-5">
            {pkg.priceCents != null ? (
              <p className="flex items-baseline gap-1.5">
                {pkg.pricePrefix && <span className="text-sm text-faint">{pkg.pricePrefix}</span>}
                <span className="text-3xl font-semibold tracking-tight">{formatPrice(pkg.priceCents)}</span>
              </p>
            ) : (
              <>
                <p className="text-2xl font-semibold tracking-tight">Quoted per project</p>
                <p className="mt-1 text-xs text-faint">Written quote before work starts</p>
              </>
            )}
          </div>
          <ul className="mt-6 flex-1 space-y-2.5 border-t border-border pt-6">
            {pkg.features.map((feature) => (
              <li key={feature} className="flex gap-2.5 text-sm text-muted">
                <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                {feature}
              </li>
            ))}
          </ul>
          <Button asChild variant={pkg.highlighted ? "primary" : "secondary"} className="mt-8 w-full">
            <Link href="/contact">
              Get a quote <ArrowRight aria-hidden />
            </Link>
          </Button>
        </article>
        </HoverLift>
      ))}
    </div>
  );
}
