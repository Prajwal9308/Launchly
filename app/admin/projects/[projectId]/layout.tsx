import { Icons } from "@/components/ui/icons";
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
        icon={Icons.project}
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
          { href: base, label: "Overview", exact: true, icon: <Icons.dashboard /> },
          { href: `${base}/requirements`, label: "Requirements", icon: <Icons.requirements /> },
          { href: `${base}/tasks`, label: "Tasks", icon: <Icons.tasks /> },
          { href: `${base}/files`, label: "Files", icon: <Icons.files /> },
          { href: `${base}/messages`, label: "Messages", icon: <Icons.messages />, count: project.unreadMessages },
          { href: `${base}/reviews`, label: "Design Reviews", icon: <Icons.design />, count: project._count.revisionRequests },
          { href: `${base}/activity`, label: "Activity", icon: <Icons.activity /> },
          { href: `${base}/notes`, label: "Internal Notes", icon: <Icons.notes /> },
        ]}
      />
      {children}
    </div>
  );
}
