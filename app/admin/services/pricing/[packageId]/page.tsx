import { Tag } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { PricingForm } from "@/components/admin/catalog-forms";
import { Card, CardContent } from "@/components/ui/card";
import { getPricingPackage } from "@/services/catalog";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function EditPricingPage({ params }: { params: Promise<{ packageId: string }> }) {
  const { packageId } = await params;
  const actor = await requireAdminActor();
  const pkg = await orNotFound(getPricingPackage(actor, packageId));
  return (
    <div className="max-w-2xl">
      <PageHeader icon={Tag} breadcrumb={[{ label: "Pricing", href: "/admin/services/pricing" }, { label: pkg.name }]} title={pkg.name} />
      <Card>
        <CardContent>
          <PricingForm pkg={pkg} />
        </CardContent>
      </Card>
    </div>
  );
}
