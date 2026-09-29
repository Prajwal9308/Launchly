import { Icons } from "@/components/ui/icons";
import Image from "next/image";
import { HoverLift } from "@/components/ui/hover-lift";
import type { PortfolioItem } from "@/db/types";

export function PortfolioCard({ item }: { item: PortfolioItem }) {
  return (
    <HoverLift className="h-full rounded-2xl">
    <article className="surface group flex h-full flex-col overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-canvas">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={`Preview of ${item.title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            unoptimized={item.imageUrl.endsWith(".svg")}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-faint">
            <Icons.imageMissing className="size-6" aria-hidden />
            No preview available
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
        <p className="flex items-center gap-1.5 text-xs font-medium text-faint">
          <Icons.business aria-hidden /> {item.industry}
        </p>
        <h3 className="mt-1 text-[15px] font-semibold">{item.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-muted">{item.description}</p>
        {item.services.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Services">
            {item.services.map((s) => (
              <li key={s} className="rounded-md border border-border bg-canvas px-2 py-0.5 text-xs text-muted">
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
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            Visit Website <span className="sr-only">for {item.title}</span> <Icons.external aria-hidden />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
    </HoverLift>
  );
}
