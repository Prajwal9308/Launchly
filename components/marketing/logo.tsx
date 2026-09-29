import Image from "next/image";
import Link from "next/link";
import brandMark from "@/public/images/brand/coregravity-mark.png";
import { cn } from "@/lib/utils";

/**
 * CoreGravity mark: the orange "G" with an inward arrow, the same artwork as
 * the favicon (app/icon.png) and the OG image. Decorative — the brand name
 * always sits beside it as text.
 */
export function LogoMark({ className }: { className?: string }) {
  // Unoptimized: the 256px source stays sharp on 3x phone screens, where the optimizer's 2x variant blurs.
  return <Image src={brandMark} alt="" width={28} height={28} loading="eager" unoptimized className={cn("size-7", className)} />;
}

/** "CoreGravity" → "Core" + "Gravity", so the second word can take the accent. */
function splitWordmark(name: string) {
  const match = /^([A-Z][a-z]+)([A-Z].*)$/.exec(name);
  return match ? [match[1], match[2]] : [name, ""];
}

export function Logo({ name, href = "/", className }: { name: string; href?: string; className?: string }) {
  const [first, second] = splitWordmark(name);
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 rounded-md text-foreground", className)}>
      <LogoMark />
      <span className="font-display text-[17px] font-bold tracking-[-0.02em]">
        {first}
        {second && <span className="text-accent">{second}</span>}
      </span>
    </Link>
  );
}
