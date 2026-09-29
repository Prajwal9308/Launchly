import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SOLUTIONS } from "@/content/solutions";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./arrow-link";
import { IconBadge } from "./icons";
import { SolutionShowcase } from "./mockups/compositions";

/**
 * Categories of work ViperByte builds — capabilities, not past projects.
 * Each category is shown on real-looking devices running a concept interface,
 * tagged "Concept example" so it is never mistaken for client work.
 */

/**
 * Solutions page: open product showcases rather than cards, with text and
 * visual alternating sides on desktop so the page has rhythm as it scrolls.
 */
export function WhatWeBuild() {
  return (
    <div className="divide-y divide-border">
      {SOLUTIONS.map((item, i) => (
        <article
          key={item.slug}
          id={item.slug}
          className="grid scroll-mt-24 items-center gap-8 py-12 first:pt-0 last:pb-0 sm:py-16 md:grid-cols-2 md:gap-12 lg:gap-16"
        >
          <Reveal as="figure" className={cn(i % 2 === 0 && "md:order-2")}>
            <SolutionShowcase slug={item.slug} className="rounded-2xl border border-border" />
            <figcaption className="mt-3 flex items-center gap-2 text-xs text-faint">
              <Icons.info aria-hidden /> Concept example, not a client project
            </figcaption>
          </Reveal>
          <Reveal>
            <IconBadge name={item.icon} size="md" />
            <h2 className="mt-5 text-[1.5rem] font-semibold leading-tight sm:text-[1.75rem]">{item.title}</h2>
            <p className="mt-3 max-w-lg text-base leading-relaxed text-muted">{item.description}</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2" aria-label={`${item.title} examples`}>
              {item.examples.map((example) => (
                <li key={example} className="flex items-center gap-2 text-[15px] text-foreground">
                  <Icons.success className="text-accent" aria-hidden /> {example}
                </li>
              ))}
            </ul>
            <ArrowLink href="/contact" className="mt-7">
              Discuss your project<span className="sr-only">: {item.title}</span>
            </ArrowLink>
          </Reveal>
        </article>
      ))}
    </div>
  );
}

/** Homepage: every category at a glance, as a hairline grid linking to its showcase. */
export function SolutionsOverview() {
  return (
    <RevealGroup as="ul" className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {SOLUTIONS.map((item) => (
        <RevealItem as="li" key={item.slug} className="bg-background">
          <Link
            href={`/solutions#${item.slug}`}
            className="group flex h-full flex-col p-6 transition-colors hover:bg-canvas focus-visible:bg-canvas focus-visible:outline-offset-[-2px] sm:p-7"
          >
            <IconBadge name={item.icon} size="md" />
            <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-muted">{item.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
              See an example
              <Icons.forward className="transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" aria-hidden />
            </span>
          </Link>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
