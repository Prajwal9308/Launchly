import * as React from "react";
import { cn } from "@/lib/utils";

export const controlClasses =
  "w-full rounded-md border border-white/10 bg-white/[0.04] text-sm text-foreground shadow-[inset_0_1px_2px_rgb(0_0_0/0.35)] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-faint hover:border-white/18 focus-visible:border-accent/70 focus-visible:bg-white/[0.06] focus-visible:shadow-[0_0_0_4px_rgb(111_134_255/0.14),inset_0_1px_2px_rgb(0_0_0/0.35)] focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-subtle disabled:opacity-70 aria-invalid:border-danger aria-invalid:focus-visible:outline-danger/20";

export function Input({ className, type = "text", ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input type={type} className={cn(controlClasses, "h-10 px-3", className)} {...props} />;
}
