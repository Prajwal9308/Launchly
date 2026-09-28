import * as React from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
  /** Kept for compatibility; sections sit directly on the atmosphere now. */
  tone?: "default" | "muted";
}) {
  return (
    <section id={id} className={cn("relative py-16 sm:py-24", className)}>
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
      {eyebrow && (
        <p className={cn("inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-accent", align === "center" && "justify-center")}>
          <span className="h-px w-6 bg-gradient-to-r from-transparent to-accent" aria-hidden />
          {eyebrow}
        </p>
      )}
      <Heading
        className={cn(
          "text-lit mt-4 font-semibold",
          Heading === "h1" ? "text-4xl leading-[1.04] sm:text-6xl" : "text-3xl leading-[1.08] sm:text-5xl",
        )}
      >
        {title}
      </Heading>
      {description && <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </div>
  );
}

/** Page intro used on inner marketing pages. */
export function PageHero({ eyebrow, title, description, children }: { eyebrow?: string; title: string; description?: string; children?: React.ReactNode }) {
  return (
    <div className="relative isolate overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.05)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_70%_80%_at_20%_0%,black,transparent_70%)]"
      />
      <div className="container-page animate-rise pb-12 pt-20 sm:pb-16 sm:pt-28">
        <SectionHeader as="h1" eyebrow={eyebrow} title={title} description={description} />
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
