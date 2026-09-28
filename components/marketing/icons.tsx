import {
  Briefcase,
  BriefcaseBusiness,
  Building2,
  ClipboardList,
  Code2,
  Compass,
  FileText,
  Gauge,
  Globe,
  Layers,
  LayoutDashboard,
  LayoutTemplate,
  ListChecks,
  Megaphone,
  Monitor,
  MonitorSmartphone,
  Palette,
  PenTool,
  RefreshCw,
  Rocket,
  Search,
  ShoppingCart,
  Smartphone,
  Target,
  Workflow,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * The site's single icon system: Lucide outline icons at the default 2px
 * stroke, always in the accent colour. Content and the database refer to
 * icons by these keys, so every icon on the site comes from this map.
 */
const ICONS: Record<string, LucideIcon> = {
  // Services
  monitor: Monitor,
  smartphone: Smartphone,
  "pen-tool": PenTool,
  "shopping-cart": ShoppingCart,
  "briefcase-business": BriefcaseBusiness,
  // Solutions and values
  globe: Globe,
  "layout-dashboard": LayoutDashboard,
  "monitor-smartphone": MonitorSmartphone,
  "list-checks": ListChecks,
  code: Code2,
  target: Target,
  gauge: Gauge,
  // Process
  compass: Compass,
  "clipboard-list": ClipboardList,
  rocket: Rocket,
  // Other choices offered in the admin service editor
  workflow: Workflow,
  layers: Layers,
  palette: Palette,
  layout: LayoutTemplate,
  building: Building2,
  briefcase: Briefcase,
  refresh: RefreshCw,
  search: Search,
  wrench: Wrench,
  "file-text": FileText,
  megaphone: Megaphone,
};

export type IconName = keyof typeof ICONS;

export function NamedIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LayoutTemplate;
  return <Icon className={className} aria-hidden />;
}

const BADGE_SIZES = {
  md: { box: "size-11 rounded-xl", icon: "size-5" },
  sm: { box: "size-9 rounded-lg", icon: "size-[18px]" },
} as const;

/**
 * Icon in a soft accent tile — the one container style used for services,
 * solutions, values and process steps. Decorative: the adjacent heading
 * carries the meaning. Inside a `group` link it fills with the accent colour on
 * hover — a colour change rather than movement, so nothing shifts.
 */
export function IconBadge({ name, size = "md", className }: { name: string; size?: keyof typeof BADGE_SIZES; className?: string }) {
  const s = BADGE_SIZES[size];
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center bg-accent-subtle text-accent ring-1 ring-inset ring-accent-border/60 transition-colors duration-200 ease-out group-hover:bg-accent group-hover:text-accent-foreground group-hover:ring-accent group-focus-visible:bg-accent group-focus-visible:text-accent-foreground group-focus-visible:ring-accent",
        s.box,
        className,
      )}
    >
      <NamedIcon name={name} className={s.icon} />
    </span>
  );
}
