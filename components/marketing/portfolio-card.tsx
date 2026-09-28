import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Tilt } from "@/components/ui/tilt";
import type { PortfolioItem } from "@/db/types";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <Tilt className="h-full rounded-3xl" max={5}>
    <article className="glass group flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="relative m-2 aspect-[16/10] overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={`Preview of ${item.title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
            unoptimized={item.imageUrl.endsWith(".svg")}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-faint">No preview</div>
        )}
        {item.isDemo && (
          <span className="glass-overlay absolute left-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-medium text-muted">
            Sample project
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-3">
        <p className="text-xs font-medium text-faint">{item.industry}</p>
        <h3 className="mt-1 text-[15px] font-semibold">{item.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">{item.description}</p>
        {item.services.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Services">
            {item.services.map((s) => (
              <li key={s} className="rounded-md border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-xs text-muted">
                {s}
              </li>
            ))}
          </ul>
        )}
        {item.url && !item.isDemo && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Visit website <ArrowUpRight className="size-3.5" aria-hidden />
          </a>
        )}
      </div>
    </article>
    </Tilt>
  );
}

export function DemoWorkNotice() {
  return (
    <p className="text-sm text-muted">
      Projects marked <span className="font-medium text-foreground">Sample project</span> are fictional concepts created to
      demonstrate our design approach. They are not client work.
    </p>
  );
}
