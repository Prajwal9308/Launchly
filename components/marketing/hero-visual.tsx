import Image from "next/image";
import heroImage from "@/public/images/hero-collaboration.jpg";

/**
 * Hero photograph: a small team reviewing a product dashboard. It carries the
 * hero on its own — refined border and radius, a quiet shadow, no overlays.
 * Static import gives Next.js the dimensions and a blur placeholder; it is the
 * page's largest image, so it loads eagerly with high fetch priority.
 */
export function HeroVisual() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-border bg-subtle shadow-[0_1px_2px_rgb(15_17_21/0.05),0_16px_40px_-20px_rgb(15_17_21/0.22)]">
      <Image
        src={heroImage}
        alt="Three people at a desk reviewing a web dashboard design on a large monitor, one pointing at a chart"
        loading="eager"
        fetchPriority="high"
        quality={85}
        placeholder="blur"
        sizes="(min-width: 1280px) 640px, (min-width: 1024px) 50vw, 100vw"
        className="aspect-[4/3] h-auto w-full object-cover object-[58%_50%] sm:aspect-[3/2]"
      />
    </figure>
  );
}
