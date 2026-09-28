import { ArrowRight, CircleCheck } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/db/types";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { IconBadge } from "./icons";

/**
 * Homepage services: the two primary offerings (web and mobile) as larger
 * cards with key features, the rest as a compact row — not a grid of
 * identical boxes.
 */
export function ServicesOverview({ services }: { services: Service[] }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  const primary = services.slice(0, 2);
  const secondary = services.slice(2, 6);
  return (
    <RevealGroup className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {primary.map((service) => (
          <RevealItem key={service.id}>
            <Link
              href={`/services#${service.slug}`}
              className="surface group flex h-full flex-col rounded-2xl p-6 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-accent-border hover:shadow-popover motion-reduce:hover:translate-y-0 sm:p-8"
            >
              <IconBadge name={service.icon} />
              <h3 className="mt-5 text-xl font-semibold sm:mt-6">{service.name}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{service.summary}</p>
              {service.features.length > 0 && (
                <ul className="mt-5 grid gap-x-4 gap-y-2 sm:grid-cols-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-muted">
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {f}
                    </li>
                  ))}
                </ul>
              )}
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-foreground">
                Learn more
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
              </span>
            </Link>
          </RevealItem>
        ))}
      </div>
      {secondary.length > 0 && (
        <RevealItem as="ul" className="surface grid divide-y divide-border overflow-hidden rounded-2xl md:grid-cols-3 md:divide-x md:divide-y-0">
          {secondary.map((service) => (
            <li key={service.id}>
              <Link href={`/services#${service.slug}`} className="group flex h-full gap-4 p-5 transition-colors hover:bg-canvas sm:p-6">
                <IconBadge name={service.icon} size="sm" />
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-semibold">
                    {service.name}
                    <ArrowRight className="size-4 shrink-0 text-faint transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:group-hover:translate-x-0" aria-hidden />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{service.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </RevealItem>
      )}
    </RevealGroup>
  );
}
