"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Select } from "@/components/ui/select";

interface FilterBarProps {
  searchPlaceholder?: string;
  filters?: { name: string; label: string; options: { value: string; label: string }[] }[];
}

/** URL-driven search + filters so results are shareable and server-rendered. */
export function FilterBar({ searchPlaceholder = "Search…", filters = [] }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();

  const apply = (updates: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    next.delete("page");
    start(() => router.replace(`${pathname}${next.size ? `?${next}` : ""}`));
  };

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        apply({ q: String(new FormData(e.currentTarget).get("q") ?? "") });
      }}
      className="flex flex-col gap-2 sm:flex-row sm:items-center"
      aria-busy={pending}
    >
      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden />
        <label htmlFor="filter-q" className="sr-only">
          Search
        </label>
        <input
          id="filter-q"
          name="q"
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder={searchPlaceholder}
          className="h-9 w-full rounded-md border border-border-strong/80 bg-background pl-9 pr-3 text-sm shadow-xs placeholder:text-faint focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent/25"
        />
      </div>
      {filters.map((f) => (
        <Select key={f.name} aria-label={f.label} value={params.get(f.name) ?? ""} onChange={(e) => apply({ [f.name]: e.target.value })} className="sm:w-48">
          {f.options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      ))}
    </form>
  );
}
