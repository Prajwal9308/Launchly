import { Activity, CheckSquare, ClipboardList, FileStack, FolderKanban, LayoutDashboard, MessageSquare, Palette, StickyNote } from "lucide-react";
import { PageHeader } from "@/components/app/page-header";
import { StatusControl } from "@/components/admin/status-control";
import { WorkflowActions } from "@/components/admin/workflow-actions";
import { NavTabs } from "@/components/ui/tabs";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { allowedTransitions } from "@/domain/project-status";
import { formatRelative } from "@/lib/format";
import { formatProjectNumber } from "@/lib/utils";
import { orNotFound } from "@/server/guards";
import { loadProjectDetail } from "@/server/loaders";
import { requireAdminActor } from "@/server/session";

export default async function AdminProjectLayout({ children, params }: { children: React.ReactNode; params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const actor = await requireAdminActor();
  const project = await orNotFound(loadProjectDetail(actor, projectId));
  const base = `/admin/projects/${project.id}`;
  const allowed = allowedTransitions(project.status, project.statusBeforeHold);

  return (
    <div>
      <PageHeader
        breadcrumb={[{ label: "Projects", href: "/admin/projects" }, { label: project.business?.name ?? project.name }]}
        title={project.business?.name ?? project.name}
        icon={FolderKanban}
        meta={
          <>
            <span className="text-faint">{formatProjectNumber(project.number)}</span>
            <ProjectStatusBadge status={project.status} />
            <span className="text-faint">Updated {formatRelative(project.lastActivityAt)}</span>
          </>
        }
        actions={
          <>
            <WorkflowActions projectId={project.id} status={project.status} hasPendingFinal={project.approvals.some((a) => a.type === "FINAL_APPROVAL")} />
            {project.status !== "DRAFT" && <StatusControl projectId={project.id} current={project.status} allowed={allowed} />}
          </>
        }
      />
      <NavTabs
        className="mb-6"
        tabs={[
          { href: base, label: "Overview", exact: true, icon: <LayoutDashboard /> },
          { href: `${base}/requirements`, label: "Requirements", icon: <ClipboardList /> },
          { href: `${base}/tasks`, label: "Tasks", icon: <CheckSquare /> },
          { href: `${base}/files`, label: "Files", icon: <FileStack /> },
          { href: `${base}/messages`, label: "Messages", icon: <MessageSquare />, count: project.unreadMessages },
          { href: `${base}/reviews`, label: "Design Reviews", icon: <Palette />, count: project._count.revisionRequests },
          { href: `${base}/activity`, label: "Activity", icon: <Activity /> },
          { href: `${base}/notes`, label: "Internal Notes", icon: <StickyNote /> },
        ]}
      />
      {children}
    </div>
  );
}
