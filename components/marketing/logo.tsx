import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * ViperByte mark: a faceted "V" monogram with sharp, fang-like strokes on a
 * charcoal tile. Flat shapes only, so it holds up from a 16px favicon to a
 * profile image. Keep in sync with app/icon.svg and the OG image.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-7", className)} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#16181d" />
      <path d="M5 6h4.2L12 14.4 14.8 6H19l-5.9 13h-2.2Z" fill="var(--color-mark, #ea6a1f)" />
      <path d="M12 14.4 14.8 6H19l-5.9 13H12Z" fill="var(--color-mark-light, #f7b58a)" />
    </svg>
  );
}

export function Logo({ name, href = "/", className }: { name: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5 rounded-md text-foreground", className)}>
      <LogoMark />
      <span className="font-display text-[17px] font-bold tracking-[-0.02em]">{name}</span>
    </Link>
  );
}
