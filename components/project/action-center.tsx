import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ClientAction } from "@/domain/next-action";
import { cn } from "@/lib/utils";

/** Prominent "action required" callout for clients. */
export function ActionCenter({ action, className }: { action: ClientAction; className?: string }) {
  if (!action.required) {
    return (
      <div className={cn("glass-recessed flex items-start gap-3 rounded-2xl p-5", className)}>
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
        <div>
          <p className="text-sm font-medium">{action.title}</p>
          <p className="mt-0.5 text-sm text-muted">{action.description}</p>
        </div>
      </div>
    );
  }
  return (
    <section
      aria-label="Action required"
      className={cn(
        "glass-elevated relative overflow-hidden rounded-2xl !border-accent/40 p-5 sm:p-6",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute -left-10 top-1/2 size-40 -translate-y-1/2 rounded-full bg-accent/35 blur-3xl" />
      <p className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-accent/70 [animation-duration:2s]" />
          <span className="relative size-2 rounded-full bg-accent" />
        </span>
        Action required
      </p>
      <div className="relative mt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">{action.title}</p>
          <p className="mt-0.5 text-sm text-muted">{action.description}</p>
        </div>
        <Button asChild className="shrink-0">
          <Link href={action.href}>
            {action.cta} <ArrowRight aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
