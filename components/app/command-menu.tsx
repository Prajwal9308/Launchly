"use client";

import { CornerDownLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

export interface CommandItem {
  label: string;
  href: string;
  group: string;
  keywords?: string;
}

/**
 * ⌘K / Ctrl+K command menu: jump to any page or action. For the studio, it
 * also offers a full search across clients, projects, businesses and leads.
 */
export function CommandMenu({ items, searchHref }: { items: CommandItem[]; searchHref?: (q: string) => string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matched = q ? items.filter((i) => `${i.label} ${i.group} ${i.keywords ?? ""}`.toLowerCase().includes(q)) : items;
    const withSearch: CommandItem[] =
      q && searchHref ? [...matched, { label: `Search for “${query.trim()}”`, href: searchHref(query.trim()), group: "Search" }] : matched;
    return withSearch;
  }, [items, query, searchHref]);

  const go = (item: CommandItem | undefined) => {
    if (!item) return;
    setOpen(false);
    router.push(item.href);
  };

  const onOpenChange = (v: boolean) => {
    setOpen(v);
    if (v) {
      setQuery("");
      setActive(0);
    }
  };

  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          className="group flex h-10 w-full max-w-sm items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-faint shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition-colors hover:border-white/18 hover:text-muted"
        >
          <Search className="size-4" aria-hidden />
          <span className="flex-1 text-left">{searchHref ? "Search or jump to…" : "Jump to…"}</span>
          <kbd className="hidden rounded border border-border bg-background px-1.5 font-sans text-[11px] text-faint sm:inline">⌘K</kbd>
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-fade-in" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="glass-overlay fixed left-1/2 top-[15vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-2xl !shadow-dialog data-[state=open]:animate-pop-in"
        >
          <DialogPrimitive.Title className="sr-only">Command menu</DialogPrimitive.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-faint" aria-hidden />
            <input
              autoFocus
              role="combobox"
              aria-expanded="true"
              aria-controls="command-list"
              aria-activedescendant={results[active] ? `command-${active}` : undefined}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setActive((a) => Math.min(a + 1, results.length - 1));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setActive((a) => Math.max(a - 1, 0));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  go(results[active]);
                }
              }}
              placeholder={searchHref ? "Search clients, projects, leads or pages…" : "Go to a page…"}
              className="h-12 flex-1 bg-transparent text-[15px] outline-none placeholder:text-faint"
            />
            <kbd className="rounded border border-border px-1.5 text-[11px] text-faint">Esc</kbd>
          </div>
          <ul id="command-list" role="listbox" ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
            {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted">No matches</li>}
            {results.map((item, index) => {
              const header = index === 0 || results[index - 1].group !== item.group ? item.group : null;
              return (
                <li key={`${item.group}-${item.href}-${item.label}`} role="presentation">
                  {header && <p className="px-3 pb-1 pt-2.5 text-[11px] font-medium uppercase tracking-wider text-faint">{header}</p>}
                  <div
                    id={`command-${index}`}
                    role="option"
                    aria-selected={index === active}
                    data-index={index}
                    onMouseMove={() => setActive(index)}
                    onClick={() => go(item)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm",
                      index === active ? "bg-white/[0.08] text-foreground" : "text-muted",
                    )}
                  >
                    {item.label}
                    {index === active && <CornerDownLeft className="size-3.5 text-faint" aria-hidden />}
                  </div>
                </li>
              );
            })}
          </ul>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
