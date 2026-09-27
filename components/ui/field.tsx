import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FieldProps {
  id: string;
  label: React.ReactNode;
  hint?: React.ReactNode;
  error?: string | string[];
  required?: boolean;
  optional?: boolean;
  className?: string;
  /** Receives the aria props to spread onto the control. */
  children: (props: {
    id: string;
    name?: string;
    "aria-invalid"?: boolean;
    "aria-describedby"?: string;
    "aria-required"?: boolean;
  }) => React.ReactNode;
}

/** Label + control + hint + error with correct accessibility wiring. */
export function Field({ id, label, hint, error, required, optional, className, children }: FieldProps) {
  const message = Array.isArray(error) ? error[0] : error;
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = message ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={id} className="flex items-baseline gap-1.5">
        {label}
        {required && (
          <span className="text-danger" aria-hidden>
            *
          </span>
        )}
        {optional && <span className="text-xs font-normal text-faint">Optional</span>}
      </Label>
      {children({
        id,
        "aria-invalid": message ? true : undefined,
        "aria-describedby": describedBy,
        "aria-required": required || undefined,
      })}
      {hint && !message && (
        <p id={hintId} className="text-xs leading-relaxed text-faint">
          {hint}
        </p>
      )}
      {message && (
        <p id={errorId} className="text-xs font-medium text-danger" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
