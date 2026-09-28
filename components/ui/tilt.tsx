"use client";

import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Makes a surface lean slightly toward the cursor and lifts it, with a soft
 * highlight that follows the pointer. No-op on touch devices and with reduced
 * motion (checked per interaction, so it adapts if settings change).
 */
export function Tilt({ children, className, max = 6, glare = true }: { children: ReactNode; className?: string; max?: number; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const enabled = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(pointer: fine)").matches &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !enabled()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--lift", "-4px");
      el.style.setProperty("--glare", "1");
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--lift", "0px");
    el.style.setProperty("--glare", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn(
        "group/tilt relative [--glare:0] [--lift:0px] [--rx:0deg] [--ry:0deg] [transform:perspective(1000px)_rotateX(var(--rx))_rotateY(var(--ry))_translateY(var(--lift))] transition-transform duration-500 ease-[var(--ease-out-soft)] [transform-style:preserve-3d]",
        className,
      )}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[var(--glare)] transition-opacity duration-500 [background:radial-gradient(420px_circle_at_var(--mx)_var(--my),rgb(255_255_255/0.09),transparent_45%)]"
        />
      )}
    </div>
  );
}
