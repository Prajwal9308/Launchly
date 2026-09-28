import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Gentle hover movement for interactive cards: a 2px lift. No 3D, no glare. */
export function HoverLift({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("transition-transform duration-200 ease-out hover:-translate-y-0.5 motion-reduce:hover:translate-y-0", className)}>{children}</div>;
}
