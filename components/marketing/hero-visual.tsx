import { Bell, Calendar, CheckCircle2, Home, LayoutGrid, Search, User } from "lucide-react";

/**
 * Hero visual: a browser window with a small web-app dashboard, overlapped by
 * a phone showing the matching mobile app. Pure markup — decorative, so it is
 * hidden from assistive technology.
 */
export function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-[36rem] select-none pb-10 pr-6 sm:pb-12 sm:pr-10 lg:max-w-none">
      {/* Browser */}
      <div className="overflow-hidden rounded-xl border border-border bg-background shadow-[0_1px_2px_rgb(15_17_21/0.04),0_24px_60px_-24px_rgb(15_17_21/0.25)]">
        <div className="flex items-center gap-3 border-b border-border bg-canvas px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
            <span className="size-2.5 rounded-full bg-border-strong" />
          </div>
          <div className="flex-1 truncate rounded-md border border-border bg-background px-3 py-1 text-center text-[11px] text-faint">
            app.yourbusiness.com
          </div>
        </div>
        <div className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[9rem_1fr]">
          {/* Sidebar */}
          <div className="space-y-1 border-r border-border bg-canvas p-2.5 sm:p-3">
            {[LayoutGrid, Calendar, User, Bell].map((Icon, i) => (
              <div key={i} className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${i === 0 ? "bg-background shadow-xs" : ""}`}>
                <Icon className={`size-3.5 shrink-0 ${i === 0 ? "text-accent" : "text-faint"}`} />
                <span className={`hidden h-1.5 rounded-full sm:block ${i === 0 ? "w-14 bg-foreground/70" : "w-12 bg-border-strong"}`} />
              </div>
            ))}
          </div>
          {/* Content */}
          <div className="p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-faint">Overview</p>
                <p className="text-sm font-semibold text-foreground">Bookings this week</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-[10px] text-faint">
                <Search className="size-3" /> Search
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {[
                ["Booked", "w-8"],
                ["Pending", "w-6"],
                ["Completed", "w-10"],
              ].map(([label, w]) => (
                <div key={label} className="rounded-lg border border-border p-2.5">
                  <p className="text-[9px] text-faint sm:text-[10px]">{label}</p>
                  <span className={`mt-2 block h-2 rounded-full bg-foreground/80 ${w}`} />
                </div>
              ))}
            </div>
            {/* Simple bar sketch: an interface cue, not data */}
            <div className="mt-4 flex h-20 items-end gap-1.5 rounded-lg border border-border p-3 sm:h-24">
              {[40, 65, 50, 80, 58, 72, 90, 62, 76, 55, 84, 70].map((h, i) => (
                <span key={i} className={`flex-1 rounded-t-[3px] ${i === 6 ? "bg-accent" : "bg-accent/25"}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <div className="mt-3 space-y-2">
              {["w-3/4", "w-2/3"].map((w) => (
                <div key={w} className="flex items-center gap-2">
                  <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                  <span className={`h-1.5 rounded-full bg-border-strong ${w}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="absolute bottom-0 right-0 w-[34%] min-w-[7.5rem] max-w-[11.5rem] rounded-[1.75rem] border border-border-strong bg-foreground p-[5px] shadow-[0_24px_50px_-18px_rgb(15_17_21/0.45)]">
        <div className="overflow-hidden rounded-[1.45rem] bg-background">
          <div className="flex justify-center pt-1.5">
            <span className="h-1 w-10 rounded-full bg-border-strong" />
          </div>
          <div className="px-3 pb-3 pt-2.5">
            <p className="text-[9px] text-faint">Good morning</p>
            <p className="text-[11px] font-semibold text-foreground">Your next booking</p>
            <div className="mt-2 rounded-lg bg-accent p-2.5 text-white">
              <p className="text-[8px] opacity-80">Tomorrow · 10:00</p>
              <p className="mt-0.5 text-[10px] font-semibold">Consultation</p>
              <span className="mt-2 block h-1 w-3/4 rounded-full bg-white/40" />
            </div>
            <div className="mt-2 space-y-1.5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-center gap-2 rounded-md border border-border p-1.5">
                  <span className="size-4 shrink-0 rounded bg-accent-subtle" />
                  <span className={`h-1 rounded-full bg-border-strong ${i === 1 ? "w-8" : "w-11"}`} />
                </div>
              ))}
            </div>
            <div className="mt-3 flex justify-around border-t border-border pt-2 text-faint">
              <Home className="size-3 text-accent" />
              <Calendar className="size-3" />
              <User className="size-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
