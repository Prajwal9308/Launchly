"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { ActionResult } from "@/server/action";

/**
 * Like useActionState, but submits via onSubmit instead of <form action>.
 * React resets forms submitted through `action`, which wiped what people
 * typed whenever validation failed. Submitting in a transition keeps it.
 */
export function useFormAction(action: (prev: ActionResult | null, form: FormData) => Promise<ActionResult>) {
  const [state, dispatch, pending] = useActionState(action, null);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    startTransition(() => dispatch(data));
  };
  return { state, onSubmit, pending };
}
