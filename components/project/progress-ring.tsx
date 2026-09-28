import { cn } from "@/lib/utils";

/**
 * Project completion as a lit ring: a faint track, a gradient arc with a soft
 * glow, and the percentage large in the centre. Progress is always derived
 * from real project state (see domain/progress.ts).
 */
export function ProgressRing({ value, label, size = 168, className }: { value: number; label?: string; size?: number; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Progress"}: ${v}%`}>
      <div aria-hidden className="absolute inset-[18%] rounded-full bg-accent/25 blur-2xl" />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a8b6ff" />
            <stop offset="100%" stopColor="#5a70ee" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgb(255 255 255 / 0.07)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#ring-grad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - v / 100)}
          className="drop-shadow-[0_0_10px_rgb(111_134_255/0.75)] transition-[stroke-dashoffset] duration-1000 ease-[var(--ease-out-soft)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lit text-4xl font-semibold tabular-nums tracking-tight">{v}%</span>
        {label && <span className="mt-1 text-xs text-faint">{label}</span>}
      </div>
    </div>
  );
}
