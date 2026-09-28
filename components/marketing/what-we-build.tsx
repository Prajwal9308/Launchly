import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SOLUTIONS } from "@/content/solutions";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { NamedIcon } from "./icons";
import { SolutionShowcase } from "./mockups/compositions";

/**
 * Categories of work PrimeTechLabs builds — capabilities, not past projects.
 * Each category is shown on real-looking devices running a concept interface,
 * tagged "Concept example" so it is never mistaken for client work.
 * `detailed` is the standalone Solutions page (h2 headings, alternating rows).
 */
export function WhatWeBuild({ detailed = false }: { detailed?: boolean }) {
  const Title = detailed ? "h2" : "h3";
  return (
    <RevealGroup className={detailed ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
      {SOLUTIONS.map((item, i) => (
        <RevealItem
          as="article"
          key={item.slug}
          id={item.slug}
          className={cn("surface grid scroll-mt-24 overflow-hidden rounded-2xl", detailed && "md:grid-cols-[1.15fr_1fr]")}
        >
          <div className={cn("relative border-b border-border", detailed && "md:border-b-0", detailed && (i % 2 === 1 ? "md:order-2 md:border-l" : "md:border-r"))}>
            <SolutionShowcase slug={item.slug} className="h-full" />
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-2.5 py-1 text-xs font-medium text-muted backdrop-blur">
              <Icons.design className="text-accent" aria-hidden /> Concept example
            </span>
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <Title className="flex items-center gap-2.5 text-xl font-semibold sm:text-2xl">
              <NamedIcon name={item.icon} className="text-accent" />
              {item.title}
            </Title>
            <p className="mt-3 text-[15px] leading-relaxed text-muted">{item.description}</p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2" aria-label={`${item.title} examples`}>
              {item.examples.map((example) => (
                <li key={example} className="flex items-center gap-2 text-sm text-muted">
                  <Icons.success className="text-accent" aria-hidden /> {example}
                </li>
              ))}
            </ul>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
