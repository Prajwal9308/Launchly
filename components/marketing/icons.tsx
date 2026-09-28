import { IconTile, Icons, type LucideIcon } from "@/components/ui/icons";

/**
 * String keys for icons chosen in content files and the database (service
 * icons are stored by key), mapped onto the Icons registry. The service keys
 * must stay stable because existing rows refer to them.
 */
export const CONTENT_ICONS: Record<string, LucideIcon> = {
  // Services (stored on Service.icon)
  monitor: Icons.web,
  smartphone: Icons.mobile,
  "pen-tool": Icons.uiDesign,
  "shopping-cart": Icons.ecommerce,
  "briefcase-business": Icons.customBusiness,
  "monitor-smartphone": Icons.crossPlatform,
  globe: Icons.website,
  workflow: Icons.process,
  "layout-dashboard": Icons.dashboard,
  palette: Icons.design,
  code: Icons.develop,
  layout: Icons.template,
  building: Icons.business,
  refresh: Icons.revision,
  search: Icons.search,
  wrench: Icons.maintenance,
  "file-text": Icons.document,
  megaphone: Icons.marketing,
  // Solutions, values and process steps
  "list-checks": Icons.checklist,
  target: Icons.goals,
  gauge: Icons.performance,
  compass: Icons.discover,
  "clipboard-list": Icons.requirements,
  "file-signature": Icons.scope,
  rocket: Icons.launch,
  // Section labels and working-together points
  quality: Icons.quality,
  users: Icons.clients,
  mail: Icons.email,
  tag: Icons.pricing,
  "circle-help": Icons.help,
  "shield-check": Icons.privacy,
  scale: Icons.terms,
  layers: Icons.services,
  briefcase: Icons.portfolio,
  notifications: Icons.notifications,
  "folder-kanban": Icons.project,
  "badge-check": Icons.approved,
  messages: Icons.messages,
};

export function contentIcon(name: string): LucideIcon {
  const icon = CONTENT_ICONS[name];
  if (!icon && process.env.NODE_ENV !== "production") console.warn(`Unknown icon key "${name}" — add it to CONTENT_ICONS.`);
  return icon ?? Icons.template;
}

export function NamedIcon({ name, className }: { name: string; className?: string }) {
  if (!(name in CONTENT_ICONS)) contentIcon(name); // dev warning for unknown keys
  const Icon = CONTENT_ICONS[name] ?? Icons.template;
  return <Icon className={className} aria-hidden />;
}

/**
 * A content icon in the shared tile. `lg` (48px tile, 24px icon) for feature
 * cards; `md` (40px, 20px) for compact rows and steps. Inside a `group` link the
 * tile fills with the accent colour on hover — a colour change, so nothing shifts.
 */
export function IconBadge({ name, size = "lg", className }: { name: string; size?: "md" | "lg"; className?: string }) {
  return <IconTile icon={contentIcon(name)} size={size} interactive className={className} />;
}
