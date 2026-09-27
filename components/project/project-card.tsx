import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ProjectStatus } from "@/db/enums";
import { Progress } from "@/components/ui/progress";
import { ProjectStatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { formatProjectNumber } from "@/lib/utils";

export function ProjectCard({
  project,
  href,
}: {
  project: { id: string; number: number; name: string; status: ProjectStatus; progress: number; createdAt: Date; business: { name: string } | null };
  href: string;
}) {
  return (
    <Link href={href} className="group block rounded-xl border border-border bg-background p-5 shadow-card transition-colors hover:border-border-strong">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-faint">{formatProjectNumber(project.number)}</p>
          <p className="mt-0.5 truncate text-sm font-semibold">{project.name}</p>
          <p className="truncate text-xs text-muted">{project.business?.name}</p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Progress value={project.progress} className="flex-1" label={`${project.name} progress`} />
        <span className="text-xs tabular-nums text-muted">{project.progress}%</span>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-faint">
        <span>Started {formatDate(project.createdAt)}</span>
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </div>
    </Link>
  );
}
