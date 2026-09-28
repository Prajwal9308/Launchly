"use client";

import { domAnimation, LazyMotion, MotionConfig } from "framer-motion";

/**
 * Loads only the DOM animation features (not layout/drag) and turns off
 * transform animations for visitors who prefer reduced motion.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
