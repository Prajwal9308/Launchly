import { ArrowRight, CalendarDays, FolderKanban } from "lucide-react";
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
    <Link href={href} className="group block surface rounded-2xl p-5 shadow-card transition-[border-color,box-shadow] duration-200 hover:border-accent-border hover:shadow-popover">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-subtle text-accent ring-1 ring-inset ring-accent-border/60 transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
          <FolderKanban className="size-[18px]" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
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
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden /> Started {formatDate(project.createdAt)}
        </span>
        <ArrowRight className="size-3.5 transition-[transform,color] group-hover:translate-x-0.5 group-hover:text-accent motion-reduce:transition-none" aria-hidden />
      </div>
    </Link>
  );
}
