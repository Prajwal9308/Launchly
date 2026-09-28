import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/db/types";
import { NamedIcon } from "./icons";

/**
 * Services as a hairline grid. Overview cards are fully clickable (to the
 * services page); the detailed variant lists features with one CTA each.
 */
export function ServiceGrid({ services, detailed = false }: { services: Service[]; detailed?: boolean }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  return (
    <div className="grid overflow-hidden rounded-2xl border border-border bg-border [gap:1px] sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => {
        const body = (
          <>
            <div className="flex items-start justify-between">
              <div className="flex size-10 items-center justify-center rounded-xl border border-border bg-canvas text-accent transition-colors group-hover:border-accent-border group-hover:bg-accent-subtle">
                <NamedIcon name={service.icon} className="size-[18px]" />
              </div>
              {!detailed && (
                <ArrowUpRight
                  className="size-4 text-faint opacity-0 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground group-hover:opacity-100"
                  aria-hidden
                />
              )}
            </div>
            <h3 className="mt-5 text-base font-semibold">{service.name}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.summary}</p>
          </>
        );
        if (!detailed) {
          return (
            <Link key={service.id} href={`/services#${service.slug}`} className="group flex flex-col bg-background p-7 transition-colors hover:bg-canvas">
              {body}
            </Link>
          );
        }
        return (
          <article key={service.id} id={service.slug} className="group flex scroll-mt-24 flex-col bg-background p-7">
            {body}
            {service.features.length > 0 && (
              <ul className="mt-5 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-auto flex items-center justify-between gap-3 pt-6">
              {service.pricingText ? <p className="text-xs text-faint">{service.pricingText}</p> : <span />}
              <Link
                href="/start-project"
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
                aria-label={`Start a project: ${service.name}`}
              >
                Start a project <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
