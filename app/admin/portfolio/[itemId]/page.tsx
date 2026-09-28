import { Icons } from "@/components/ui/icons";
import { PageHeader } from "@/components/app/page-header";
import { PortfolioForm } from "@/components/admin/catalog-forms";
import { Card, CardContent } from "@/components/ui/card";
import { getPortfolioItem } from "@/services/catalog";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function EditPortfolioPage({ params }: { params: Promise<{ itemId: string }> }) {
  const { itemId } = await params;
  const actor = await requireAdminActor();
  const item = await orNotFound(getPortfolioItem(actor, itemId));
  return (
    <div className="max-w-3xl">
      <PageHeader icon={Icons.portfolio} breadcrumb={[{ label: "Portfolio", href: "/admin/portfolio" }, { label: item.title }]} title={item.title} />
      <Card>
        <CardContent>
          <PortfolioForm item={item} />
        </CardContent>
      </Card>
    </div>
  );
}
