import { IconTile, Icons, type LucideIcon } from "@/components/ui/icons";
import Image from "next/image";
import heroImage from "@/public/images/hero-collaboration.jpg";

/** Small floating label over the photograph. Decorative: the hero copy says the same thing. */
function Chip({ icon: Icon, title, detail, className }: { icon: LucideIcon; title: string; detail: string; className: string }) {
  return (
    <div aria-hidden className={`surface-overlay absolute hidden items-center gap-3 rounded-xl bg-background/95 px-3.5 py-2.5 sm:flex ${className}`}>
      <IconTile icon={Icon} size="sm" />
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold text-foreground">{title}</span>
        <span className="block text-xs text-faint">{detail}</span>
      </span>
    </div>
  );
}

/**
 * Hero photograph: a small team reviewing a product design together.
 * Static import gives Next.js the dimensions and a blur placeholder; it is the
 * page's largest image, so it loads eagerly with high fetch priority.
 */
export function HeroVisual() {
  return (
    <div className="relative isolate">
      <div aria-hidden className="absolute -inset-3 -z-10 rounded-[1.75rem] bg-linear-to-br from-accent/15 via-transparent to-accent-2/15 blur-2xl" />
      <figure className="relative w-full overflow-hidden rounded-3xl border border-border bg-subtle p-1.5 shadow-[0_1px_2px_rgb(15_17_21/0.04),0_24px_60px_-24px_rgb(15_17_21/0.25)]">
        <Image
          src={heroImage}
          alt="Three people at a desk reviewing a web dashboard design on a large monitor, one pointing at a chart"
          loading="eager"
          fetchPriority="high"
          quality={85}
          placeholder="blur"
          sizes="(min-width: 1280px) 600px, (min-width: 1024px) 45vw, 100vw"
          className="aspect-[4/3] h-auto w-full rounded-[1.1rem] object-cover object-[55%_50%] sm:aspect-[16/10]"
        />
      </figure>
      <Chip icon={Icons.crossPlatform} title="Web, iOS & Android" detail="One team, every platform" className="-left-4 bottom-8 lg:-left-8" />
      <Chip icon={Icons.approved} title="You approve each step" detail="Nothing ships without you" className="-right-3 top-6 lg:-right-6" />
    </div>
  );
}
