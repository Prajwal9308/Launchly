import { IconTile, Icons } from "@/components/ui/icons";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ClientAction } from "@/domain/next-action";
import { cn } from "@/lib/utils";

/** Prominent "action required" callout for clients. */
export function ActionCenter({ action, className }: { action: ClientAction; className?: string }) {
  if (!action.required) {
    return (
      <div className={cn("surface-muted flex items-center gap-4 rounded-2xl p-5", className)}>
        <IconTile icon={Icons.success} tone="success" />
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
        "relative isolate overflow-hidden rounded-2xl border border-accent-border bg-accent-subtle p-5 sm:p-6",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 -z-10 size-48 rounded-full bg-accent-2/15 blur-3xl" />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <IconTile icon={Icons.notifications} tone="solid" />
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">Action required</p>
            <p className="mt-1 text-lg font-semibold text-foreground">{action.title}</p>
            <p className="mt-0.5 text-sm text-muted">{action.description}</p>
          </div>
        </div>
        <Button asChild className="shrink-0">
          <Link href={action.href}>
            {action.cta} <Icons.forward aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}
