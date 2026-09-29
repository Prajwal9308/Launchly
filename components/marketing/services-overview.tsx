import Link from "next/link";
import type { Service } from "@/db/types";
import { Icons } from "@/components/ui/icons";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { IconBadge } from "./icons";
import { cn } from "@/lib/utils";
import { ServicePreview } from "./mockups/compositions";

/**
 * Homepage services as a product-style bento: each card leads with a concept
 * interface on a device, then a small icon, the service name and summary. The first
 * two services (web and mobile) get wide cards with their key features.
 */
export function ServicesOverview({ services }: { services: Service[] }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  const primary = services.slice(0, 2);
  const secondary = services.slice(2, 5);
  return (
    <div className="space-y-4">
      <RevealGroup className="grid gap-4 md:grid-cols-2">
        {primary.map((service) => (
          <RevealItem key={service.id}>
            <ServiceCard service={service} features />
          </RevealItem>
        ))}
      </RevealGroup>
      {secondary.length > 0 && (
        <RevealGroup className="grid gap-4 md:grid-cols-3">
          {secondary.map((service) => (
            <RevealItem key={service.id}>
              <ServiceCard service={service} />
            </RevealItem>
          ))}
        </RevealGroup>
      )}
      <p className="flex items-center gap-2 text-xs text-faint">
        <Icons.info aria-hidden />
        Interfaces shown are concept examples of what we build, not client projects.
      </p>
    </div>
  );
}

function ServiceCard({ service, features }: { service: Service; features?: boolean }) {
  return (
    <Link
      href={`/services#${service.slug}`}
      className="surface group flex h-full flex-col overflow-hidden rounded-xl transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:border-accent-border hover:shadow-popover motion-reduce:hover:translate-y-0"
    >
      <ServicePreview icon={service.icon} className={cn("border-b border-border", !features && "aspect-[4/3]")} />
      <div className="flex flex-1 flex-col p-6">
        <IconBadge name={service.icon} size="md" />
        <h3 className="mt-4 text-lg font-semibold">{service.name}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">{service.summary}</p>
        {features && service.features.length > 0 && (
          <ul className="mt-4 grid gap-x-4 gap-y-2 sm:grid-cols-2">
            {service.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <Icons.success className="text-accent" aria-hidden /> {f}
              </li>
            ))}
          </ul>
        )}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
          Learn more
          <Icons.forward className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
