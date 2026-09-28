import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { HoverLift } from "@/components/ui/hover-lift";
import { cn } from "@/lib/utils";

/**
 * A metric tile. `emphasis` lifts it (and lights it when the value needs
 * attention); `recessed` pushes supporting metrics back in the scene.
 */
export function StatCard({
  label,
  value,
  href,
  hint,
  emphasis,
  recessed,
  icon: Icon,
}: {
  label: string;
  value: number;
  href?: string;
  hint?: string;
  emphasis?: boolean;
  recessed?: boolean;
  icon?: LucideIcon;
}) {
  const lit = emphasis && value > 0;
  const content = (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl px-5 py-4",
        recessed ? "surface-muted" : "surface",
        lit && "!border-accent-border !bg-accent-subtle",
      )}
    >
      <div className="relative flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-faint">{label}</p>
        {Icon && (
          <span
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-lg",
              lit ? "bg-accent text-accent-foreground" : "bg-accent-subtle text-accent",
            )}
          >
            <Icon className="size-4" aria-hidden />
          </span>
        )}
      </div>
      <div className="relative mt-3 flex items-end justify-between gap-2">
        <p className={cn("font-semibold tabular-nums tracking-tight", recessed ? "text-2xl" : "text-3xl", lit ? "text-foreground" : "")}>{value}</p>
        {lit && <span className="mb-1.5 size-2 rounded-full bg-accent" aria-hidden />}
      </div>
      {hint && <p className="relative mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
  if (!href) return content;
  return (
    <HoverLift className="h-full rounded-2xl">
      <Link href={href} className="block h-full rounded-2xl">
        {content}
      </Link>
    </HoverLift>
  );
}
