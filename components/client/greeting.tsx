"use client";

import { greeting } from "@/lib/format";

/** Time-of-day greeting computed in the visitor's own timezone. */
export function Greeting({ firstName }: { firstName: string }) {
  return (
    <span suppressHydrationWarning>
      {greeting()}, {firstName}
    </span>
  );
}
