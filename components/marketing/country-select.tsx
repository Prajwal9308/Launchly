"use client";

import { useRouter } from "next/navigation";
import { useId, useTransition } from "react";
import { Icons } from "@/components/ui/icons";
import { toast } from "@/components/ui/toaster";
import { COUNTRIES, countryLabel, type CountryCode } from "@/domain/country";
import { cn } from "@/lib/utils";
import { setCountryAction } from "@/server/actions/public";

/**
 * Country and currency selector (Canada · CAD / India · INR). Saving the
 * choice refreshes the page so prices, budgets and tax wording update.
 */
export function CountrySelect({
  country,
  className,
  showLabel = false,
}: {
  country: CountryCode | null;
  className?: string;
  /** Show a visible label above the control (used on the Pricing page and in the mobile menu). */
  showLabel?: boolean;
}) {
  const id = useId();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const onChange = (value: string) => {
    startTransition(async () => {
      const result = await setCountryAction(value);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      router.refresh();
    });
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className={showLabel ? "text-sm font-medium" : "sr-only"}>
        Country and currency
      </label>
      <div className="relative">
        <Icons.country className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
        <select
          id={id}
          value={country ?? ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={pending}
          aria-busy={pending || undefined}
          className="h-9 w-full appearance-none rounded-md border border-border bg-background pl-9 pr-8 text-sm text-foreground transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60"
        >
          {!country && (
            <option value="" disabled>
              Select country
            </option>
          )}
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>
              {countryLabel(c)}
            </option>
          ))}
        </select>
        <Icons.chevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
      </div>
    </div>
  );
}
