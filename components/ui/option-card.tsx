import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

interface OptionCardProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  type: "checkbox" | "radio";
  label: string;
  description?: string;
}

/**
 * Selectable card backed by a native checkbox/radio (keyboard + screen reader
 * friendly). Used for questionnaire choices.
 */
export function OptionCard({ type, label, description, className, ...props }: OptionCardProps) {
  return (
    <label
      className={cn(
        "group relative flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-background px-3.5 py-3 text-sm transition-colors hover:border-border-strong has-[:checked]:border-accent has-[:checked]:bg-accent-subtle/60 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
        className,
      )}
    >
      <input type={type} className="peer sr-only" {...props} />
      <span
        aria-hidden
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center border border-border-strong bg-background text-transparent transition-colors peer-checked:border-accent peer-checked:bg-accent peer-checked:text-white",
          type === "radio" ? "rounded-full" : "rounded-sm",
        )}
      >
        {type === "checkbox" ? <Check className="size-3" strokeWidth={3} /> : <span className="size-1.5 rounded-full bg-current" />}
      </span>
      <span className="min-w-0">
        <span className="block font-medium text-foreground">{label}</span>
        {description && <span className="mt-0.5 block text-xs leading-relaxed text-muted">{description}</span>}
      </span>
    </label>
  );
}
