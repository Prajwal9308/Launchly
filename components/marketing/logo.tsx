import Link from "next/link";
import { cn } from "@/lib/utils";

/** "P" monogram on a charcoal tile with a single accent node. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6", className)} aria-hidden>
      <rect width="24" height="24" rx="6" fill="#0f1115" />
      <path d="M8.5 17.5V6.5h4.6a3.6 3.6 0 0 1 0 7.2H8.5" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <circle cx="16.6" cy="17" r="1.7" fill="#4d6bf0" />
    </svg>
  );
}

export function Logo({ name, href = "/", className }: { name: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 rounded-md text-[15px] font-semibold tracking-tight text-foreground", className)}>
      <LogoMark />
      <span>{name}</span>
    </Link>
  );
}
