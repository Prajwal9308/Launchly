import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { SOLUTIONS } from "@/content/solutions";
import { NamedIcon } from "./icons";
import { SolutionSketch } from "./solution-sketch";

/** Categories of work PrimeTechLabs builds — capabilities, not past projects. */
/** `detailed` is the standalone Solutions page, where each category is a top-level (h2) heading. */
export function WhatWeBuild({ detailed = false }: { detailed?: boolean }) {
  const Title = detailed ? "h2" : "h3";
  return (
    <RevealGroup className="grid gap-4 sm:grid-cols-2">
      {SOLUTIONS.map((item) => (
        <RevealItem as="article" key={item.slug} id={item.slug} className="surface flex scroll-mt-24 flex-col overflow-hidden rounded-2xl">
          <SolutionSketch slug={item.slug} />
          <div className="flex flex-1 flex-col p-6 sm:p-7">
            <div className="flex items-center gap-2.5">
              <NamedIcon name={item.icon} className="size-[18px] text-accent" />
              <Title className="text-lg font-semibold">{item.title}</Title>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-muted">{item.description}</p>
            <ul className={detailed ? "mt-5 grid gap-2 sm:grid-cols-2" : "mt-5 flex flex-wrap gap-1.5"} aria-label={`${item.title} examples`}>
              {item.examples.map((example) =>
                detailed ? (
                  <li key={example} className="flex items-center gap-2 text-sm text-muted">
                    <span className="size-1.5 rounded-full bg-accent" aria-hidden /> {example}
                  </li>
                ) : (
                  <li key={example} className="rounded-md border border-border bg-canvas px-2.5 py-1 text-xs text-muted">
                    {example}
                  </li>
                ),
              )}
            </ul>
          </div>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
