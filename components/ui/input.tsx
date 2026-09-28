import * as React from "react";
import { cn } from "@/lib/utils";

export const controlClasses =
  "w-full rounded-md border border-border-strong/80 bg-background text-sm text-foreground shadow-xs transition-[border-color,box-shadow] duration-150 placeholder:text-faint hover:border-border-strong focus-visible:border-accent focus-visible:shadow-[0_0_0_3px_var(--color-accent-subtle)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-subtle disabled:opacity-70 aria-invalid:border-danger aria-invalid:focus-visible:outline-danger/20";

export function Input({ className, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type={type} className={cn(controlClasses, "h-10 px-3", className)} {...props} />;
}
