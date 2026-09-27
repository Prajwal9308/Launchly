import { Check, MessageSquare } from "lucide-react";

/**
 * Understated composition: a browser window showing a sample client website,
 * with two small cards hinting at the client portal. Pure markup, no images.
 */
export function HeroPreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:max-w-none" aria-hidden>
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-dialog">
        <div className="flex items-center gap-3 border-b border-border bg-canvas px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
          </div>
          <div className="flex-1 truncate rounded-md border border-border bg-background px-3 py-1 text-center text-[11px] text-faint">
            northstar-plumbing.example
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="size-5 rounded bg-[#1d3b5c]" />
              <span className="text-xs font-semibold text-foreground">Northstar Plumbing</span>
            </div>
            <div className="hidden gap-4 text-[11px] text-faint sm:flex">
              <span>Services</span>
              <span>Areas</span>
              <span>Reviews</span>
              <span>Contact</span>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-[1.15fr_1fr]">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#1d3b5c]/70">Residential & commercial</p>
              <p className="mt-2 text-lg font-semibold leading-snug text-foreground sm:text-xl">
                Reliable plumbing, done right the first time.
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Repairs, installations and maintenance with clear, upfront quotes.
              </p>
              <div className="mt-4 flex gap-2">
                <span className="rounded-md bg-[#1d3b5c] px-3 py-1.5 text-[10px] font-medium text-white">Request a quote</span>
                <span className="rounded-md border border-border px-3 py-1.5 text-[10px] font-medium text-foreground">
                  Call now
                </span>
              </div>
            </div>
            <div className="relative hidden min-h-32 overflow-hidden rounded-lg bg-[#e8edf2] sm:block">
              <div className="absolute inset-x-4 bottom-0 h-20 rounded-t-lg bg-[#d3dce5]" />
              <div className="absolute bottom-6 left-8 h-14 w-10 rounded-t-md bg-[#b9c7d4]" />
              <div className="absolute bottom-6 right-8 h-9 w-16 rounded-md bg-white/70" />
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            {["Emergency repairs", "Water heaters", "Drain cleaning"].map((label) => (
              <div key={label} className="rounded-lg border border-border p-3">
                <span className="block size-4 rounded bg-[#1d3b5c]/10" />
                <p className="mt-2 text-[10px] font-medium leading-tight text-foreground">{label}</p>
                <span className="mt-1.5 block h-1 w-3/4 rounded bg-subtle" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 hidden w-60 rounded-lg border border-border bg-background p-3.5 shadow-popover sm:block">
        <p className="text-[11px] font-medium text-faint">Design review</p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground">Homepage · v2</p>
          <span className="inline-flex items-center gap-1 rounded-md border border-success-border bg-success-subtle px-1.5 py-0.5 text-[11px] font-medium text-success">
            <Check className="size-3" /> Approved
          </span>
        </div>
      </div>

      <div className="absolute -right-5 -top-5 hidden w-56 rounded-lg border border-border bg-background p-3.5 shadow-popover md:block">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-medium text-faint">Project progress</span>
          <span className="font-medium text-foreground">Development</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-subtle">
          <div className="h-full w-[68%] rounded-full bg-accent" />
        </div>
        <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted">
          <MessageSquare className="size-3" /> New message from the studio
        </p>
      </div>
    </div>
  );
}
