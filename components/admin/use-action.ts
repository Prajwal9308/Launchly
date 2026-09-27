"use client";

import { useTransition } from "react";
import { toast } from "@/components/ui/toaster";
import type { ActionResult } from "@/server/action";

/** Runs a server action in a transition and reports the result with a toast. */
export function useServerAction() {
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<ActionResult<unknown> | undefined | void>, onSuccess?: () => void) =>
    start(async () => {
      const result = await fn();
      if (!result) return;
      if (result.ok) {
        if (result.message) toast.success(result.message);
        onSuccess?.();
      } else {
        toast.error(result.error);
      }
    });
  return { pending, run };
}
