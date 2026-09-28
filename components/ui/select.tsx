import { Icons } from "@/components/ui/icons";
import * as React from "react";
import { cn } from "@/lib/utils";
import { controlClasses } from "./input";

/** Native select: accessible, keyboard friendly and uses the OS picker on mobile. */
export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(controlClasses, "h-10 appearance-none pl-3 pr-9")} {...props}>
        {children}
      </select>
      <Icons.chevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
    </div>
  );
}
