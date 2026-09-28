import { cn } from "@/lib/utils";

/**
 * Project completion as a ring: a light track, an accent arc, and the
 * percentage large in the centre. Progress is always derived
 * from real project state (see domain/progress.ts).
 */
export function ProgressRing({ value, label, size = 168, className }: { value: number; label?: string; size?: number; className?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative shrink-0", className)} style={{ width: size, height: size }} role="img" aria-label={`${label ?? "Progress"}: ${v}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ea6a1f" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-subtle)" strokeWidth={stroke} />
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
          className="transition-[stroke-dashoffset] duration-1000 ease-[var(--ease-out-soft)]"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-semibold tabular-nums tracking-tight">{v}%</span>
        {label && <span className="mt-1 text-xs text-faint">{label}</span>}
      </div>
    </div>
  );
}
