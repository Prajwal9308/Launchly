import Image from "next/image";
import Link from "next/link";
import viperMark from "@/public/images/brand/viper-mark.png";
import { cn } from "@/lib/utils";

/**
 * ViperByte mark: the viper head on a charcoal tile, the same artwork as the
 * favicon (app/icon.png) and the OG image. Decorative — the brand name always
 * sits beside it as text.
 */
export function LogoMark({ className }: { className?: string }) {
  return <Image src={viperMark} alt="" width={28} height={28} loading="eager" className={cn("size-7 rounded-[25%]", className)} />;
}

export function Logo({ name, href = "/", className }: { name: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 rounded-md text-foreground", className)}>
      <LogoMark />
      <span className="font-display text-[17px] font-bold tracking-[-0.02em]">{name}</span>
    </Link>
  );
}
