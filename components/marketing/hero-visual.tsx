import Image from "next/image";
import { Entrance } from "@/components/motion/entrance";
import heroImage from "@/public/images/hero-collaboration.jpg";
import { AreaChart } from "./mockups/screens";

/**
 * Hero: the team photograph is the primary visual. One overlay only — a
 * close-up of "ShopNext", the fictional store dashboard on the monitor in the
 * photo — clearly tagged as a concept product, not client work.
 */
export function HeroVisual() {
  return (
    <div className="relative sm:pb-14 sm:pr-10 xl:pr-0">
      <Entrance delay={0.15} y={0} scale={1.015}>
        <figure className="overflow-hidden rounded-[1.25rem] border border-border bg-subtle shadow-[0_1px_2px_rgb(15_17_21/0.05),0_22px_48px_-28px_rgb(15_17_21/0.35)]">
          <Image
            src={heroImage}
            alt="Three people at a desk reviewing an online store dashboard on a large monitor, one pointing at a sales chart"
            loading="eager"
            fetchPriority="high"
            quality={85}
            placeholder="blur"
            sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
            className="aspect-[4/3] h-auto w-full object-cover object-[58%_50%] sm:aspect-[3/2]"
          />
        </figure>
      </Entrance>

      <Entrance delay={0.55} className="absolute bottom-0 right-0 hidden w-[14.5rem] sm:block xl:-right-8 xl:w-[15.5rem]">
        <ShopNextCard />
      </Entrance>
    </div>
  );
}

/** Real-size product UI card for the ShopNext concept. */
function ShopNextCard() {
  return (
    <div
      role="img"
      aria-label="Concept product: ShopNext, an example online store dashboard showing weekly sales and recent orders"
      className="rounded-2xl border border-border bg-background p-4 shadow-[0_1px_2px_rgb(15_17_21/0.06),0_18px_40px_-18px_rgb(15_17_21/0.35)]"
    >
      <div aria-hidden>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className="flex size-6 items-center justify-center rounded-md bg-primary text-[11px] font-bold text-white">S</span>
            ShopNext
          </span>
          <span className="rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-faint">Concept</span>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <span>
            <span className="block text-xs text-muted">Sales this week</span>
            <span className="font-display text-xl font-semibold tracking-tight">$8,420</span>
          </span>
          <span className="rounded-full bg-success-subtle px-2 py-0.5 text-[11px] font-medium text-success">+12%</span>
        </div>
        <AreaChart className="mt-2 h-10" />
        <div className="mt-2 space-y-1.5 border-t border-border pt-2.5">
          {[
            { tone: "from-[#eef2f7] to-[#dde4ee]", label: "Order #1042", status: "Paid" },
            { tone: "from-[#f6f0e8] to-[#ebe1d3]", label: "Order #1041", status: "Shipped" },
          ].map((o) => (
            <div key={o.label} className="flex items-center gap-2.5 text-xs">
              <span className={`size-7 rounded-md bg-linear-to-b ${o.tone}`} />
              <span className="flex-1 font-medium">{o.label}</span>
              <span className="font-medium text-success">{o.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
