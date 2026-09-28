import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { NamedIcon } from "@/components/marketing/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { listAllServices } from "@/services/catalog";
import { requireAdminActor } from "@/server/session";
import { CatalogTabs } from "./tabs";

export const metadata: Metadata = { title: "Services" };

export default async function AdminServicesPage() {
  const actor = await requireAdminActor();
  const services = await listAllServices(actor);
  return (
    <div>
      <PageHeader
        icon={Sparkles}
        title="Services"
        description="Shown on the public website and offered in the project questionnaire."
        actions={
          <Button asChild>
            <Link href="/admin/services/new">
              <Plus /> New service
            </Link>
          </Button>
        }
      />
      <CatalogTabs />
      <Card className="overflow-hidden">
        {services.length === 0 ? (
          <EmptyState icon={Sparkles} title="No services yet" description="Add the services you offer." />
        ) : (
          <ul className="divide-y divide-border">
            {services.map((s) => (
              <li key={s.id}>
                <Link href={`/admin/services/${s.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-subtle">
                  <span className="flex size-8 items-center justify-center rounded-lg border border-border text-accent">
                    <NamedIcon name={s.icon} className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{s.name}</p>
                    <p className="truncate text-xs text-faint">{s.summary}</p>
                  </div>
                  {!s.published && <Badge>Hidden</Badge>}
                  <span className="text-xs tabular-nums text-faint">#{s.sortOrder}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
