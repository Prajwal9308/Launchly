"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";

/** Submit button that disables itself and shows a spinner while the form is pending. */
export function SubmitButton({
  children,
  pendingText,
  pending: pendingProp,
  ...props
}: ButtonProps & { pendingText?: string; pending?: boolean }) {
  // Forms using <form action> get status from useFormStatus; onSubmit forms pass `pending`.
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <Button type="submit" loading={pending} {...props}>
      {pending && pendingText ? pendingText : children}
    </Button>
  );
}
