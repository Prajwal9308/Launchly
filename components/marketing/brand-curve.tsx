"use client";

import { m, useReducedMotion } from "framer-motion";

/**
 * The ViperByte curve: one thin serpentine stroke, drawn once under a single
 * word of a headline. It's the brand's only decorative flourish — use sparingly.
 */
export function BrandCurve({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 200 18" preserveAspectRatio="none" aria-hidden className={className}>
      <m.path
        d="M3 12C34 4 62 4 98 9.5S164 15 197 6.5"
        fill="none"
        stroke="var(--color-mark)"
        strokeWidth="5"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
