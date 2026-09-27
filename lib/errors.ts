/**
 * Application errors. Services throw these; the action/route layer converts
 * them into safe user-facing responses. Never include internals in messages.
 */
export type AppErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "INVALID_TRANSITION";

export class AppError extends Error {
  readonly code: AppErrorCode;
  readonly fieldErrors?: Record<string, string[]>;

  constructor(code: AppErrorCode, message: string, fieldErrors?: Record<string, string[]>) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}

export const unauthenticated = () => new AppError("UNAUTHENTICATED", "Please log in to continue.");
export const forbidden = (message = "You don't have permission to do that.") =>
  new AppError("FORBIDDEN", message);
export const notFound = (message = "This item could not be found.") => new AppError("NOT_FOUND", message);
export const validation = (message = "Please correct the highlighted fields.", fieldErrors?: Record<string, string[]>) =>
  new AppError("VALIDATION", message, fieldErrors);
export const conflict = (message: string) => new AppError("CONFLICT", message);

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export const HTTP_STATUS: Record<AppErrorCode, number> = {
  UNAUTHENTICATED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION: 400,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  INVALID_TRANSITION: 409,
};
