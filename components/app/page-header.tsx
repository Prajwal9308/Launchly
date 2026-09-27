import * as React from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  meta,
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: Crumb[];
  meta?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 space-y-3", className)}>
      {breadcrumb && <Breadcrumb items={breadcrumb} />}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
          {description && <p className="text-sm text-muted">{description}</p>}
          {meta && <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-1 text-sm text-muted">{meta}</div>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <h2 className="text-sm font-semibold">{children}</h2>
      {action}
    </div>
  );
}
