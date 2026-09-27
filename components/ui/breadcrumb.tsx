import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-faint">
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <li>
              {item.href ? (
                <Link href={item.href} className="transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-muted">
                  {item.label}
                </span>
              )}
            </li>
            {index < items.length - 1 && (
              <li aria-hidden>
                <ChevronRight className="size-3" />
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </nav>
  );
}
