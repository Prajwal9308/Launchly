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

/**
 * Reveal once, as soon as any part of an element is 60px inside the viewport.
 * Use "some", never a fraction: a fraction of a tall group (e.g. the full
 * services list) can exceed what fits below a page hero, leaving it blank
 * until the visitor scrolls.
 */
export const REVEAL_VIEWPORT = { once: true, amount: "some", margin: "0px 0px -60px 0px" } as const;
