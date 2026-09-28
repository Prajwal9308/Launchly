"use client";

import { m } from "framer-motion";
import { fadeUp, REVEAL_VIEWPORT, staggerChildren } from "@/lib/motion";

const TAGS = { div: m.div, ul: m.ul, ol: m.ol, li: m.li, article: m.article } as const;
type Tag = keyof typeof TAGS;

interface RevealProps {
  as?: Tag;
  className?: string;
  id?: string;
  children: React.ReactNode;
  "aria-label"?: string;
}

/** Fades a single block up when it scrolls into view. */
export function Reveal({ as = "div", ...props }: RevealProps) {
  const Comp = TAGS[as];
  return <Comp variants={fadeUp} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} {...props} />;
}

/** Container that staggers its `RevealItem` children into view. */
export function RevealGroup({ as = "div", ...props }: RevealProps) {
  const Comp = TAGS[as];
  return <Comp variants={staggerChildren} initial="hidden" whileInView="show" viewport={REVEAL_VIEWPORT} {...props} />;
}

export function RevealItem({ as = "div", ...props }: RevealProps) {
  const Comp = TAGS[as];
  return <Comp variants={fadeUp} {...props} />;
}
