import "server-only";
import { notFound } from "next/navigation";
import { isAppError } from "@/lib/errors";

/** Renders the not-found page for NOT_FOUND/FORBIDDEN errors (no information leak). */
export async function orNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (isAppError(error) && (error.code === "NOT_FOUND" || error.code === "FORBIDDEN")) notFound();
    throw error;
  }
}
