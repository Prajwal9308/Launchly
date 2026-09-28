import { Icons } from "@/components/ui/icons";
import { PageHeader } from "@/components/app/page-header";
import { ServiceForm } from "@/components/admin/catalog-forms";
import { Card, CardContent } from "@/components/ui/card";
import { requireAdminActor } from "@/server/session";

export default async function NewServicePage() {
  await requireAdminActor();
  return (
    <div className="max-w-2xl">
      <PageHeader icon={Icons.services} breadcrumb={[{ label: "Services", href: "/admin/services" }, { label: "New" }]} title="New service" />
      <Card>
        <CardContent>
          <ServiceForm />
        </CardContent>
      </Card>
    </div>
  );
}
