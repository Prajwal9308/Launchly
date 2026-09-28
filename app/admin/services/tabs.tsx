import { Icons } from "@/components/ui/icons";
import { NavTabs } from "@/components/ui/tabs";

export function CatalogTabs() {
  return (
    <NavTabs
      className="mb-6"
      tabs={[
        { href: "/admin/services", label: "Services", exact: true, icon: <Icons.services /> },
        { href: "/admin/services/pricing", label: "Pricing packages", icon: <Icons.pricing /> },
      ]}
    />
  );
}
