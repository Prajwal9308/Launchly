import {
  Briefcase,
  Building2,
  Code2,
  FileText,
  HardHat,
  Home,
  LayoutTemplate,
  Megaphone,
  Palette,
  RefreshCw,
  Rocket,
  Scissors,
  Search,
  ShoppingCart,
  Smile,
  Store,
  UtensilsCrossed,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  code: Code2,
  layout: LayoutTemplate,
  building: Building2,
  "shopping-cart": ShoppingCart,
  refresh: RefreshCw,
  search: Search,
  wrench: Wrench,
  "file-text": FileText,
  megaphone: Megaphone,
  utensils: UtensilsCrossed,
  "hard-hat": HardHat,
  zap: Zap,
  scissors: Scissors,
  smile: Smile,
  home: Home,
  briefcase: Briefcase,
  store: Store,
  rocket: Rocket,
};

export function NamedIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? LayoutTemplate;
  return <Icon className={className} aria-hidden />;
}
