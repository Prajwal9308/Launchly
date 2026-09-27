import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { controlClasses } from "./input";

/** Native select: accessible, keyboard friendly and uses the OS picker on mobile. */
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(controlClasses, "h-9 appearance-none pl-3 pr-9")} {...props}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
    </div>
  );
}
