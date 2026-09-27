import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./button";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  /** Builds the href for a page number, preserving other query params. */
  hrefFor: (page: number) => string;
}

export function Pagination({ page, pageSize, total, hrefFor }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(total, page * pageSize);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-4 px-1 py-3 text-sm text-muted">
      <p>
        {start}–{end} of {total}
      </p>
      <div className="flex gap-2">
        <PageLink href={hrefFor(page - 1)} disabled={page <= 1} label="Previous page">
          <ChevronLeft /> <span className="hidden sm:inline">Previous</span>
        </PageLink>
        <PageLink href={hrefFor(page + 1)} disabled={page >= pages} label="Next page">
          <span className="hidden sm:inline">Next</span> <ChevronRight />
        </PageLink>
      </div>
    </nav>
  );
}

function PageLink({ href, disabled, label, children }: { href: string; disabled: boolean; label: string; children: React.ReactNode }) {
  const classes = cn(buttonVariants({ variant: "secondary", size: "sm" }), disabled && "pointer-events-none opacity-50");
  return disabled ? (
    <span className={classes} aria-disabled="true">
      {children}
    </span>
  ) : (
    <Link href={href} className={classes} aria-label={label}>
      {children}
    </Link>
  );
}

/** Helper to build pagination/filter URLs from current search params. */
export function buildHref(path: string, params: Record<string, string | number | undefined | null>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "" && !(key === "page" && Number(value) === 1)) {
      search.set(key, String(value));
    }
  }
  const qs = search.toString();
  return qs ? `${path}?${qs}` : path;
}
