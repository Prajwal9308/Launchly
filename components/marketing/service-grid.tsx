import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/db/types";
import { NamedIcon } from "./icons";

/** Detailed services list for the Services page. */
export function ServiceGrid({ services }: { services: Service[] }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  return (
    <div className="space-y-4">
      {services.map((service) => (
        <article key={service.id} id={service.slug} className="surface grid scroll-mt-24 gap-6 rounded-2xl p-7 sm:p-8 md:grid-cols-[1fr_1.1fr] md:gap-10">
          <div>
            <div className="flex size-11 items-center justify-center rounded-xl bg-accent-subtle text-accent">
              <NamedIcon name={service.icon} className="size-5" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold">{service.name}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{service.summary}</p>
            {service.description && <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.description}</p>}
          </div>
          <div className="flex flex-col justify-between gap-6">
            {service.features.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-muted">
                    <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
              {service.pricingText ? <p className="text-xs text-faint">{service.pricingText}</p> : <span />}
              <Link href="/contact" className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline" aria-label={`Start a project: ${service.name}`}>
                Start a project <ArrowRight className="size-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
