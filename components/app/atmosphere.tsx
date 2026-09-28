"use client";

import { useEffect, useRef } from "react";

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

/** Sparse dust: a handful of tiny points, drawn once as gradients (no per-frame work). */
const DUST = [
  [12, 18], [27, 64], [41, 12], [58, 78], [73, 30], [88, 58], [19, 86], [65, 46], [93, 14], [35, 40], [50, 92], [81, 83],
]
  .map(([x, y], i) => `radial-gradient(${i % 3 === 0 ? 1.5 : 1}px ${i % 3 === 0 ? 1.5 : 1}px at ${x}% ${y}%, rgb(255 255 255 / ${i % 2 ? 0.35 : 0.2}), transparent)`)
  .join(",");

/**
 * Level 0–1 of the depth system: near-black base, ambient light, grain and dust.
 * Layers drift very slightly with the pointer (different amounts per depth).
 * Static on touch devices and with reduced motion.
 */
export function Atmosphere() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || calm) return;

    let frame = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--ax", x.toFixed(4));
      el.style.setProperty("--ay", y.toFixed(4));
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-50 overflow-hidden bg-canvas [--ax:0] [--ay:0]">
      {/* Ambient light — moves least */}
      <div
        className="absolute -inset-[10%] will-change-transform"
        style={{
          transform: "translate3d(calc(var(--ax) * -14px), calc(var(--ay) * -14px), 0)",
          background: [
            "radial-gradient(60% 50% at 18% -8%, rgb(111 134 255 / 0.20), transparent 70%)",
            "radial-gradient(45% 40% at 92% 8%, rgb(150 110 255 / 0.10), transparent 70%)",
            "radial-gradient(70% 55% at 50% 115%, rgb(60 90 220 / 0.14), transparent 70%)",
          ].join(","),
        }}
      />
      {/* Dust — moves more, reads as nearer */}
      <div
        className="absolute -inset-[5%] opacity-70 will-change-transform"
        style={{ transform: "translate3d(calc(var(--ax) * -32px), calc(var(--ay) * -32px), 0)", backgroundImage: DUST }}
      />
      {/* Grain keeps large dark areas from banding */}
      <div className="absolute inset-0 opacity-[0.035] mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_30%,transparent_55%,rgb(0_0_0/0.55))]" />
    </div>
  );
}
