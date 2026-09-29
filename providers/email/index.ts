import "server-only";

/**
 * Email abstraction.
 * - "console": emails are written to the server log (development default).
 * - "resend":  sends via the Resend API (RESEND_API_KEY). EMAIL_FROM must use
 *   a domain verified in Resend, or Resend's test sender (onboarding@resend.dev,
 *   which only delivers to the Resend account's own email).
 * EMAIL_REPLY_TO makes replies go to the studio's inbox.
 */
export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
}

export interface EmailProvider {
  readonly name: string;
  send(message: EmailMessage): Promise<void>;
}

class ConsoleEmailProvider implements EmailProvider {
  readonly name = "console";
  async send(message: EmailMessage) {
    if (process.env.NODE_ENV === "test") return;
    const body = process.env.NODE_ENV === "production" ? "" : `\n${message.text}\n`;
    console.info(`[email:console] to=${message.to} subject="${message.subject}"${body}`);
  }
}

export class ResendEmailProvider implements EmailProvider {
  readonly name = "resend";

  constructor(
    private readonly apiKey: string,
    private readonly from: string,
    private readonly replyTo?: string,
  ) {}

  async send(message: EmailMessage) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: this.from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        ...(this.replyTo ? { reply_to: [this.replyTo] } : {}),
      }),
    });
    if (!response.ok) {
      throw new Error(`Resend responded ${response.status}: ${(await response.text()).slice(0, 200)}`);
    }
  }
}

let provider: EmailProvider | undefined;

export function getEmailProvider(): EmailProvider {
  if (provider) return provider;
  const kind = process.env.EMAIL_PROVIDER ?? "console";
  if (kind === "resend" && process.env.RESEND_API_KEY) {
    provider = new ResendEmailProvider(
      process.env.RESEND_API_KEY,
      process.env.EMAIL_FROM || "CoreGravity <onboarding@resend.dev>",
      process.env.EMAIL_REPLY_TO || undefined,
    );
    return provider;
  }
  if (kind !== "console") {
    console.warn(`[email] Provider "${kind}" is not configured (missing API key?); falling back to console.`);
  }
  provider = new ConsoleEmailProvider();
  return provider;
}

/** Sends an email without letting delivery failures break the calling action. */
export async function sendEmail(message: EmailMessage) {
  try {
    await getEmailProvider().send(message);
  } catch (error) {
    console.error("[email] send failed", error instanceof Error ? error.message : "unknown error");
  }
}

/** Where studio-facing emails go: STUDIO_NOTIFY_EMAIL if set, otherwise each admin's own email. */
export function studioEmailOverride() {
  return process.env.STUDIO_NOTIFY_EMAIL?.trim() || null;
}
