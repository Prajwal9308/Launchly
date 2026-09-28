import * as React from "react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { ArrowLink } from "./arrow-link";

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
    <section id={id} className={cn("scroll-mt-20 py-16 sm:py-24", tone === "muted" && "border-y border-border bg-canvas", className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  /** Optional tertiary link shown beside the heading (below it on mobile). */
  action?: { href: string; label: string };
}

export function SectionHeader({ eyebrow, title, description, align = "left", className, as: Heading = "h2", action }: SectionHeaderProps) {
  const text = (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Heading
        className={cn(
          "font-semibold text-heading",
          eyebrow && "mt-3",
          Heading === "h1"
            ? "text-[2rem] leading-[1.12] sm:text-[2.5rem] sm:leading-[1.1]"
            : "text-[1.625rem] leading-[1.2] sm:text-[2rem] sm:leading-[1.15]",
        )}
      >
        {title}
      </Heading>
      {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
    </div>
  );

  if (!action) return <Reveal className={className}>{text}</Reveal>;
  return (
    <Reveal className={cn("flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10", className)}>
      {text}
      <ArrowLink href={action.href} className="shrink-0 md:pb-1">
        {action.label}
      </ArrowLink>
    </Reveal>
  );
}

/** Page intro used on inner marketing pages. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative isolate overflow-hidden border-b border-border bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-glow" />
      <div className="container-page py-14 sm:py-20">
        <SectionHeader as="h1" eyebrow={eyebrow} title={title} description={description} />
        {children && <div className="mt-8">{children}</div>}
      </div>
    </div>
  );
}
