import { PROCESS_STEPS } from "@/content/process";

/** Five steps in a single row on desktop, stacked on small screens. */
export function ProcessSteps() {
  return (
    <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
      {PROCESS_STEPS.map((step, i) => (
        <li key={step.number} className="relative border-t-2 border-border pt-5 lg:pr-6">
          <span aria-hidden className={i === 0 ? "absolute -top-0.5 left-0 h-0.5 w-12 bg-accent" : "hidden"} />
          <p className="font-mono text-xs font-medium text-accent">{step.number}</p>
          <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
