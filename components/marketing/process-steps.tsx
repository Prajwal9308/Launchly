import { PROCESS_STEPS } from "@/content/process";

/** The six steps as a lit timeline: glowing nodes on a single line. */
export function ProcessSteps() {
  return (
    <ol className="relative grid gap-10 lg:grid-cols-6 lg:gap-6">
      <div aria-hidden className="absolute left-[19px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/60 via-white/10 to-transparent lg:inset-x-6 lg:bottom-auto lg:left-0 lg:top-[19px] lg:h-px lg:w-auto lg:bg-gradient-to-r" />
      {PROCESS_STEPS.map((step, i) => (
        <li key={step.number} className="relative flex gap-5 lg:block">
          <span
            className={
              "relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-medium backdrop-blur-md " +
              (i === 0
                ? "border-accent/60 bg-accent-subtle text-foreground shadow-[0_0_24px_rgb(111_134_255/0.6)]"
                : "border-white/15 bg-surface text-muted")
            }
          >
            {step.number}
          </span>
          <div className="lg:mt-6">
            <h3 className="text-base font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
