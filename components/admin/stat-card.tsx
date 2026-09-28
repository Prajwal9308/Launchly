import Link from "next/link";
import { Tilt } from "@/components/ui/tilt";
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
}: {
  label: string;
  value: number;
  href?: string;
  hint?: string;
  emphasis?: boolean;
  recessed?: boolean;
}) {
  const lit = emphasis && value > 0;
  const content = (
    <div
      className={cn(
        "relative flex h-full flex-col justify-between overflow-hidden rounded-2xl px-5 py-4",
        recessed ? "glass-recessed" : "glass",
        lit && "!border-accent/40",
      )}
    >
      {lit && <div aria-hidden className="absolute -right-10 -top-10 size-32 rounded-full bg-accent/30 blur-2xl" />}
      <p className="relative text-xs font-medium text-faint">{label}</p>
      <div className="relative mt-3 flex items-end justify-between gap-2">
        <p className={cn("font-semibold tabular-nums tracking-tight", recessed ? "text-2xl" : "text-3xl", lit ? "text-foreground" : "text-lit")}>{value}</p>
        {lit && <span className="mb-1 size-2 rounded-full bg-accent shadow-[0_0_10px_rgb(111_134_255)]" aria-hidden />}
      </div>
      {hint && <p className="relative mt-1 text-xs text-faint">{hint}</p>}
    </div>
  );
  if (!href) return content;
  return (
    <Tilt className="h-full rounded-2xl" max={5}>
      <Link href={href} className="block h-full rounded-2xl">
        {content}
      </Link>
    </Tilt>
  );
}
