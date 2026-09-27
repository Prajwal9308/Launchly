import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ClientAction } from "@/domain/next-action";
import { cn } from "@/lib/utils";

/** Prominent "action required" callout for clients. */
export function ActionCenter({ action, className }: { action: ClientAction; className?: string }) {
  if (!action.required) {
    return (
      <div className={cn("flex items-start gap-3 rounded-xl border border-border bg-background p-4", className)}>
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
      className={cn("rounded-xl border border-accent-border bg-accent-subtle/70 p-4 sm:p-5", className)}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Action required</p>
      <div className="mt-1.5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[15px] font-semibold text-foreground">{action.title}</p>
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
