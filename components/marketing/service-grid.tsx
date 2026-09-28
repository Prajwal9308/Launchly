import { Icons } from "@/components/ui/icons";
import type { Service } from "@/db/types";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./arrow-link";
import { IconBadge } from "./icons";
import { ServicePreview } from "./mockups/compositions";

/**
 * Detailed services list for the Services page: copy and features beside a
 * concept preview of the kind of product the service produces. Previews
 * alternate sides on desktop so the page reads as a sequence, not a list.
 */
export function ServiceGrid({ services }: { services: Service[] }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  return (
    <div className="space-y-4">
      <RevealGroup className="space-y-4">
        {services.map((service, i) => (
          <RevealItem
            as="article"
            key={service.id}
            id={service.slug}
            className="surface group grid scroll-mt-24 overflow-hidden rounded-2xl md:grid-cols-2"
          >
            <div className={cn("flex flex-col p-6 sm:p-8", i % 2 === 1 && "md:order-2")}>
              <h2 className="flex items-center gap-4 text-xl font-semibold sm:text-2xl">
                <IconBadge name={service.icon} />
                {service.name}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.summary}</p>
              {service.description && <p className="mt-3 text-[15px] leading-relaxed text-muted">{service.description}</p>}
              {service.features.length > 0 && (
                <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted">
                      <Icons.success className="text-accent" aria-hidden />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-auto pt-6" />
              <div className="flex items-center justify-between gap-3 border-t border-border pt-5">
                {service.pricingText ? (
                  <p className="flex items-center gap-1.5 text-xs text-faint">
                    <Icons.pricing aria-hidden /> {service.pricingText}
                  </p>
                ) : (
                  <span />
                )}
                <ArrowLink href="/contact">
                  Start a project<span className="sr-only">: {service.name}</span>
                </ArrowLink>
              </div>
            </div>
            <ServicePreview
              icon={service.icon}
              className={cn("h-60 border-t border-border sm:h-72 md:h-full md:min-h-80 md:border-t-0", i % 2 === 1 ? "md:order-1 md:border-r" : "md:border-l")}
            />
          </RevealItem>
        ))}
      </RevealGroup>
      <p className="flex items-center gap-2 text-xs text-faint">
        <Icons.info aria-hidden />
        Interfaces shown are concept examples of what we build, not client projects.
      </p>
    </div>
  );
}
