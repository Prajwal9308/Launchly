"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { MessageChip, ProgressChip, ReviewChip } from "./hero-preview";

const HeroScene = dynamic(() => import("./hero-scene"), { ssr: false });

function webglAvailable() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/** CSS-only glass orb: the fallback on phones, reduced motion, and while the scene loads. */
function StaticOrb({ hidden }: { hidden: boolean }) {
  return (
    <div aria-hidden className={cn("absolute inset-0 flex items-center justify-center transition-opacity duration-1000", hidden && "opacity-0")}>
      <div className="relative size-[min(72%,22rem)]">
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_28%,rgb(255_255_255/0.45),rgb(160_175_255/0.18)_28%,rgb(111_134_255/0.08)_55%,transparent_70%)] shadow-[inset_0_0_60px_rgb(111_134_255/0.25)]" />
        <div className="absolute -inset-[18%] rounded-full border border-accent/40 [transform:rotateX(72deg)_rotateZ(12deg)]" />
        <div className="absolute -inset-[34%] rounded-full border border-white/10 [transform:rotateX(76deg)_rotateZ(-20deg)]" />
      </div>
    </div>
  );
}

/**
 * The hero's right side: the WebGL crystal (level 2) with glass UI chips from
 * the client portal floating in front (level 5), each at its own parallax depth.
 */
export function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [use3D, setUse3D] = useState(false);
  const [running, setRunning] = useState(true);
  const [sceneReady, setSceneReady] = useState(false);

  // Decide once whether this device should get WebGL, then load it when the browser is idle.
  useEffect(() => {
    const capable =
      window.matchMedia("(min-width: 768px) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      webglAvailable();
    if (!capable) return;
    const start = () => setUse3D(true);
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(start, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 600);
    return () => clearTimeout(id);
  }, []);

  // Only render frames while the stage is on screen and the tab is visible.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !use3D) return;
    let onScreen = true;
    const update = () => setRunning(onScreen && document.visibilityState === "visible");
    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      update();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", update);
    const readyTimer = setTimeout(() => setSceneReady(true), 400);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", update);
      clearTimeout(readyTimer);
    };
  }, [use3D]);

  // Pointer parallax: one smoothed value drives every layer via CSS variables.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const tick = () => {
      const p = pointer.current;
      p.x += (tx - p.x) * 0.08;
      p.y += (ty - p.y) * 0.08;
      el.style.setProperty("--px", p.x.toFixed(4));
      el.style.setProperty("--py", p.y.toFixed(4));
      frame = Math.abs(tx - p.x) + Math.abs(ty - p.y) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  const layer = (depth: number) => ({
    transform: `translate3d(calc(var(--px) * ${depth}px), calc(var(--py) * ${depth}px), 0)`,
  });

  return (
    <div
      ref={stageRef}
      data-scene={use3D ? (sceneReady ? "ready" : "loading") : "static"}
      className="relative mx-auto aspect-[1.05] w-full max-w-xl [--px:0] [--py:0] lg:max-w-none"
      aria-hidden
    >
      {/* Level 1–2: glow and 3D object (moderate parallax) */}
      <div className="absolute inset-[-4%] will-change-transform" style={layer(-18)}>
        <div className="absolute inset-[18%] rounded-full bg-accent/20 blur-[90px]" />
        <StaticOrb hidden={use3D && sceneReady} />
        {use3D && (
          <div className={cn("absolute inset-0 transition-opacity duration-1000", sceneReady ? "opacity-100" : "opacity-0")}>
            <HeroScene pointer={pointer} running={running} />
          </div>
        )}
      </div>

      {/* Level 5: floating glass chips (nearest, opposite drift) */}
      <div className="absolute left-[0%] top-[14%] animate-rise will-change-transform [animation-delay:450ms]" style={layer(18)}>
        <ProgressChip />
      </div>
      <div className="absolute bottom-[12%] right-[0%] animate-rise will-change-transform [animation-delay:600ms]" style={layer(12)}>
        <ReviewChip />
      </div>
      <div className="absolute bottom-[4%] left-[8%] hidden animate-rise will-change-transform [animation-delay:750ms] lg:block" style={layer(26)}>
        <MessageChip />
      </div>
    </div>
  );
}
