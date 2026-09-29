import { useId } from "react";
import { Icons } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Screen } from "./devices";

/**
 * Concept interfaces shown inside the device frames. They illustrate the kinds
 * of products ViperByte builds — they are not client work, so they use a
 * placeholder brand ("Your Brand") and sample data only. Everything inside is
 * sized in em (see Screen) so it scales with the device.
 */

const ico = "size-[1.15em]";

function Wordmark({ light, name = "Your Brand" }: { light?: boolean; name?: string }) {
  const shop = name === "ShopNext";
  return (
    <span className="flex items-center gap-[0.5em]">
      <span
        className={cn(
          "flex size-[1.5em] items-center justify-center rounded-[0.4em] text-[1em] font-bold text-white",
          light ? "bg-white" : shop ? "bg-primary" : "bg-accent",
        )}
      >
        {shop && <span className="text-[0.7em]">S</span>}
      </span>
      <span className={cn("text-[1.05em] font-semibold tracking-tight", light && "text-white")}>{name}</span>
    </span>
  );
}

function Bar({ w, className }: { w: string; className?: string }) {
  return <span className={cn("block h-[0.55em] rounded-full bg-border-strong/70", className)} style={{ width: w }} />;
}

/* ------------------------------------------------------------------ */
/* Business website (desktop)                                          */
/* ------------------------------------------------------------------ */

export function WebsiteScreen() {
  return (
    <Screen unit={1.2}>
      <div className="flex h-[4.2em] items-center justify-between border-b border-border px-[3.5em]">
        <Wordmark />
        <span className="flex items-center gap-[2.2em] text-[0.95em] text-muted">
          <span>Services</span>
          <span>About</span>
          <span>Reviews</span>
          <span>Contact</span>
        </span>
        <span className="rounded-full bg-foreground px-[1.1em] py-[0.45em] text-[0.9em] font-medium text-background">Book now</span>
      </div>
      <div className="relative grid grid-cols-[1.1fr_1fr] gap-[3em] overflow-hidden px-[3.5em] py-[3.2em]">
        <div aria-hidden className="absolute -right-[6em] -top-[8em] size-[26em] rounded-full bg-accent/10 blur-[3em]" />
        <div className="relative">
          <span className="inline-flex items-center gap-[0.4em] rounded-full bg-success-subtle px-[0.8em] py-[0.25em] text-[0.85em] font-medium text-success">
            <span className="size-[0.5em] rounded-full bg-success" /> Open today until 7pm
          </span>
          <p className="mt-[0.7em] font-display text-[2.7em] font-bold leading-[1.05] tracking-tight">Book your next visit in seconds.</p>
          <p className="mt-[1em] max-w-[26em] text-[1.05em] leading-relaxed text-muted">Friendly, local and on time. Choose a service, pick a slot and get a confirmation by email.</p>
          <div className="mt-[1.6em] flex gap-[0.8em]">
            <span className="rounded-[0.6em] bg-accent px-[1.3em] py-[0.7em] text-[0.95em] font-medium text-accent-foreground">Book an appointment</span>
            <span className="rounded-[0.6em] border border-border px-[1.3em] py-[0.7em] text-[0.95em] font-medium">View services</span>
          </div>
        </div>
        <div className="relative rounded-[1em] border border-border bg-background p-[1.4em] shadow-[0_1em_3em_-1em_rgb(15_17_21/0.18)]">
          <div className="flex items-center justify-between">
            <span className="text-[1em] font-semibold">Choose a time</span>
            <span className="flex items-center gap-[0.35em] text-[0.85em] text-muted">
              <Icons.date className={ico} /> Thu, 14
            </span>
          </div>
          <div className="mt-[1em] grid grid-cols-3 gap-[0.6em]">
            {["9:00", "9:30", "10:30", "11:00", "13:30", "15:00"].map((t, i) => (
              <span
                key={t}
                className={cn(
                  "rounded-[0.5em] border py-[0.55em] text-center text-[0.9em] font-medium",
                  i === 2 ? "border-accent bg-accent text-accent-foreground" : "border-border text-foreground",
                )}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="mt-[1em] flex items-center gap-[0.6em] rounded-[0.6em] bg-canvas p-[0.7em]">
            <span className="flex size-[2.2em] items-center justify-center rounded-full bg-accent-subtle text-accent">
              <Icons.time className={ico} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[0.9em] font-medium">Consultation · 45 min</span>
              <Bar w="60%" className="mt-[0.35em]" />
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-[1.2em] px-[3.5em]">
        {[Icons.date, Icons.messages, Icons.approved].map((Icon, i) => (
          <div key={i} className="rounded-[0.8em] border border-border p-[1.1em]">
            <span className="flex size-[2.2em] items-center justify-center rounded-[0.55em] bg-accent-subtle text-accent">
              <Icon className={ico} />
            </span>
            <Bar w="55%" className="mt-[0.9em] bg-foreground/70" />
            <Bar w="90%" className="mt-[0.6em]" />
            <Bar w="70%" className="mt-[0.45em]" />
          </div>
        ))}
      </div>
    </Screen>
  );
}

/** Same site at phone width. */
export function WebsiteMobileScreen() {
  return (
    <Screen unit={4.1}>
      <div className="flex h-full flex-col pt-[3.3em]">
        <div className="flex items-center justify-between px-[1.2em] pb-[0.8em]">
          <Wordmark />
          <Icons.menu className={ico} />
        </div>
        <div className="relative overflow-hidden px-[1.2em] pt-[0.6em]">
          <div aria-hidden className="absolute -right-[4em] -top-[3em] size-[10em] rounded-full bg-accent/10 blur-[1.5em]" />
          <p className="relative font-display text-[1.6em] font-bold leading-[1.1] tracking-tight">Book your next visit in seconds.</p>
          <p className="relative mt-[0.6em] text-[0.8em] leading-relaxed text-muted">Choose a service, pick a slot and get a confirmation by email.</p>
          <span className="relative mt-[1em] block rounded-[0.6em] bg-accent py-[0.7em] text-center text-[0.85em] font-medium text-accent-foreground">Book an appointment</span>
        </div>
        <div className="mt-[1.2em] space-y-[0.6em] px-[1.2em]">
          {[Icons.date, Icons.messages].map((Icon, i) => (
            <div key={i} className="flex items-center gap-[0.7em] rounded-[0.7em] border border-border p-[0.8em]">
              <span className="flex size-[2em] items-center justify-center rounded-[0.5em] bg-accent-subtle text-accent">
                <Icon className={ico} />
              </span>
              <span className="flex-1">
                <Bar w="60%" className="bg-foreground/70" />
                <Bar w="85%" className="mt-[0.4em]" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* Web application dashboard (desktop)                                 */
/* ------------------------------------------------------------------ */

export function AreaChart({ className }: { className?: string }) {
  const id = useId();
  return (
    <svg viewBox="0 0 320 110" preserveAspectRatio="none" className={cn("w-full", className)}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[25, 55, 85].map((y) => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="var(--color-border)" strokeWidth="1" />
      ))}
      <path d="M0 88 C30 80 45 62 75 66 S120 44 150 50 S205 26 235 34 S290 14 320 18 L320 110 L0 110Z" fill={`url(#${id})`} />
      <path d="M0 88 C30 80 45 62 75 66 S120 44 150 50 S205 26 235 34 S290 14 320 18" fill="none" stroke="var(--color-accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
      <circle cx="235" cy="34" r="4" fill="var(--color-background)" stroke="var(--color-accent)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function DashboardScreen() {
  const nav = [Icons.dashboard, Icons.date, Icons.clients, Icons.messages, Icons.settings];
  return (
    <Screen unit={1.3} className="flex bg-canvas">
      <aside className="flex w-[15em] shrink-0 flex-col border-r border-border bg-background px-[1.1em] py-[1.2em]">
        <Wordmark />
        <div className="mt-[1.8em] space-y-[0.3em]">
          {nav.map((Icon, i) => (
            <span
              key={i}
              className={cn("flex items-center gap-[0.7em] rounded-[0.55em] px-[0.7em] py-[0.55em]", i === 0 ? "bg-accent-subtle text-accent" : "text-faint")}
            >
              <Icon className={ico} />
              <Bar w={["55%", "45%", "50%", "60%", "40%"][i]} className={i === 0 ? "bg-accent/60" : ""} />
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center gap-[0.6em] rounded-[0.6em] bg-canvas p-[0.6em]">
          <span className="size-[2em] rounded-full bg-linear-to-br from-accent/60 to-accent-2/60" />
          <span className="flex-1">
            <Bar w="70%" className="bg-foreground/60" />
            <Bar w="45%" className="mt-[0.35em]" />
          </span>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-[1.6em]">
        <div className="flex items-center justify-between">
          <span className="font-display text-[1.5em] font-bold tracking-tight">Overview</span>
          <span className="flex items-center gap-[0.8em]">
            <span className="flex h-[2.2em] w-[13em] items-center gap-[0.5em] rounded-[0.55em] border border-border bg-background px-[0.7em] text-faint">
              <Icons.search className={ico} />
              <span className="text-[0.85em]">Search</span>
            </span>
            <span className="flex size-[2.2em] items-center justify-center rounded-[0.55em] border border-border bg-background text-muted">
              <Icons.notifications className={ico} />
            </span>
          </span>
        </div>
        <div className="mt-[1.3em] grid grid-cols-3 gap-[1em]">
          {[
            { label: "Bookings this week", value: "128", icon: Icons.date },
            { label: "New customers", value: "36", icon: Icons.clients },
            { label: "Open requests", value: "9", icon: Icons.messages },
          ].map((k) => (
            <div key={k.label} className="rounded-[0.8em] border border-border bg-background p-[1em]">
              <span className="flex items-center justify-between text-[0.85em] text-muted">
                {k.label}
                <k.icon className="size-[1.2em] text-accent" />
              </span>
              <span className="mt-[0.4em] block font-display text-[1.9em] font-bold tracking-tight">{k.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-[1em] grid grid-cols-[1.6fr_1fr] gap-[1em]">
          <div className="rounded-[0.8em] border border-border bg-background p-[1em]">
            <div className="flex items-center justify-between">
              <span className="text-[0.95em] font-semibold">Weekly bookings</span>
              <span className="rounded-full bg-subtle px-[0.7em] py-[0.2em] text-[0.8em] text-muted">Last 8 weeks</span>
            </div>
            <AreaChart className="mt-[0.8em] h-[9em]" />
          </div>
          <div className="rounded-[0.8em] border border-border bg-background p-[1em]">
            <span className="text-[0.95em] font-semibold">Today</span>
            <div className="mt-[0.7em] space-y-[0.6em]">
              {[
                ["9:30", "bg-accent"],
                ["11:00", "bg-accent-2"],
                ["14:15", "bg-success"],
                ["16:00", "bg-warning"],
              ].map(([t, c]) => (
                <div key={t} className="flex items-center gap-[0.6em]">
                  <span className={cn("h-[2.2em] w-[0.3em] rounded-full", c)} />
                  <span className="w-[3em] text-[0.8em] tabular-nums text-muted">{t}</span>
                  <span className="flex-1">
                    <Bar w="80%" className="bg-foreground/60" />
                    <Bar w="50%" className="mt-[0.35em]" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-[1em] rounded-[0.8em] border border-border bg-background">
          {[0, 1, 2].map((r) => (
            <div key={r} className="flex items-center gap-[1em] border-b border-border px-[1em] py-[0.75em] last:border-0">
              <span className="size-[1.9em] rounded-full bg-linear-to-br from-accent/40 to-accent/10" />
              <Bar w="18%" className="bg-foreground/60" />
              <Bar w="24%" />
              <span className="ml-auto rounded-full bg-success-subtle px-[0.7em] py-[0.15em] text-[0.75em] font-medium text-success">Confirmed</span>
            </div>
          ))}
        </div>
      </main>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile booking app                                                   */
/* ------------------------------------------------------------------ */

function TabBar({ active = 0 }: { active?: number }) {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-[4.2em] items-start justify-around border-t border-border bg-background/95 pt-[0.8em] backdrop-blur">
      {[Icons.home, Icons.date, Icons.messages, Icons.account].map((Icon, i) => (
        <Icon key={i} className={cn("size-[1.35em]", i === active ? "text-accent" : "text-faint")} />
      ))}
    </div>
  );
}

export function BookingAppScreen() {
  return (
    <Screen unit={4.1} className="relative bg-canvas">
      <div className="px-[1.1em] pt-[3.4em]">
        <span className="text-[0.8em] text-muted">Good morning</span>
        <p className="font-display text-[1.45em] font-bold tracking-tight">Your bookings</p>
        <div className="relative mt-[0.8em] overflow-hidden rounded-[1em] bg-accent p-[1em] text-accent-foreground">
          <div aria-hidden className="absolute -right-[2em] -top-[2em] size-[7em] rounded-full bg-white/10" />
          <span className="text-[0.75em] opacity-80">Next appointment</span>
          <p className="text-[1.05em] font-semibold">Consultation</p>
          <div className="mt-[0.7em] flex items-center gap-[1em] text-[0.75em]">
            <span className="flex items-center gap-[0.35em]">
              <Icons.date className="size-[1.3em]" /> Thu 14
            </span>
            <span className="flex items-center gap-[0.35em]">
              <Icons.time className="size-[1.3em]" /> 10:30
            </span>
            <span className="ml-auto rounded-full bg-white/20 px-[0.6em] py-[0.15em]">Confirmed</span>
          </div>
        </div>
        <p className="mt-[1.1em] text-[0.85em] font-semibold">Pick a day</p>
        <div className="mt-[0.5em] grid grid-cols-5 gap-[0.4em]">
          {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d, i) => (
            <span
              key={d}
              className={cn(
                "flex flex-col items-center rounded-[0.7em] py-[0.5em]",
                i === 3 ? "bg-foreground text-background" : "border border-border bg-background",
              )}
            >
              <span className="text-[0.65em] opacity-70">{d}</span>
              <span className="text-[0.95em] font-semibold">{11 + i}</span>
            </span>
          ))}
        </div>
        <div className="mt-[0.8em] grid grid-cols-3 gap-[0.4em]">
          {["9:00", "10:30", "11:00", "13:30", "15:00", "16:30"].map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-[0.55em] border py-[0.45em] text-center text-[0.75em] font-medium",
                i === 1 ? "border-accent bg-accent-subtle text-accent" : "border-border bg-background",
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="mt-[0.9em] block rounded-[0.7em] bg-foreground py-[0.7em] text-center text-[0.8em] font-medium text-background">Book 10:30 on Thursday</span>
        <p className="mt-[1.1em] text-[0.85em] font-semibold">Recent</p>
        <div className="mt-[0.4em] space-y-[0.45em]">
          {["Follow-up visit", "Initial consultation"].map((t) => (
            <div key={t} className="flex items-center gap-[0.6em] rounded-[0.7em] border border-border bg-background p-[0.6em]">
              <span className="flex size-[2em] items-center justify-center rounded-[0.5em] bg-success-subtle text-success">
                <Icons.success className="size-[1.05em]" />
              </span>
              <span className="text-[0.75em] font-medium">{t}</span>
            </div>
          ))}
        </div>
      </div>
      <TabBar active={1} />
    </Screen>
  );
}

/** A second app screen: messages / updates list. */
export function AppInboxScreen() {
  return (
    <Screen unit={4.1} className="relative bg-background">
      <div className="px-[1.1em] pt-[3.4em]">
        <p className="font-display text-[1.45em] font-bold tracking-tight">Updates</p>
        <div className="mt-[0.6em] flex h-[2.2em] items-center gap-[0.5em] rounded-[0.6em] bg-subtle px-[0.7em] text-faint">
          <Icons.search className="size-[1.1em]" />
          <span className="text-[0.75em]">Search</span>
        </div>
        <div className="mt-[0.8em] divide-y divide-border">
          {[
            { icon: Icons.approved, tone: "bg-success-subtle text-success" },
            { icon: Icons.messages, tone: "bg-accent-subtle text-accent" },
            { icon: Icons.date, tone: "bg-warning-subtle text-warning" },
            { icon: Icons.document, tone: "bg-info-subtle text-info" },
            { icon: Icons.success, tone: "bg-success-subtle text-success" },
            { icon: Icons.messages, tone: "bg-accent-subtle text-accent" },
            { icon: Icons.time, tone: "bg-subtle text-muted" },
          ].map(({ icon: Icon, tone }, i) => (
            <div key={i} className="flex items-center gap-[0.7em] py-[0.75em]">
              <span className={cn("flex size-[2.3em] shrink-0 items-center justify-center rounded-full", tone)}>
                <Icon className="size-[1.15em]" />
              </span>
              <span className="min-w-0 flex-1">
                <Bar w={["70%", "55%", "65%", "50%", "60%", "45%", "58%"][i]} className="bg-foreground/70" />
                <Bar w="90%" className="mt-[0.4em]" />
              </span>
              {i < 2 && <span className="size-[0.5em] rounded-full bg-accent" />}
            </div>
          ))}
        </div>
      </div>
      <TabBar active={2} />
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* E-commerce                                                           */
/* ------------------------------------------------------------------ */

/** Studio-lit product shot drawn in CSS: a simple object on a soft backdrop. */
function ProductArt({ kind, className }: { kind: "bottle" | "jar" | "bag" | "mug"; className?: string }) {
  const bg = { bottle: "from-[#eef2f7] to-[#dde4ee]", jar: "from-[#f6f0e8] to-[#ebe1d3]", bag: "from-[#edf3ee] to-[#dce8df]", mug: "from-[#f3eef6] to-[#e4dcea]" }[kind];
  return (
    <div className={cn("relative flex aspect-square items-end justify-center overflow-hidden bg-linear-to-b pb-[16%]", bg, className)}>
      <span className="absolute bottom-[12%] left-1/2 h-[6%] w-[46%] -translate-x-1/2 rounded-[50%] bg-black/15 blur-[0.3em]" />
      {kind === "bottle" && (
        <span className="relative flex h-[62%] w-[26%] flex-col items-center">
          <span className="h-[14%] w-[46%] rounded-t-[0.2em] bg-[#2d3340]" />
          <span className="w-full flex-1 rounded-[0.5em] bg-linear-to-r from-[#8fa4c4] via-[#b8c7de] to-[#8397b8]">
            <span className="mx-auto mt-[45%] block h-[22%] w-[70%] rounded-[0.15em] bg-white/85" />
          </span>
        </span>
      )}
      {kind === "jar" && (
        <span className="relative flex h-[46%] w-[40%] flex-col">
          <span className="h-[16%] w-full rounded-t-[0.3em] bg-[#6b5a48]" />
          <span className="w-full flex-1 rounded-b-[0.45em] bg-linear-to-r from-[#e6d6c1] via-[#f5ebde] to-[#dccab2]">
            <span className="mx-auto mt-[28%] block h-[30%] w-[64%] rounded-[0.15em] bg-[#6b5a48]/80" />
          </span>
        </span>
      )}
      {kind === "bag" && (
        <span className="relative flex h-[58%] w-[46%] flex-col items-center">
          <span className="h-[24%] w-[46%] rounded-t-full border-[0.35em] border-b-0 border-[#5f7a66]" />
          <span className="w-full flex-1 rounded-[0.3em] bg-linear-to-r from-[#8fae98] via-[#a9c4b0] to-[#86a58f]" />
        </span>
      )}
      {kind === "mug" && (
        <span className="relative h-[40%] w-[36%]">
          <span className="absolute right-[-26%] top-[22%] h-[46%] w-[40%] rounded-r-full border-[0.4em] border-l-0 border-[#9b86ad]" />
          <span className="block size-full rounded-b-[0.7em] rounded-t-[0.2em] bg-linear-to-r from-[#b7a3c8] via-[#d2c4de] to-[#ab96bd]" />
        </span>
      )}
    </div>
  );
}

const PRODUCTS = [
  { kind: "bottle", price: "$24" },
  { kind: "jar", price: "$18" },
  { kind: "bag", price: "$36" },
  { kind: "mug", price: "$16" },
] as const;

export function StoreScreen({ columns = 4 }: { columns?: 3 | 4 }) {
  return (
    <Screen unit={columns === 4 ? 1.2 : 1.55}>
      <div className="flex h-[4em] items-center justify-between border-b border-border px-[2.4em]">
        <Wordmark name="ShopNext" />
        <span className="flex h-[2.2em] w-[30%] items-center gap-[0.5em] rounded-full bg-subtle px-[0.9em] text-faint">
          <Icons.search className={ico} />
          <span className="text-[0.85em]">Search products</span>
        </span>
        <span className="relative text-foreground">
          <Icons.ecommerce className="size-[1.4em]" />
          <span className="absolute -right-[0.6em] -top-[0.5em] flex size-[1.25em] items-center justify-center rounded-full bg-accent text-[0.7em] font-semibold text-accent-foreground">2</span>
        </span>
      </div>
      <div className="px-[2.4em] py-[1.6em]">
        <div className="flex items-end justify-between">
          <span className="font-display text-[1.6em] font-bold tracking-tight">New arrivals</span>
          <span className="flex gap-[0.5em] text-[0.8em]">
            {["All", "Home", "Bags", "Gifts"].map((c, i) => (
              <span key={c} className={cn("rounded-full px-[0.9em] py-[0.3em]", i === 0 ? "bg-foreground text-background" : "border border-border text-muted")}>
                {c}
              </span>
            ))}
          </span>
        </div>
        <div className={cn("mt-[1.2em] grid gap-[1.1em]", columns === 4 ? "grid-cols-4" : "grid-cols-3")}>
          {/* Four columns fill a wide screen; three columns continue into a second row, as a scrolling store would. */}
          {(columns === 4 ? PRODUCTS : [...PRODUCTS.slice(0, 3), PRODUCTS[3], PRODUCTS[0], PRODUCTS[1]]).map((p, i) => (
            <div key={i}>
              <ProductArt kind={p.kind} className="rounded-[0.8em]" />
              <Bar w="70%" className="mt-[0.8em] bg-foreground/70" />
              <div className="mt-[0.5em] flex items-center justify-between">
                <span className="text-[0.9em] font-semibold">{p.price}</span>
                <span className="flex size-[1.9em] items-center justify-center rounded-full border border-border text-foreground">
                  <Icons.add className="size-[1em]" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

export function ProductScreen() {
  return (
    <Screen unit={4.1} className="relative flex flex-col bg-background">
      <ProductArt kind="bottle" className="aspect-[1/1.02] w-full" />
      <div className="flex-1 px-[1.1em] pt-[0.9em]">
        <div className="flex items-start justify-between">
          <span>
            <Bar w="8em" className="bg-foreground/70" />
            <Bar w="5em" className="mt-[0.45em]" />
          </span>
          <span className="text-[1.15em] font-bold">$24</span>
        </div>
        <div className="mt-[0.9em] flex gap-[0.5em]">
          {["bg-[#8fa4c4]", "bg-[#dccab2]", "bg-[#8fae98]"].map((c, i) => (
            <span key={c} className={cn("size-[1.5em] rounded-full ring-offset-[0.15em]", c, i === 0 && "ring-[0.12em] ring-foreground")} />
          ))}
        </div>
        <span className="mt-[1em] flex items-center justify-center gap-[0.5em] rounded-[0.7em] bg-accent py-[0.75em] text-[0.85em] font-medium text-accent-foreground">
          <Icons.ecommerce className="size-[1.2em]" /> Add to cart
        </span>
        <span className="mt-[0.6em] flex items-center justify-center gap-[0.4em] text-[0.7em] text-muted">
          <Icons.secure className="size-[1.1em]" /> Secure checkout
        </span>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* UI/UX design tool                                                    */
/* ------------------------------------------------------------------ */

function Wireframe({ selected }: { selected?: boolean }) {
  return (
    <div className="relative w-[12.5em] rounded-[1em] border border-border bg-background p-[0.8em] shadow-[0_0.6em_1.6em_-0.8em_rgb(15_17_21/0.25)]">
      <span className="mx-auto block h-[0.4em] w-[3em] rounded-full bg-border" />
      <span className="mt-[0.8em] block h-[4.5em] rounded-[0.6em] bg-linear-to-br from-accent/25 to-accent-2/20" />
      <Bar w="75%" className="mt-[0.8em] bg-foreground/70" />
      <Bar w="90%" className="mt-[0.5em]" />
      <Bar w="60%" className="mt-[0.4em]" />
      <div className="relative mt-[0.9em]">
        <span className="block h-[2em] rounded-[0.5em] bg-accent" />
        {selected && (
          <>
            <span className="absolute -inset-[0.3em] rounded-[0.3em] border-[0.12em] border-[#0d99ff]" />
            {["-left-[0.55em] -top-[0.55em]", "-right-[0.55em] -top-[0.55em]", "-left-[0.55em] -bottom-[0.55em]", "-right-[0.55em] -bottom-[0.55em]"].map((pos) => (
              <span key={pos} className={cn("absolute size-[0.5em] border-[0.12em] border-[#0d99ff] bg-white", pos)} />
            ))}
            <span className="absolute -bottom-[2em] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[0.3em] bg-[#0d99ff] px-[0.4em] py-[0.1em] text-[0.7em] font-medium text-white">
              240 × 48
            </span>
          </>
        )}
      </div>
      <div className="mt-[0.7em] grid grid-cols-2 gap-[0.5em]">
        <span className="h-[2.6em] rounded-[0.5em] border border-border" />
        <span className="h-[2.6em] rounded-[0.5em] border border-border" />
      </div>
    </div>
  );
}

export function DesignScreen() {
  return (
    <Screen unit={1.55} className="flex">
      <aside className="w-[12em] shrink-0 border-r border-border bg-background px-[1em] py-[1.1em]">
        <span className="text-[0.8em] font-semibold text-muted">Layers</span>
        <div className="mt-[0.7em] space-y-[0.45em]">
          {["65%", "50%", "70%", "45%", "60%"].map((w, i) => (
            <span key={i} className={cn("flex items-center gap-[0.5em] rounded-[0.35em] px-[0.4em] py-[0.35em]", i === 2 && "bg-[#0d99ff]/10")}>
              <span className={cn("size-[0.8em] rounded-[0.15em] border", i === 2 ? "border-[#0d99ff]" : "border-border-strong")} />
              <Bar w={w} className={i === 2 ? "bg-[#0d99ff]/60" : ""} />
            </span>
          ))}
        </div>
      </aside>
      <div
        className="relative flex flex-1 items-center justify-center gap-[2.5em] bg-subtle"
        style={{ backgroundImage: "radial-gradient(var(--color-border-strong) 0.08em, transparent 0.08em)", backgroundSize: "1.4em 1.4em" }}
      >
        <Wireframe />
        <Wireframe selected />
      </div>
      <aside className="w-[13em] shrink-0 border-l border-border bg-background px-[1em] py-[1.1em]">
        <span className="text-[0.8em] font-semibold text-muted">Fill</span>
        <div className="mt-[0.6em] flex gap-[0.4em]">
          {["bg-accent", "bg-accent-2", "bg-foreground", "bg-success", "bg-border-strong"].map((c) => (
            <span key={c} className={cn("size-[1.4em] rounded-[0.35em]", c)} />
          ))}
        </div>
        <span className="mt-[1.2em] block text-[0.8em] font-semibold text-muted">Text</span>
        <div className="mt-[0.5em] rounded-[0.4em] border border-border px-[0.6em] py-[0.4em] text-[0.8em]">Plus Jakarta · 16</div>
        <span className="mt-[1.2em] block text-[0.8em] font-semibold text-muted">Spacing</span>
        <div className="mt-[0.5em] grid grid-cols-2 gap-[0.4em] text-[0.8em]">
          {["16", "24", "12", "8"].map((v, i) => (
            <span key={i} className="rounded-[0.4em] border border-border px-[0.6em] py-[0.35em] tabular-nums text-muted">
              {v}
            </span>
          ))}
        </div>
      </aside>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* Custom business tool: scheduling board                               */
/* ------------------------------------------------------------------ */

const SHIFTS: { day: number; start: number; len: number; tone: string }[] = [
  { day: 0, start: 0, len: 2, tone: "bg-accent-subtle border-accent/40 text-accent" },
  { day: 0, start: 3, len: 1, tone: "bg-success-subtle border-success/40 text-success" },
  { day: 1, start: 1, len: 2, tone: "bg-info-subtle border-info/40 text-info" },
  { day: 2, start: 0, len: 1, tone: "bg-warning-subtle border-warning/40 text-warning" },
  { day: 2, start: 2, len: 2, tone: "bg-accent-subtle border-accent/40 text-accent" },
  { day: 3, start: 1, len: 1, tone: "bg-success-subtle border-success/40 text-success" },
  { day: 3, start: 3, len: 1, tone: "bg-info-subtle border-info/40 text-info" },
  { day: 4, start: 0, len: 3, tone: "bg-accent-subtle border-accent/40 text-accent" },
];

export function OperationsScreen() {
  return (
    <Screen unit={1.2} className="flex flex-col bg-background">
      <div className="flex h-[4em] items-center justify-between border-b border-border px-[2em]">
        <span className="flex items-center gap-[0.6em]">
          <span className="font-display text-[1.35em] font-bold tracking-tight">Schedule</span>
          <span className="rounded-full bg-subtle px-[0.7em] py-[0.2em] text-[0.8em] text-muted">This week</span>
        </span>
        <span className="flex items-center gap-[0.8em]">
          <span className="flex -space-x-[0.5em]">
            {["from-accent/70 to-accent-2/60", "from-success/60 to-accent/40", "from-warning/60 to-accent-2/40"].map((g) => (
              <span key={g} className={cn("size-[1.9em] rounded-full border-[0.15em] border-background bg-linear-to-br", g)} />
            ))}
          </span>
          <span className="flex items-center gap-[0.4em] rounded-[0.55em] bg-accent px-[0.9em] py-[0.45em] text-[0.85em] font-medium text-accent-foreground">
            <Icons.add className="size-[1.1em]" /> New booking
          </span>
        </span>
      </div>
      <div className="grid flex-1 grid-cols-[4em_repeat(5,1fr)] px-[2em] py-[1.2em]">
        <span />
        {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
          <span key={d} className="pb-[0.6em] text-center text-[0.8em] font-medium text-muted">
            {d}
          </span>
        ))}
        {[0, 1, 2, 3].map((row) => (
          <div key={row} className="contents">
            <span className="border-t border-border pt-[0.3em] text-[0.75em] tabular-nums text-faint">{["9:00", "11:00", "13:00", "15:00"][row]}</span>
            {[0, 1, 2, 3, 4].map((day) => {
              const shift = SHIFTS.find((s) => s.day === day && s.start === row);
              return (
                <div key={day} className="relative h-[3.6em] border-l border-t border-border">
                  {shift && (
                    <div className={cn("absolute inset-x-[0.3em] top-[0.3em] z-10 rounded-[0.45em] border p-[0.45em]", shift.tone)} style={{ height: `calc(${shift.len * 3.6}em - 0.6em)` }}>
                      <Bar w="70%" className="bg-current opacity-70" />
                      <Bar w="45%" className="mt-[0.35em] bg-current opacity-40" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* Custom solution: internal order tracking                              */
/* ------------------------------------------------------------------ */

const ORDERS: { id: string; status: "In progress" | "Ready" | "Delivered" | "On hold"; amount: string; w: string }[] = [
  { id: "#1048", status: "In progress", amount: "$1,240", w: "62%" },
  { id: "#1047", status: "Ready", amount: "$860", w: "48%" },
  { id: "#1046", status: "Delivered", amount: "$2,115", w: "56%" },
  { id: "#1045", status: "On hold", amount: "$430", w: "44%" },
  { id: "#1044", status: "Delivered", amount: "$975", w: "52%" },
  { id: "#1043", status: "Ready", amount: "$1,580", w: "58%" },
];

const ORDER_TONE = {
  "In progress": "bg-info-subtle text-info",
  Ready: "bg-accent-subtle text-accent",
  Delivered: "bg-success-subtle text-success",
  "On hold": "bg-warning-subtle text-warning",
} as const;

export function OrdersScreen() {
  return (
    <Screen unit={2.1} className="flex flex-col bg-canvas">
      <div className="flex h-[3.8em] items-center justify-between border-b border-border bg-background px-[1.6em]">
        <span className="flex items-center gap-[1.6em]">
          <Wordmark />
          <span className="flex gap-[1.2em] text-[0.85em] text-muted">
            <span className="font-medium text-foreground">Orders</span>
            <span>Stock</span>
            <span>Customers</span>
          </span>
        </span>
        <span className="flex items-center gap-[0.6em]">
          <span className="flex h-[2.1em] w-[9em] items-center gap-[0.4em] rounded-[0.5em] border border-border px-[0.6em] text-faint">
            <Icons.search className="size-[1.05em]" />
            <span className="text-[0.8em]">Search orders</span>
          </span>
          <span className="flex items-center gap-[0.35em] rounded-[0.5em] bg-foreground px-[0.8em] py-[0.45em] text-[0.8em] font-medium text-background">
            <Icons.add className="size-[1.05em]" /> New order
          </span>
        </span>
      </div>
      <div className="flex-1 p-[1.6em]">
        <div className="grid grid-cols-3 gap-[0.9em]">
          {[
            { label: "Open orders", value: "24", tone: "text-foreground" },
            { label: "Ready to ship", value: "7", tone: "text-accent" },
            { label: "Delivered this week", value: "41", tone: "text-success" },
          ].map((k) => (
            <div key={k.label} className="rounded-[0.8em] border border-border bg-background px-[1em] py-[0.8em]">
              <span className="text-[0.8em] text-muted">{k.label}</span>
              <span className={cn("mt-[0.2em] block font-display text-[1.7em] font-bold tracking-tight", k.tone)}>{k.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-[1em] overflow-hidden rounded-[0.8em] border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border px-[1em] py-[0.7em]">
            <span className="flex gap-[0.4em] text-[0.75em]">
              {["All", "In progress", "Ready", "Delivered"].map((t, i) => (
                <span key={t} className={cn("rounded-full px-[0.8em] py-[0.25em]", i === 0 ? "bg-foreground text-background" : "border border-border text-muted")}>
                  {t}
                </span>
              ))}
            </span>
            <span className="flex items-center gap-[0.3em] text-[0.75em] text-muted">
              <Icons.date className="size-[1.1em]" /> This week
            </span>
          </div>
          {ORDERS.map((o) => (
            <div key={o.id} className="grid grid-cols-[4.5em_1fr_7em_4.5em] items-center gap-[0.8em] border-b border-border px-[1em] py-[0.62em] text-[0.8em] last:border-0">
              <span className="font-medium tabular-nums">{o.id}</span>
              <span className="flex items-center gap-[0.6em]">
                <span className="size-[1.7em] shrink-0 rounded-full bg-linear-to-br from-accent/35 to-accent-2/20" />
                <Bar w={o.w} className="bg-foreground/60" />
              </span>
              <span className={cn("justify-self-start rounded-full px-[0.7em] py-[0.15em] text-[0.9em] font-medium", ORDER_TONE[o.status])}>{o.status}</span>
              <span className="text-right font-medium tabular-nums">{o.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* ------------------------------------------------------------------ */
/* ViperByte client portal (a real feature, simplified)            */
/* ------------------------------------------------------------------ */

export function PortalScreen() {
  const steps = ["Requirements", "Design", "Client review", "Development", "Launch"];
  return (
    <Screen unit={2.45} className="bg-canvas p-[1.3em]">
      <div className="flex items-center justify-between">
        <span>
          <span className="block text-[0.75em] text-faint">Your project</span>
          <span className="font-display text-[1.2em] font-bold tracking-tight">Website redesign</span>
        </span>
        <span className="rounded-full border border-warning-border bg-warning-subtle px-[0.7em] py-[0.2em] text-[0.75em] font-medium text-warning">Client review</span>
      </div>
      <div className="mt-[1em] flex items-center gap-[1.2em] rounded-[0.9em] border border-border bg-background p-[1em]">
        <svg viewBox="0 0 36 36" className="size-[4.2em] -rotate-90">
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-subtle)" strokeWidth="4" />
          <circle cx="18" cy="18" r="15" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray="94.2" strokeDashoffset="47" />
        </svg>
        <div className="space-y-[0.4em]">
          {steps.map((s, i) => (
            <span key={s} className="flex items-center gap-[0.5em] text-[0.75em]">
              {i < 2 ? (
                <Icons.success className="size-[1.2em] text-accent" />
              ) : i === 2 ? (
                <Icons.current className="size-[1.2em] text-accent" />
              ) : (
                <Icons.upcoming className="size-[1.2em] text-faint" />
              )}
              <span className={i > 2 ? "text-faint" : "text-foreground"}>{s}</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mt-[0.8em] flex items-center gap-[0.7em] rounded-[0.9em] border border-accent-border bg-accent-subtle p-[0.8em]">
        <span className="flex size-[2em] items-center justify-center rounded-[0.5em] bg-accent text-accent-foreground">
          <Icons.design className="size-[1.1em]" />
        </span>
        <span className="flex-1 text-[0.8em] font-medium">Homepage design is ready for review</span>
        <span className="rounded-[0.4em] bg-accent px-[0.6em] py-[0.25em] text-[0.7em] font-medium text-accent-foreground">Review</span>
      </div>
      <div className="mt-[0.8em] grid grid-cols-3 gap-[0.6em]">
        {[
          { icon: Icons.files, label: "Files" },
          { icon: Icons.messages, label: "Messages" },
          { icon: Icons.activity, label: "Activity" },
        ].map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-[0.5em] rounded-[0.7em] border border-border bg-background p-[0.65em] text-[0.75em] font-medium">
            <Icon className="size-[1.4em] text-accent" />
            {label}
          </span>
        ))}
      </div>
    </Screen>
  );
}
