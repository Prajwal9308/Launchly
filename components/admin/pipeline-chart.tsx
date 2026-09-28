"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Stage {
  key: string;
  label: string;
  count: number;
}

/**
 * Projects per pipeline stage. Single series, so no legend (the panel title
 * names it). Thin columns with 4px rounded ends grow from one baseline;
 * values appear on hover/focus, and a table carries them for assistive tech.
 */
export function PipelineChart({ stages }: { stages: Stage[] }) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(1, ...stages.map((s) => s.count));
  // Nice top tick: smallest of 2/4/5/10/... multiples at or above max.
  const step = max <= 4 ? 1 : max <= 10 ? 2 : Math.ceil(max / 5);
  const top = Math.ceil(max / step) * step;
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step);
  const total = stages.reduce((sum, s) => sum + s.count, 0);

  if (total === 0) {
    return <p className="py-16 text-center text-sm text-muted">No data yet. Projects appear here as clients submit them.</p>;
  }

  return (
    <figure>
      <div className="relative grid h-56 grid-cols-[1.75rem_1fr] gap-2">
        {/* y-axis */}
        <div className="relative text-[11px] tabular-nums text-faint" aria-hidden>
          {ticks.map((t) => (
            <span key={t} className="absolute right-0 -translate-y-1/2" style={{ bottom: `${(t / top) * 100}%` }}>
              {t}
            </span>
          ))}
        </div>
        <div className="relative">
          {/* hairline grid */}
          {ticks.map((t) => (
            <div key={t} aria-hidden className="absolute inset-x-0 h-px bg-border" style={{ bottom: `${(t / top) * 100}%` }} />
          ))}
          <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
            {stages.map((stage) => {
              const h = (stage.count / top) * 100;
              const isActive = active === stage.key;
              return (
                <button
                  key={stage.key}
                  type="button"
                  onMouseEnter={() => setActive(stage.key)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(stage.key)}
                  onBlur={() => setActive(null)}
                  aria-label={`${stage.label}: ${stage.count} project${stage.count === 1 ? "" : "s"}`}
                  className="group relative flex h-full items-end justify-center rounded-md outline-none focus-visible:bg-background"
                >
                  {/* column: ≤24px, rounded data-end, square at the baseline */}
                  <span
                    className={cn(
                      "relative w-full max-w-6 rounded-t-[4px] bg-accent transition-[height,background-color] duration-700 ease-[var(--ease-out-soft)]",
                      stage.count === 0 && "bg-subtle",
                      isActive ? "bg-accent-hover" : "",
                    )}
                    style={{ height: stage.count ? `${h}%` : "2px" }}
                  />
                  {isActive && (
                    <span className="surface-overlay pointer-events-none absolute left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs" style={{ bottom: `calc(${Math.max(h, 2)}% + 10px)` }}>
                      <span className="text-muted">{stage.label}</span> <span className="font-semibold text-foreground">{stage.count}</span>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* x-axis labels */}
      <div className="mt-3 grid grid-cols-[1.75rem_1fr] gap-2" aria-hidden>
        <span />
        <div className="grid text-center text-[11px] text-faint" style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}>
          {stages.map((s) => (
            <span key={s.key} className={cn("truncate transition-colors", active === s.key && "text-foreground")}>
              {s.label}
            </span>
          ))}
        </div>
      </div>
      <table className="sr-only">
        <caption>Projects by stage</caption>
        <thead>
          <tr>
            <th scope="col">Stage</th>
            <th scope="col">Projects</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((s) => (
            <tr key={s.key}>
              <th scope="row">{s.label}</th>
              <td>{s.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
