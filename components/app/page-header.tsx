import * as React from "react";
import { IconTile, type LucideIcon } from "@/components/ui/icons";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

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
              <IconTile icon={icon} />
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
        {icon && <IconTile icon={icon} size="sm" />}
        {children}
      </h2>
      {action}
    </div>
  );
}
