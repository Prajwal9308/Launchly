import { Activity, CheckSquare, ClipboardList, FileStack, FolderKanban, LayoutDashboard, MessageSquare, Palette } from "lucide-react";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/app/page-header";
import { NavTabs } from "@/components/ui/tabs";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { formatProjectNumber } from "@/lib/utils";
import { loadProjectDetail } from "@/server/loaders";
import { orNotFound } from "@/server/guards";
import { requireClientActor } from "@/server/session";

export default async function ClientProjectLayout({ children, params }: { children: React.ReactNode; params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireClientActor(`/dashboard/project/${projectId}`);
  const project = await orNotFound(loadProjectDetail(actor, projectId));
  if (project.status === "DRAFT") redirect(`/start-project/${project.id}`);

  const base = `/dashboard/project/${project.id}`;
  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Dashboard", href: "/dashboard" }, { label: project.name }]}
        title={project.name}
        icon={FolderKanban}
        meta={
          <>
            <span className="text-faint">{formatProjectNumber(project.number)}</span>
            <ProjectStatusBadge status={project.status} />
          </>
        }
      />
      <NavTabs
        className="mb-6"
        tabs={[
          { href: base, label: "Overview", exact: true, icon: <LayoutDashboard /> },
          { href: `${base}/tasks`, label: "Tasks", icon: <CheckSquare /> },
          { href: `${base}/requirements`, label: "Requirements", icon: <ClipboardList /> },
          { href: `${base}/files`, label: "Files", icon: <FileStack /> },
          { href: `${base}/messages`, label: "Messages", icon: <MessageSquare />, count: project.unreadMessages },
          { href: `${base}/reviews`, label: "Design Reviews", icon: <Palette />, count: project.reviewsAwaiting.length + project.approvals.length },
          { href: `${base}/activity`, label: "Activity", icon: <Activity /> },
        ]}
      />
      {children}
    </div>
  );
}
