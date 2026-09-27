import Link from "next/link";
import { cn } from "@/lib/utils";

export function StatCard({ label, value, href, hint }: { label: string; value: number; href?: string; hint?: string }) {
  const content = (
    <>
      <p className="text-xs font-medium text-faint">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-faint">{hint}</p>}
    </>
  );
  const classes = "block rounded-xl border border-border bg-background px-4 py-3.5 shadow-card";
  return href ? (
    <Link href={href} className={cn(classes, "transition-colors hover:border-border-strong")}>
      {content}
    </Link>
  ) : (
    <div className={classes}>{content}</div>
  );
}
