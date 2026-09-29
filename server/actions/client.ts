"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isStepKey } from "@/domain/questionnaire";
import { AppError, validation } from "@/lib/errors";
import { rateLimits } from "@/providers/rate-limit";
import { changePassword, updateProfile } from "@/services/accounts";
import { respondToApproval } from "@/services/approvals";
import { deleteFile } from "@/services/files";
import { sendMessage } from "@/services/messages";
import { saveQuestionnaireStep, startDraftProject, submitProject } from "@/services/projects";
import { approveDesign, requestRevision } from "@/services/reviews";
import { withActor, type ActionResult } from "../action";
import { getActor } from "../session";

const refresh = () => revalidatePath("/", "layout");

/** Resumes or creates the client's draft project, then opens the questionnaire. */
export async function startProjectAction() {
  const actor = await getActor();
  if (!actor) redirect("/login?callbackUrl=/start-project");
  const project = await startDraftProject(actor);
  redirect(`/start-project/${project.id}`);
}

export async function saveQuestionnaireStepAction(projectId: string, step: string, data: unknown): Promise<ActionResult> {
  return withActor(async (actor) => {
    if (!isStepKey(step) || step === "review") throw validation("This questionnaire step could not be found.");
    await saveQuestionnaireStep(actor, projectId, step, data);
  });
}

export async function submitProjectAction(projectId: string): Promise<ActionResult<{ id: string }>> {
  const result = await withActor(async (actor) => {
    const project = await submitProject(actor, projectId);
    refresh();
    return { id: project.id };
  });
  if (result.ok) redirect(`/start-project/${projectId}/submitted`);
  return result;
}

export async function sendMessageAction(projectId: string, body: string, attachmentIds: string[] = []) {
  return withActor(async (actor) => {
    const limit = await rateLimits.message().limit(`message:${actor.id}`);
    if (!limit.success) throw new AppError("RATE_LIMITED", "Too many requests were submitted in a short period. Please wait a moment and try again.");
    await sendMessage(actor, projectId, { body, attachmentIds });
    refresh();
  });
}

export async function deleteFileAction(fileId: string) {
  return withActor(async (actor) => {
    await deleteFile(actor, fileId);
    refresh();
  }, "The file has been removed.");
}

export async function requestRevisionAction(reviewId: string, body: string) {
  return withActor(async (actor) => {
    await requestRevision(actor, reviewId, { body });
    refresh();
  }, "Your change request has been submitted.");
}

export async function approveDesignAction(reviewId: string, confirm: boolean, comment: string) {
  return withActor(async (actor) => {
    await approveDesign(actor, reviewId, { confirm: confirm as true, comment });
    refresh();
  }, "Your approval has been recorded.");
}

export async function respondToApprovalAction(
  approvalId: string,
  input: { decision: "APPROVE"; confirm: boolean; comment?: string } | { decision: "CHANGES"; comment: string },
) {
  return withActor(async (actor) => {
    await respondToApproval(actor, approvalId, input as Parameters<typeof respondToApproval>[2]);
    refresh();
  }, input.decision === "APPROVE" ? "Your approval has been recorded." : "Your feedback has been submitted.");
}

export async function updateProfileAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  return withActor(async (actor) => {
    await updateProfile(actor, {
      firstName: String(form.get("firstName") ?? ""),
      lastName: String(form.get("lastName") ?? ""),
      phone: String(form.get("phone") ?? ""),
      country: (form.get("country") ? String(form.get("country")) : undefined) as never,
    });
    refresh();
  }, "Your profile has been updated.");
}

export async function changePasswordAction(_prev: ActionResult | null, form: FormData): Promise<ActionResult> {
  return withActor(async (actor) => {
    await changePassword(actor, {
      currentPassword: String(form.get("currentPassword") ?? ""),
      newPassword: String(form.get("newPassword") ?? ""),
      confirmPassword: String(form.get("confirmPassword") ?? ""),
    });
  }, "Your password has been changed.");
}
