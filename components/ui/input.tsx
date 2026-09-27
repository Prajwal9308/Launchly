import * as React from "react";
import { cn } from "@/lib/utils";

export const controlClasses =
  "w-full rounded-md border border-border-strong/80 bg-background text-sm text-foreground shadow-xs transition-colors placeholder:text-faint hover:border-border-strong focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent/25 disabled:cursor-not-allowed disabled:bg-subtle disabled:opacity-70 aria-invalid:border-danger aria-invalid:focus-visible:outline-danger/20";

export function Input({ className, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type={type} className={cn(controlClasses, "h-9 px-3", className)} {...props} />;
}
