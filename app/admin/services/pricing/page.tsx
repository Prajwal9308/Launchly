import type { Metadata } from "next";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatMoney } from "@/domain/country";
import { listAllPricing } from "@/services/catalog";
import { requireAdminActor } from "@/server/session";
import { CatalogTabs } from "../tabs";

export const metadata: Metadata = { title: "Pricing" };

export default async function AdminPricingPage() {
  const actor = await requireAdminActor();
  const packages = await listAllPricing(actor);
  return (
    <div>
      <PageHeader
        icon={Icons.pricing}
        title="Pricing"
        description="Set a Canada (CAD) and India (INR) price for each package. A package without a price for a country shows “Quoted per project” to visitors from that country."
        actions={
          <Button asChild>
            <Link href="/admin/services/pricing/new">
              <Icons.add /> New Package
            </Link>
          </Button>
        }
      />
      <CatalogTabs />
      <Card className="overflow-hidden">
        {packages.length === 0 ? (
          <EmptyState icon={Icons.pricing} title="No pricing packages" description="Add packages to show on the Pricing page." />
        ) : (
          <ul className="divide-y divide-border">
            {packages.map((p) => (
              <li key={p.id}>
                <Link href={`/admin/services/pricing/${p.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-subtle">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="truncate text-xs text-faint">{p.description}</p>
                  </div>
                  {p.highlighted && <Badge tone="accent">Highlighted</Badge>}
                  {!p.published && <Badge>Hidden</Badge>}
                  <span className="grid text-right text-xs tabular-nums text-muted">
                    <span>Canada: {p.priceCad != null ? formatMoney(p.priceCad, "CA") : "Not priced"}</span>
                    <span>India: {p.priceInr != null ? formatMoney(p.priceInr, "IN") : "Not priced"}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
