import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("size-6", className)} aria-hidden>
      <rect width="24" height="24" rx="6" className="fill-accent" />
      <path d="M8 6.5v11h8.5" stroke="white" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M12.5 13l4-4" stroke="white" strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.6" />
    </svg>
  );
}

export function Logo({ name, href = "/", className }: { name: string; href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2 rounded-md text-[15px] font-semibold tracking-tight", className)}>
      <LogoMark />
      <span>{name}</span>
    </Link>
  );
}
