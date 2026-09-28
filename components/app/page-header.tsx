import type { LucideIcon } from "lucide-react";
import * as React from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

/** Accent icon tile shared by page and section headings. */
export function HeadingIcon({ icon: Icon, size = "md" }: { icon: LucideIcon; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-accent-subtle text-accent ring-1 ring-inset ring-accent-border/60",
        size === "md" ? "size-11 rounded-xl" : "size-7 rounded-lg",
      )}
    >
      <Icon className={size === "md" ? "size-5" : "size-3.5"} aria-hidden />
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  meta,
  icon,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: Crumb[];
  meta?: React.ReactNode;
  /** Decorative icon shown in an accent tile beside the title. */
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 space-y-3", className)}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {icon && (
            <span className="hidden sm:block">
              <HeadingIcon icon={icon} />
            </span>
          )}
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
            {description && <p className="text-sm text-muted">{description}</p>}
            {meta && <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-sm text-muted">{meta}</div>}
          </div>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function SectionTitle({ children, action, icon }: { children: React.ReactNode; action?: React.ReactNode; icon?: LucideIcon }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2.5 text-sm font-semibold">
        {icon && <HeadingIcon icon={icon} size="sm" />}
        {children}
      </h2>
      {action}
    </div>
  );
}
