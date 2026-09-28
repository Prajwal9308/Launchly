import Image from "next/image";
import heroImage from "@/public/images/hero-collaboration.jpg";

/**
 * Hero photograph: a small team reviewing a product design together.
 * Static import gives Next.js the dimensions and a blur placeholder; it is the
 * page's largest image, so it loads eagerly with high fetch priority.
 */
export function HeroVisual() {
  return (
    <figure className="relative w-full overflow-hidden rounded-2xl border border-border bg-subtle shadow-[0_1px_2px_rgb(15_17_21/0.04),0_24px_60px_-24px_rgb(15_17_21/0.25)]">
      <Image
        src={heroImage}
        alt="Three people at a desk reviewing a web dashboard design on a large monitor, one pointing at a chart"
        loading="eager"
        fetchPriority="high"
        quality={85}
        placeholder="blur"
        sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
        className="aspect-[4/3] h-auto w-full object-cover object-[55%_50%] sm:aspect-[16/10]"
      />
    </figure>
  );
}
