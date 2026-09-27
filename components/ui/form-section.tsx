import * as React from "react";
import { cn } from "@/lib/utils";

/** Two-column settings-style form section (stacks on mobile). */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("grid gap-6 py-8 first:pt-0 md:grid-cols-[16rem_1fr] md:gap-10", className)}>
      <div>
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="mt-1 text-sm leading-relaxed text-muted">{description}</p>}
      </div>
      <div className="min-w-0 space-y-5">{children}</div>
    </section>
  );
}
