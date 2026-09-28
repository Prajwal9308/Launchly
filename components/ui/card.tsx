import * as React from "react";
import { cn } from "@/lib/utils";

const LEVELS = {
  /** Supporting information — sits back in the scene. */
  recessed: "surface-muted",
  /** Standard floating panel. */
  default: "surface",
  /** Primary content — nearest to the viewer. */
  elevated: "surface-raised",
} as const;

export function Card({ className, level = "default", ...props }: React.HTMLAttributes<HTMLDivElement> & { level?: keyof typeof LEVELS }) {
  return <div className={cn("rounded-2xl", LEVELS[level], className)} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-4 px-6 pt-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-muted", className)} {...props} />;
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6 py-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-center gap-2 border-t border-border px-6 py-3", className)} {...props} />;
}
