import { Check } from "lucide-react";
import type { PhaseState } from "@/domain/progress";
import { cn } from "@/lib/utils";

interface Phase {
  key: string;
  label: string;
  state: PhaseState;
}

/** Vertical phase timeline: ✓ complete, ● current, ○ upcoming. */
export function ProjectProgress({ phases, onHold }: { phases: Phase[]; onHold?: boolean }) {
  return (
    <ol className="space-y-0" aria-label="Project phases">
      {phases.map((phase, index) => {
        const last = index === phases.length - 1;
        return (
          <li key={phase.key} className="relative flex gap-3 pb-4 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn("absolute left-[9px] top-6 h-[calc(100%-1.25rem)] w-px", phase.state === "complete" ? "bg-accent/40" : "bg-border")}
              />
            )}
            <span
              aria-hidden
              className={cn(
                "relative z-10 mt-0.5 flex size-[19px] shrink-0 items-center justify-center rounded-full border",
                phase.state === "complete" && "border-accent bg-accent text-white",
                phase.state === "current" && "border-accent bg-background",
                phase.state === "upcoming" && "border-border-strong bg-background",
              )}
            >
              {phase.state === "complete" && <Check className="size-3" strokeWidth={3} />}
              {phase.state === "current" && <span className={cn("size-2 rounded-full", onHold ? "bg-faint" : "bg-accent")} />}
            </span>
            <span
              className={cn(
                "text-sm",
                phase.state === "complete" && "text-muted",
                phase.state === "current" && "font-medium text-foreground",
                phase.state === "upcoming" && "text-faint",
              )}
            >
              {phase.label}
              <span className="sr-only">
                {phase.state === "complete" ? " (complete)" : phase.state === "current" ? " (in progress)" : " (upcoming)"}
              </span>
              {phase.state === "current" && onHold && <span className="ml-2 text-xs text-faint">On hold</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/** Compact horizontal variant for cards and headers. */
export function PhaseStrip({ phases }: { phases: Phase[] }) {
  return (
    <div className="flex gap-1" aria-hidden>
      {phases.map((p) => (
        <span
          key={p.key}
          title={p.label}
          className={cn("h-1 flex-1 rounded-full", p.state === "complete" ? "bg-accent" : p.state === "current" ? "bg-accent/40" : "bg-subtle")}
        />
      ))}
    </div>
  );
}
