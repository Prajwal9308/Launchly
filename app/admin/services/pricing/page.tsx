import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/format";
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
        icon={Tag}
        title="Services"
        description="Packages without a price show “Let's discuss your project” on the website."
        actions={
          <Button asChild>
            <Link href="/admin/services/pricing/new">
              <Plus /> New package
            </Link>
          </Button>
        }
      />
      <CatalogTabs />
      <Card className="overflow-hidden">
        {packages.length === 0 ? (
          <EmptyState icon={Tag} title="No pricing packages" description="Add packages to show on the pricing page." />
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
                  <span className="text-sm tabular-nums text-muted">
                    {p.priceCents != null ? `${p.pricePrefix ? `${p.pricePrefix} ` : ""}${formatPrice(p.priceCents)}` : "Not priced"}
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
