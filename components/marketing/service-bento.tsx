import { ArrowUpRight, Check } from "lucide-react";
import Link from "next/link";
import type { Service } from "@/db/types";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";
import { NamedIcon } from "./icons";

/**
 * Homepage services as an asymmetric bento: one primary (elevated) service,
 * two standard panels, then supporting services on recessed glass.
 */
export function ServiceBento({ services }: { services: Service[] }) {
  if (!services.length) {
    return <p className="text-sm text-muted">Service details are coming soon. Get in touch to discuss your project.</p>;
  }
  const [lead, ...rest] = services.slice(0, 6);
  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Tilt className="rounded-3xl lg:col-span-6 lg:row-span-2" max={4}>
        <Link href={`/services#${lead.slug}`} className="glass-elevated relative flex h-full min-h-80 flex-col overflow-hidden rounded-3xl p-8 sm:p-10">
          <div aria-hidden className="absolute -right-16 -top-16 size-64 rounded-full bg-accent/25 blur-3xl" />
          <div className="relative flex size-14 items-center justify-center rounded-2xl border border-accent-border bg-accent-subtle text-accent shadow-[0_0_40px_-8px_rgb(111_134_255/0.7)]">
            <NamedIcon name={lead.icon} className="size-6" />
          </div>
          <h3 className="relative mt-8 text-2xl font-semibold sm:text-3xl">{lead.name}</h3>
          <p className="relative mt-3 max-w-md text-base leading-relaxed text-muted">{lead.summary}</p>
          {lead.features.length > 0 && (
            <ul className="relative mt-6 grid gap-2 sm:grid-cols-2">
              {lead.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-muted">
                  <Check className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden /> {f}
                </li>
              ))}
            </ul>
          )}
          <span className="relative mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-foreground">
            Explore services <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/tilt:-translate-y-0.5 group-hover/tilt:translate-x-0.5" aria-hidden />
          </span>
        </Link>
      </Tilt>
      {rest.map((service, i) => (
        <Tilt key={service.id} className={cn("rounded-3xl", i < 2 ? "lg:col-span-6" : "lg:col-span-4")} max={5}>
          <Link
            href={`/services#${service.slug}`}
            className={cn("flex h-full flex-col rounded-3xl p-7", i < 2 ? "glass" : "glass-recessed transition-colors hover:bg-white/[0.04]")}
          >
            <div className="flex items-start justify-between">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-accent">
                <NamedIcon name={service.icon} className="size-5" />
              </div>
              <ArrowUpRight
                className="size-4 text-faint opacity-0 transition-all duration-300 group-hover/tilt:-translate-y-0.5 group-hover/tilt:translate-x-0.5 group-hover/tilt:text-foreground group-hover/tilt:opacity-100"
                aria-hidden
              />
            </div>
            <h3 className="mt-6 text-lg font-semibold">{service.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{service.summary}</p>
          </Link>
        </Tilt>
      ))}
    </div>
  );
}
