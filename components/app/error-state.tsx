"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shared error UI for error.tsx boundaries. Never shows stack traces. */
export function ErrorState({ reset, digest }: { reset: () => void; digest?: string }) {
  return (
    <div className="flex flex-col items-center justify-center surface rounded-2xl px-6 py-16 text-center">
      <span className="mb-3 flex size-10 items-center justify-center rounded-lg bg-danger-subtle text-danger">
        <AlertCircle className="size-5" aria-hidden />
      </span>
      <h1 className="text-base font-semibold">Something went wrong.</h1>
      <p className="mt-1 max-w-sm text-sm text-muted">Please try again. If the problem continues, contact us and mention the reference below.</p>
      {digest && <p className="mt-2 font-mono text-xs text-faint">Ref: {digest}</p>}
      <Button className="mt-5" variant="secondary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
