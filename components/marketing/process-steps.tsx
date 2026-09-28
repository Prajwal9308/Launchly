import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { PROCESS_STEPS } from "@/content/process";
import { IconBadge } from "./icons";

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
        <RevealItem as="li" key={step.number} className="relative pl-14 lg:pl-0">
          {i < last && (
            <span
              aria-hidden
              className="absolute bottom-[-2rem] left-5 top-12 w-px bg-border-strong lg:bottom-auto lg:left-12 lg:right-[-1.5rem] lg:top-5 lg:h-px lg:w-auto"
            />
          )}
          <IconBadge name={step.icon} size="md" className="absolute left-0 top-0 lg:static" />
          <p className="font-mono text-xs font-medium text-accent lg:mt-5">{step.number}</p>
          <Title className="mt-1 text-base font-semibold lg:text-lg">{step.title}</Title>
          <p className="mt-1.5 text-sm leading-relaxed text-muted lg:mt-2">{step.description}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
