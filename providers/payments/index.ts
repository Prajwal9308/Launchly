/**
 * Payments are intentionally NOT implemented in the MVP (see docs/roadmap.md,
 * Phase 2). This interface documents the intended integration surface so a
 * provider such as Stripe can be added without touching business logic.
 * Card details must never be stored by this application.
 */
export type PaymentKind = "DEPOSIT" | "MILESTONE" | "FINAL" | "MAINTENANCE_SUBSCRIPTION";

export interface CheckoutRequest {
  projectId: string;
  kind: PaymentKind;
  amountCents: number;
  description: string;
  customerEmail: string;
}

export interface PaymentProvider {
  readonly name: string;
  /** Returns a hosted checkout URL owned by the payment provider. */
  createCheckout(request: CheckoutRequest): Promise<{ url: string; externalId: string }>;
}
