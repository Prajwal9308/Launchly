import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const tones = {
  info: { classes: "border-info-border bg-info-subtle text-info", Icon: Info },
  success: { classes: "border-success-border bg-success-subtle text-success", Icon: CheckCircle2 },
  warning: { classes: "border-warning-border bg-warning-subtle text-warning", Icon: TriangleAlert },
  danger: { classes: "border-danger-border bg-danger-subtle text-danger", Icon: AlertCircle },
  neutral: { classes: "border-border bg-subtle text-muted", Icon: Info },
};

interface AlertProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: keyof typeof tones;
  title?: React.ReactNode;
}

export function Alert({ tone = "info", title, children, className, ...props }: AlertProps) {
  const { classes, Icon } = tones[tone];
  return (
    <div role={tone === "danger" ? "alert" : "status"} className={cn("flex gap-3 rounded-lg border px-4 py-3 text-sm", classes, className)} {...props}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div className="min-w-0 space-y-0.5">
        {title && <p className="font-medium">{title}</p>}
        {children && <div className="leading-relaxed text-foreground/80">{children}</div>}
      </div>
    </div>
  );
}
