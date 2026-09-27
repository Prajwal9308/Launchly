import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/db/types";
import { NamedIcon } from "./icons";

/** Grid of services separated by hairlines rather than individual cards. */
export function ServiceGrid({ services, detailed = false }: { services: Service[]; detailed?: boolean }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  return (
    <div className="grid overflow-hidden rounded-xl border border-border bg-border [gap:1px] sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <article key={service.id} id={service.slug} className="flex flex-col bg-background p-6">
          <div className="flex size-9 items-center justify-center rounded-lg border border-border text-accent">
            <NamedIcon name={service.icon} className="size-[18px]" />
          </div>
          <h3 className="mt-4 text-[15px] font-semibold">{service.name}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{service.summary}</p>
          {detailed && service.features.length > 0 && (
            <ul className="mt-4 space-y-1.5">
              {service.features.map((feature) => (
                <li key={feature} className="flex gap-2 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-5">
            {detailed && service.pricingText ? <p className="text-xs text-faint">{service.pricingText}</p> : <span />}
            <Link
              href={`/start-project`}
              className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              aria-label={`Start a project: ${service.name}`}
            >
              Get started <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
