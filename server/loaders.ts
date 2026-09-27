import "server-only";
import { cache } from "react";
import type { Actor } from "@/services/actor";
import { getProjectDetail } from "@/services/project-queries";

/** Request-scoped memoization so layouts and pages share one query. */
export const loadProjectDetail = cache((actor: Actor, projectId: string) => getProjectDetail(actor, projectId));
