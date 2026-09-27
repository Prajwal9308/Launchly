"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { LeadStatus, ProjectStatus } from "@/db/enums";
import { PROJECT_STATUSES } from "@/domain/project-status";
import { validation } from "@/lib/errors";
import { cancelApproval, requestApproval } from "@/services/approvals";
import { generateAIBrief } from "@/services/briefs";
import {
  deletePortfolioItem,
  deletePricingPackage,
  deleteService,
  savePortfolioItem,
  savePricingPackage,
  saveService,
  updateSiteSettings,
} from "@/services/catalog";
import { convertLead, updateLeadStatus } from "@/services/leads";
import { addInternalNote } from "@/services/notes";
import { approveRequirements, changeProjectStatus, markLaunched, requestInformation } from "@/services/projects";
import { addRequirement, deleteRequirement } from "@/services/requirements";
import { createDesignReview, requestDesignReview, resolveRevision } from "@/services/reviews";
import { createTask, deleteTask, setTaskStatus, updateTask, type TaskInput } from "@/services/tasks";
import { withActor, type ActionResult } from "../action";

/** Every admin action re-checks the admin role inside the service layer. */
const refresh = () => revalidatePath("/", "layout");
const statusSchema = z.enum(PROJECT_STATUSES);

// Projects ------------------------------------------------------------------

export async function changeStatusAction(projectId: string, to: string, note?: string) {
  return withActor(async (actor) => {
    const parsed = statusSchema.safeParse(to);
    if (!parsed.success) throw validation("Choose a valid status.");
    await changeProjectStatus(actor, projectId, parsed.data as ProjectStatus, note);
    refresh();
  }, "Status updated.");
}

export async function approveRequirementsAction(projectId: string) {
  return withActor(async (actor) => {
    await approveRequirements(actor, projectId);
    refresh();
  }, "Requirements approved. Project moved to discovery.");
}

export async function requestInformationAction(projectId: string, message: string) {
  return withActor(async (actor) => {
    await requestInformation(actor, projectId, message);
    refresh();
  }, "Request sent to the client.");
}

export async function markLaunchedAction(projectId: string) {
  return withActor(async (actor) => {
    await markLaunched(actor, projectId);
    refresh();
  }, "Project marked as launched.");
}

export async function generateBriefAction(projectId: string) {
  return withActor(async (actor) => {
    await generateAIBrief(actor, projectId);
    refresh();
  }, "AI brief generated.");
}

export async function addNoteAction(projectId: string, body: string) {
  return withActor(async (actor) => {
    await addInternalNote(actor, projectId, { body });
    refresh();
  }, "Note saved.");
}

export async function addRequirementAction(projectId: string, input: { section: string; label: string; value: string }) {
  return withActor(async (actor) => {
    await addRequirement(actor, projectId, input);
    refresh();
  }, "Requirement added.");
}

export async function deleteRequirementAction(requirementId: string) {
  return withActor(async (actor) => {
    await deleteRequirement(actor, requirementId);
    refresh();
  }, "Requirement removed.");
}

// Tasks ---------------------------------------------------------------------

export async function createTaskAction(projectId: string, input: TaskInput) {
  return withActor(async (actor) => {
    await createTask(actor, projectId, input);
    refresh();
  }, "Task created.");
}

export async function updateTaskAction(taskId: string, input: TaskInput) {
  return withActor(async (actor) => {
    await updateTask(actor, taskId, input);
    refresh();
  }, "Task updated.");
}

export async function setTaskStatusAction(taskId: string, status: "TODO" | "IN_PROGRESS" | "BLOCKED" | "DONE") {
  return withActor(async (actor) => {
    await setTaskStatus(actor, taskId, status);
    refresh();
  });
}

export async function deleteTaskAction(taskId: string) {
  return withActor(async (actor) => {
    await deleteTask(actor, taskId);
    refresh();
  }, "Task deleted.");
}

// Design reviews & approvals --------------------------------------------------

export async function createDesignReviewAction(
  projectId: string,
  input: { title: string; fileId?: string; previewUrl?: string; notes?: string; requestReview: boolean },
) {
  return withActor(async (actor) => {
    await createDesignReview(actor, projectId, input);
    refresh();
  }, input.requestReview ? "Design uploaded and sent to the client." : "Design uploaded as a draft.");
}

export async function requestDesignReviewAction(reviewId: string) {
  return withActor(async (actor) => {
    await requestDesignReview(actor, reviewId);
    refresh();
  }, "Review requested. The client has been notified.");
}

export async function resolveRevisionAction(revisionId: string) {
  return withActor(async (actor) => {
    await resolveRevision(actor, revisionId);
    refresh();
  }, "Marked as addressed.");
}

export async function requestApprovalAction(projectId: string, input: { type: "FINAL_APPROVAL" | "LAUNCH_APPROVAL"; message?: string }) {
  return withActor(async (actor) => {
    await requestApproval(actor, projectId, input);
    refresh();
  }, "Approval requested. The client has been notified.");
}

export async function cancelApprovalAction(approvalId: string) {
  return withActor(async (actor) => {
    await cancelApproval(actor, approvalId);
    refresh();
  }, "Approval request withdrawn.");
}

// Leads ---------------------------------------------------------------------

export async function updateLeadStatusAction(leadId: string, status: LeadStatus) {
  return withActor(async (actor) => {
    await updateLeadStatus(actor, leadId, status);
    refresh();
  }, "Lead updated.");
}

export async function convertLeadAction(leadId: string) {
  const result = await withActor(async (actor) => {
    const converted = await convertLead(actor, leadId);
    refresh();
    return converted;
  });
  if (result.ok && result.data) redirect(`/admin/projects/${result.data.projectId}`);
  return result;
}

// Catalog -------------------------------------------------------------------

const bool = (form: FormData, key: string) => form.get(key) === "on" || form.get(key) === "true";
const str = (form: FormData, key: string) => String(form.get(key) ?? "");

export async function saveServiceAction(id: string | null, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const result = await withActor(async (actor) => {
    await saveService(actor, id, {
      name: str(form, "name"),
      summary: str(form, "summary"),
      description: str(form, "description"),
      features: str(form, "features"),
      pricingText: str(form, "pricingText"),
      icon: str(form, "icon") as never,
      published: bool(form, "published"),
      sortOrder: str(form, "sortOrder") as never,
    });
    refresh();
  });
  if (result.ok) redirect("/admin/services");
  return result;
}

export async function deleteServiceAction(id: string) {
  const result = await withActor(async (actor) => {
    await deleteService(actor, id);
    refresh();
  });
  if (result.ok) redirect("/admin/services");
  return result;
}

export async function savePricingAction(id: string | null, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const result = await withActor(async (actor) => {
    await savePricingPackage(actor, id, {
      name: str(form, "name"),
      description: str(form, "description"),
      price: str(form, "price"),
      pricePrefix: str(form, "pricePrefix"),
      features: str(form, "features"),
      highlighted: bool(form, "highlighted"),
      published: bool(form, "published"),
      sortOrder: str(form, "sortOrder") as never,
    });
    refresh();
  });
  if (result.ok) redirect("/admin/services/pricing");
  return result;
}

export async function deletePricingAction(id: string) {
  const result = await withActor(async (actor) => {
    await deletePricingPackage(actor, id);
    refresh();
  });
  if (result.ok) redirect("/admin/services/pricing");
  return result;
}

export async function savePortfolioAction(id: string | null, _prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  const result = await withActor(async (actor) => {
    await savePortfolioItem(actor, id, {
      title: str(form, "title"),
      description: str(form, "description"),
      industry: str(form, "industry"),
      services: str(form, "services"),
      imageUrl: str(form, "imageUrl"),
      url: str(form, "url"),
      featured: bool(form, "featured"),
      published: bool(form, "published"),
      isDemo: bool(form, "isDemo"),
      sortOrder: str(form, "sortOrder") as never,
    });
    refresh();
  });
  if (result.ok) redirect("/admin/portfolio");
  return result;
}

export async function deletePortfolioAction(id: string) {
  const result = await withActor(async (actor) => {
    await deletePortfolioItem(actor, id);
    refresh();
  });
  if (result.ok) redirect("/admin/portfolio");
  return result;
}

export async function updateSettingsAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  return withActor(async (actor) => {
    await updateSiteSettings(actor, {
      businessName: str(form, "businessName"),
      tagline: str(form, "tagline"),
      contactEmail: str(form, "contactEmail"),
      contactPhone: str(form, "contactPhone"),
      serviceArea: str(form, "serviceArea"),
    });
    refresh();
  }, "Settings saved.");
}
