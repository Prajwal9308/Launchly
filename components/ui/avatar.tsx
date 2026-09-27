import { cn, initials } from "@/lib/utils";

export function Avatar({
  firstName,
  lastName,
  className,
  tone = "neutral",
}: {
  firstName?: string | null;
  lastName?: string | null;
  className?: string;
  tone?: "neutral" | "accent";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 select-none items-center justify-center rounded-full text-xs font-semibold",
        tone === "accent" ? "bg-accent text-white" : "bg-subtle text-muted ring-1 ring-border",
        className,
      )}
    >
      {initials(firstName, lastName)}
    </span>
  );
}
