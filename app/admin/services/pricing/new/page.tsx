import { Tag } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { PricingForm } from "@/components/admin/catalog-forms";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdminActor } from "@/server/session";

export default async function NewPricingPage() {
  await requireAdminActor();
  return (
    <div className="max-w-2xl">
      <PageHeader icon={Tag} breadcrumb={[{ label: "Pricing", href: "/admin/services/pricing" }, { label: "New" }]} title="New package" />
      <Card>
        <CardContent>
          <PricingForm />
        </CardContent>
      </Card>
    </div>
  );
}
