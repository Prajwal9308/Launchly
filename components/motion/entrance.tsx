"use client";

import { m } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

/**
 * On-load entrance for above-the-fold content: a short fade with an 8–12px
 * rise, staggered by `delay`. Reduced-motion users get the fade only
 * (MotionConfig drops the transform).
 */
export function Entrance({ delay = 0, y = 12, scale, className, children }: { delay?: number; y?: number; scale?: number; className?: string; children: React.ReactNode }) {
  return (
    <m.div
      initial={{ opacity: 0, y, scale: scale ?? 1 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
      className={className}
    >
      {children}
    </m.div>
  );
}
