import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
  tone = "default",
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <section id={id} className={cn("py-20 sm:py-28", tone === "muted" && "bg-canvas", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-accent">{eyebrow}</p>}
      <Heading
        className={cn(
          "mt-3 font-semibold text-foreground",
          Heading === "h1" ? "text-4xl leading-[1.05] sm:text-5xl" : "text-3xl leading-tight sm:text-4xl",
        )}
      >
        {title}
      </Heading>
      {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

/** Page intro used on inner marketing pages. */
export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:56px_56px] opacity-60 [mask-image:radial-gradient(ellipse_70%_80%_at_20%_0%,black,transparent_70%)]"
      />
      <div className="container-page py-20 sm:py-24">
        <SectionHeader as="h1" eyebrow={eyebrow} title={title} description={description} />
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
