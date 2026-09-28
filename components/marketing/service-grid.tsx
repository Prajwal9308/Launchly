import { CircleCheck, Tag } from "lucide-react";
import type { Service } from "@/db/types";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ArrowLink } from "./arrow-link";
import { IconBadge } from "./icons";

/** Detailed services list for the Services page. */
export function ServiceGrid({ services }: { services: Service[] }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  return (
    <RevealGroup className="space-y-4">
      {services.map((service) => (
        <RevealItem as="article" key={service.id} id={service.slug} className="surface grid scroll-mt-24 gap-6 rounded-2xl p-6 sm:p-8 md:grid-cols-[1fr_1.1fr] md:gap-10">
          <div>
            <IconBadge name={service.icon} />
            <h2 className="mt-5 text-xl font-semibold sm:text-2xl">{service.name}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{service.summary}</p>
            {service.description && <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.description}</p>}
          </div>
          <div className="flex flex-col justify-between gap-6">
            {service.features.length > 0 && (
              <ul className="grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-muted">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
              {service.pricingText ? (
                <p className="flex items-center gap-1.5 text-xs text-faint">
                  <Tag className="size-3.5 shrink-0" aria-hidden /> {service.pricingText}
                </p>
              ) : (
                <span />
              )}
              <ArrowLink href="/contact">
                Start a project<span className="sr-only">: {service.name}</span>
              </ArrowLink>
            </div>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
