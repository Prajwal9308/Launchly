"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

type Theme = "system" | "light" | "dark";
const OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "system", label: "System", Icon: Monitor },
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
];

const listeners = new Set<() => void>();
function readTheme(): Theme {
  try {
    const t = localStorage.getItem("theme");
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}
function setTheme(theme: Theme) {
  try {
    if (theme === "system") localStorage.removeItem("theme");
    else localStorage.setItem("theme", theme);
  } catch {
    /* storage unavailable: still apply for this page view */
  }
  if (theme === "system") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = theme;
  listeners.forEach((l) => l());
}

/** Segmented System / Light / Dark control. Defaults to the device setting. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const theme = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    readTheme,
    () => "system" as Theme,
  );

  return (
    <div role="radiogroup" aria-label="Theme" className={cn("inline-flex rounded-md border border-border bg-canvas p-0.5", className)}>
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            "flex size-7 items-center justify-center rounded text-faint transition-colors hover:text-foreground",
            theme === value && "bg-background text-foreground shadow-xs",
          )}
        >
          <Icon className="size-3.5" aria-hidden />
        </button>
      ))}
    </div>
  );
}
