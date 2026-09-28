import { Sparkles, Tag } from "lucide-react";
import { NavTabs } from "@/components/ui/tabs";

export function CatalogTabs() {
  return (
    <NavTabs
      className="mb-6"
      tabs={[
        { href: "/admin/services", label: "Services", exact: true, icon: <Sparkles /> },
        { href: "/admin/services/pricing", label: "Pricing packages", icon: <Tag /> },
      ]}
    />
  );
}
