import { Icons } from "@/components/ui/icons";
import { PageHeader } from "@/components/app/page-header";
import { PortfolioForm } from "@/components/admin/catalog-forms";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdminActor } from "@/server/session";

export default async function NewPortfolioPage() {
  await requireAdminActor();
  return (
    <div className="max-w-3xl">
      <PageHeader icon={Icons.portfolio} breadcrumb={[{ label: "Portfolio", href: "/admin/portfolio" }, { label: "New" }]} title="New portfolio project" />
      <Card>
        <CardContent>
          <PortfolioForm />
        </CardContent>
      </Card>
    </div>
  );
}
