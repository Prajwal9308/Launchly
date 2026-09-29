import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Device frames for concept product visuals. Built in CSS so screens stay
 * sharp at any size and proportions stay physically plausible: one camera,
 * correct aspect ratios, no logos. Every dimension is in container units
 * (cqw) of the device itself, so a frame scales as one piece.
 *
 * Screens passed as children are sized in `em` from a cqw-based font size
 * (see `Screen`), so the interface scales with the device too.
 */

/** Screen content root: 1em = `unit` percent of the screen width. */
export function Screen({ unit = 1.25, className, children }: { unit?: number; className?: string; children: React.ReactNode }) {
  return (
    <div className="@container size-full overflow-hidden">
      <div className={cn("size-full bg-background text-foreground antialiased", className)} style={{ fontSize: `${unit}cqw`, lineHeight: 1.35 }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Wraps a composition so assistive tech hears one honest description and
 * skips the fake interface text inside.
 */
export function ConceptVisual({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="img" aria-label={`Concept preview: ${label}`} className={cn("select-none", className)}>
      <div aria-hidden className="contents">
        {children}
      </div>
    </div>
  );
}

/** Laptop with a thin-bezel display and an aluminium base. 16:10 screen. */
export function Laptop({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("@container relative w-full", className)}>
      <div className="relative mx-[6.5cqw] rounded-t-[2.2cqw] bg-[#0d0e11] p-[1.3cqw] pb-[1.6cqw] shadow-[0_0_0_0.25cqw_#c7cad0,0_2cqw_5cqw_-2cqw_rgb(15_17_21/0.35)]">
        <span className="absolute left-1/2 top-[0.45cqw] size-[0.55cqw] -translate-x-1/2 rounded-full bg-[#23252b] ring-[0.12cqw] ring-[#15161a]" />
        <div className="aspect-[16/10] overflow-hidden rounded-[0.35cqw] bg-background">{children}</div>
      </div>
      <div className="relative h-[2.1cqw] rounded-b-[1.4cqw_1.4cqw] bg-linear-to-b from-[#e7e9ec] via-[#d3d6db] to-[#aeb2ba] shadow-[0_1.2cqw_2cqw_-0.8cqw_rgb(15_17_21/0.45)]">
        <span className="absolute left-1/2 top-0 h-[0.7cqw] w-[15%] -translate-x-1/2 rounded-b-[0.8cqw] bg-linear-to-b from-[#b4b8c0] to-[#c9ccd2]" />
      </div>
    </div>
  );
}

/** Phone with a slim bezel, a single pill-shaped camera cut-out and side buttons. 9:19.5 screen. */
export function Phone({ className, children, statusTone = "dark" }: { className?: string; children: React.ReactNode; statusTone?: "dark" | "light" }) {
  return (
    <div className={cn("@container relative w-full", className)}>
      {/* Side buttons */}
      <span className="absolute -left-[1.1cqw] top-[18%] h-[5%] w-[1.2cqw] rounded-l-[0.6cqw] bg-[#2b2d32]" />
      <span className="absolute -left-[1.1cqw] top-[26%] h-[9%] w-[1.2cqw] rounded-l-[0.6cqw] bg-[#2b2d32]" />
      <span className="absolute -right-[1.1cqw] top-[24%] h-[13%] w-[1.2cqw] rounded-r-[0.6cqw] bg-[#2b2d32]" />
      <div className="relative rounded-[15cqw] bg-[#16171a] p-[3cqw] shadow-[0_0_0_0.9cqw_#3b3d43,0_4cqw_9cqw_-3cqw_rgb(15_17_21/0.45)]">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[12.2cqw] bg-background">
          {/* Status bar */}
          <div
            className={cn(
              "absolute inset-x-0 top-0 z-10 flex h-[13cqw] items-center justify-between px-[8.5cqw] text-[3.6cqw] font-semibold",
              statusTone === "light" ? "text-white" : "text-foreground",
            )}
          >
            <span>9:41</span>
            <span className="flex items-center gap-[1.2cqw]">
              <span className="flex items-end gap-[0.4cqw]">
                {[35, 55, 75, 100].map((h) => (
                  <span key={h} className="w-[0.8cqw] rounded-[0.2cqw] bg-current" style={{ height: `${h * 0.028}cqw` }} />
                ))}
              </span>
              <span className="relative h-[2.8cqw] w-[5.6cqw] rounded-[0.8cqw] border-[0.35cqw] border-current p-[0.35cqw] opacity-90">
                <span className="block h-full w-3/4 rounded-[0.3cqw] bg-current" />
              </span>
            </span>
          </div>
          {/* Camera cut-out */}
          <span className="absolute left-1/2 top-[2.6cqw] z-20 h-[8cqw] w-[28cqw] -translate-x-1/2 rounded-full bg-black" />
          {children}
          {/* Home indicator */}
          <span className="absolute bottom-[2cqw] left-1/2 z-10 h-[1.1cqw] w-[34cqw] -translate-x-1/2 rounded-full bg-foreground/80" />
        </div>
      </div>
    </div>
  );
}

/** Tablet in landscape: even bezel, camera on the long edge. 4:3 screen. */
export function Tablet({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("@container relative w-full", className)}>
      <div className="relative rounded-[4.4cqw] bg-[#16171a] p-[2.4cqw] shadow-[0_0_0_0.45cqw_#3b3d43,0_3cqw_7cqw_-2.5cqw_rgb(15_17_21/0.4)]">
        <span className="absolute left-1/2 top-[0.85cqw] size-[0.7cqw] -translate-x-1/2 rounded-full bg-[#2a2c31]" />
        <div className="aspect-[4/3] overflow-hidden rounded-[2.1cqw] bg-background">{children}</div>
      </div>
    </div>
  );
}

/** External display on an aluminium stand. 16:9 screen. */
export function Monitor({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("@container relative w-full", className)}>
      <div className="relative rounded-[1.4cqw] bg-linear-to-b from-[#dfe1e5] to-[#c4c7cd] p-[0.5cqw] shadow-[0_2.5cqw_5cqw_-2.5cqw_rgb(15_17_21/0.4)]">
        <div className="rounded-[1cqw] bg-[#0d0e11] p-[1cqw]">
          <div className="aspect-video overflow-hidden rounded-[0.3cqw] bg-background">{children}</div>
        </div>
      </div>
      <div className="mx-auto h-[7cqw] w-[16%] bg-linear-to-r from-[#b6bac1] via-[#d9dbe0] to-[#b6bac1]" />
      <div className="mx-auto h-[1.2cqw] w-[32%] rounded-t-[0.4cqw] rounded-b-[0.8cqw] bg-linear-to-b from-[#d6d9de] to-[#a9adb5] shadow-[0_1cqw_1.6cqw_-0.6cqw_rgb(15_17_21/0.4)]" />
    </div>
  );
}
