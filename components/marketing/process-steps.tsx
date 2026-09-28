import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PROCESS_STEPS } from "@/content/process";

/**
 * Five steps joined by a thin connector: a vertical rail on small screens,
 * a single row on desktop.
 */
export function ProcessSteps({ headingLevel = "h3" }: { headingLevel?: "h2" | "h3" }) {
  const Title = headingLevel;
  const last = PROCESS_STEPS.length - 1;
  return (
    <RevealGroup as="ol" className="grid gap-8 lg:grid-cols-5 lg:gap-6">
      {PROCESS_STEPS.map((step, i) => (
        <RevealItem as="li" key={step.number} className="relative pl-12 lg:pl-0">
          {i < last && (
            <span
              aria-hidden
              className="absolute bottom-[-2rem] left-4 top-10 w-px bg-border-strong lg:bottom-auto lg:left-11 lg:right-[-1.5rem] lg:top-4 lg:h-px lg:w-auto"
            />
          )}
          <span className="absolute left-0 top-0 flex size-8 items-center justify-center rounded-full border border-accent-border bg-accent-subtle font-mono text-xs font-semibold text-accent lg:static">
            {step.number}
          </span>
          <Title className="pt-1 text-base font-semibold lg:mt-5 lg:pt-0 lg:text-lg">{step.title}</Title>
          <p className="mt-1.5 text-sm leading-relaxed text-muted lg:mt-2">{step.description}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
