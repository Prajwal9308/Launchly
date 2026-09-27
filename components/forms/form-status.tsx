import { Alert } from "@/components/ui/alert";
import type { ActionResult } from "@/server/action";

/** Shows the form-level result of a server action. Field errors render next to fields. */
export function FormStatus({ state, showSuccess = true }: { state: ActionResult | null; showSuccess?: boolean }) {
  if (!state) return null;
  if (!state.ok) return <Alert tone="danger" title={state.error} />;
  if (showSuccess && state.message) return <Alert tone="success" title={state.message} />;
  return null;
}

export function fieldError(state: ActionResult | null, name: string) {
  return state && !state.ok ? state.fieldErrors?.[name]?.[0] : undefined;
}
