import type { Metadata } from "next";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import { PageHeader } from "@/components/app/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listAllPortfolio } from "@/services/catalog";
import { requireAdminActor } from "@/server/session";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const actor = await requireAdminActor();
  const items = await listAllPortfolio(actor);
  return (
    <div>
      <PageHeader
        icon={Icons.portfolio}
        title="Portfolio"
        description="Only real, delivered client work is shown on the public Portfolio page. Sample projects are kept here for reference and are never shown publicly."
        actions={
          <Button asChild>
            <Link href="/admin/portfolio/new">
              <Icons.add /> New Portfolio Item
            </Link>
          </Button>
        }
      />
      <Card className="overflow-hidden">
        {items.length === 0 ? (
          <EmptyState icon={Icons.portfolio} title="No portfolio items" description="Add a delivered client project to show it on the website." />
        ) : (
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id}>
                <Link href={`/admin/portfolio/${item.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-subtle">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-faint">{item.industry}</p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {item.isDemo && <Badge tone="outline">Sample Project</Badge>}
                    {item.featured && <Badge tone="accent">Featured</Badge>}
                    {!item.published && <Badge>Hidden</Badge>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
