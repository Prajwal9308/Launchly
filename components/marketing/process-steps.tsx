import { PROCESS_STEPS } from "@/content/process";

export function ProcessSteps() {
  return (
    <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {PROCESS_STEPS.map((step) => (
        <li key={step.number} className="border-t border-border pt-5">
          <p className="font-mono text-xs font-medium text-accent">{step.number}</p>
          <h3 className="mt-2 text-[15px] font-semibold">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
