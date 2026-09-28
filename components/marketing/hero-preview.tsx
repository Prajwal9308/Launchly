import { Check, MessageSquare } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";

/**
 * Pieces of the hero composition. The website mockup is a "screenshot" of a
 * light client site, so it forces light tokens; the chips are dark glass.
 */
export function WebsiteMockup() {
  return (
    <div className="theme-light-tokens overflow-hidden rounded-2xl border border-white/20 bg-background shadow-[0_50px_120px_-30px_rgb(0_0_0/0.95),0_0_0_1px_rgb(255_255_255/0.06)] brightness-[0.9]">
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
            <span>Contact</span>
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[#1d3b5c]/70">Residential & commercial</p>
            <p className="mt-2 text-lg font-semibold leading-snug text-foreground">Reliable plumbing, done right the first time.</p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">Repairs, installations and maintenance with clear, upfront quotes.</p>
            <div className="mt-4 flex gap-2">
              <span className="rounded-md bg-[#1d3b5c] px-3 py-1.5 text-[10px] font-medium text-white">Request a quote</span>
              <span className="rounded-md border border-border px-3 py-1.5 text-[10px] font-medium text-foreground">Call now</span>
            </div>
          </div>
          <div className="relative hidden min-h-28 overflow-hidden rounded-lg bg-[#e8edf2] sm:block">
            <div className="absolute inset-x-4 bottom-0 h-16 rounded-t-lg bg-[#d3dce5]" />
            <div className="absolute bottom-5 left-7 h-12 w-9 rounded-t-md bg-[#b9c7d4]" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {["Emergency repairs", "Water heaters", "Drain cleaning"].map((label) => (
            <div key={label} className="rounded-lg border border-border p-3">
              <span className="block size-4 rounded bg-[#1d3b5c]/10" />
              <p className="mt-2 text-[10px] font-medium leading-tight text-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProgressChip() {
  return (
    <div className="glass-overlay w-60 rounded-2xl p-4 !shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_24px_60px_-18px_rgb(0_0_0/0.95)]">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-faint">Project progress</span>
        <span className="font-medium text-foreground">Development</span>
      </div>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#566cea,#8ea0ff)] shadow-[0_0_12px_rgb(111_134_255/0.8)]" />
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
        <MessageSquare className="size-3" /> New message from the studio
      </p>
    </div>
  );
}

export function ReviewChip() {
  return (
    <div className="glass-overlay w-64 rounded-2xl p-4 !shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_24px_60px_-18px_rgb(0_0_0/0.95)]">
      <p className="text-[11px] font-medium text-faint">Design review</p>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Homepage · v2</p>
        <span className="inline-flex items-center gap-1 rounded-md border border-success-border bg-success-subtle px-1.5 py-0.5 text-[11px] font-medium text-success">
          <Check className="size-3" /> Approved
        </span>
      </div>
    </div>
  );
}

export function MessageChip() {
  return (
    <div className="glass-overlay flex w-64 items-start gap-3 rounded-2xl p-3.5 !shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_24px_60px_-18px_rgb(0_0_0/0.95)]">
      <Avatar firstName="S" lastName="T" tone="accent" className="size-7 text-[10px]" />
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-faint">Studio · just now</p>
        <p className="mt-0.5 text-xs leading-relaxed text-foreground">Your homepage design is ready for review.</p>
      </div>
    </div>
  );
}
