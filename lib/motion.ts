import type { Transition, Variants } from "framer-motion";

/**
 * Shared motion language for the marketing site. Keep every animation here so
 * timing stays consistent: short, eased, opacity + small translate only.
 */
export const EASE_OUT: Transition["ease"] = [0.16, 1, 0.3, 1];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

export const staggerChildren: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

/** Reveal once, shortly after an element enters the viewport. */
export const REVEAL_VIEWPORT = { once: true, amount: 0.15, margin: "0px 0px -8% 0px" } as const;
