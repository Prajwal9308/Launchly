import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ClientAction } from "@/domain/next-action";
import { cn } from "@/lib/utils";

/** Prominent "action required" callout for clients. */
export function ActionCenter({ action, className }: { action: ClientAction; className?: string }) {
  if (!action.required) {
    return (
      <div className={cn("surface-muted flex items-start gap-3 rounded-2xl p-5", className)}>
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
        "relative overflow-hidden rounded-2xl border border-accent-border bg-accent-subtle p-5 sm:p-6",
        className,
      )}
    >
      <p className="relative flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
        <span className="size-1.5 rounded-full bg-accent" aria-hidden />
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
