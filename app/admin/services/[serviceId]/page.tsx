import { Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { ServiceForm } from "@/components/admin/catalog-forms";
import { Card, CardContent } from "@/components/ui/card";
import { getService } from "@/services/catalog";
import { orNotFound } from "@/server/guards";
import { requireAdminActor } from "@/server/session";

export default async function EditServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params;
  const actor = await requireAdminActor();
  const service = await orNotFound(getService(actor, serviceId));
  return (
    <div className="max-w-2xl">
      <PageHeader icon={Sparkles} breadcrumb={[{ label: "Services", href: "/admin/services" }, { label: service.name }]} title={service.name} />
      <Card>
        <CardContent>
          <ServiceForm service={service} />
        </CardContent>
      </Card>
    </div>
  );
}
