import Image from "next/image";
import { Entrance } from "@/components/motion/entrance";
import heroImage from "@/public/images/hero-collaboration.jpg";

/** Hero: the team photograph is the only visual — no overlays. */
export function HeroVisual() {
  return (
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
  );
}
