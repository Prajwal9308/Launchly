import { SOLUTIONS } from "@/content/solutions";
import { NamedIcon } from "./icons";

/** Categories of work PrimeTechLabs builds — capabilities, not past projects. */
export function WhatWeBuild({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {SOLUTIONS.map((item) => (
        <article key={item.slug} id={item.slug} className="surface scroll-mt-24 rounded-2xl p-7">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-canvas text-foreground">
              <NamedIcon name={item.icon} className="size-5" />
            </span>
            <h3 className="text-lg font-semibold">{item.title}</h3>
          </div>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">{item.description}</p>
          <ul className={detailed ? "mt-5 grid gap-2 sm:grid-cols-2" : "mt-5 flex flex-wrap gap-2"} aria-label={`${item.title} examples`}>
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
        </article>
      ))}
    </div>
  );
}
