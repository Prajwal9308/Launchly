import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/db/types";
import { HoverLift } from "@/components/ui/hover-lift";
import { NamedIcon } from "./icons";

/**
 * Homepage services: the two primary offerings (web and mobile) as larger
 * cards with key features, the rest as a compact list — not a grid of
 * identical boxes.
 */
export function ServicesOverview({ services }: { services: Service[] }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  const primary = services.slice(0, 2);
  const secondary = services.slice(2, 6);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {primary.map((service) => (
          <HoverLift key={service.id}>
            <Link href={`/services#${service.slug}`} className="surface group flex h-full flex-col rounded-2xl p-7 transition-colors hover:border-border-strong sm:p-8">
              <div className="flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
                <NamedIcon name={service.icon} className="size-5" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">{service.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{service.summary}</p>
              {service.features.length > 0 && (
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-muted">
                      <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-foreground">
                Learn more <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </span>
            </Link>
          </HoverLift>
        ))}
      </div>
      {secondary.length > 0 && (
        <ul className="surface grid divide-y divide-border rounded-2xl md:grid-cols-3 md:divide-x md:divide-y-0">
          {secondary.map((service) => (
            <li key={service.id}>
              <Link href={`/services#${service.slug}`} className="group flex h-full gap-4 p-6 transition-colors hover:bg-canvas">
                <NamedIcon name={service.icon} className="mt-0.5 size-5 shrink-0 text-accent" />
                <span>
                  <span className="block font-semibold">{service.name}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{service.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
