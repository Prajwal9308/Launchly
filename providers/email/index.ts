import "server-only";

/**
 * Email abstraction. Only a console provider ships today: emails are written
 * to the server log instead of being sent. Add Resend/Postmark/SendGrid/SMTP by
 * implementing EmailProvider. Bodies are not logged in production.
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

let provider: EmailProvider | undefined;

export function getEmailProvider(): EmailProvider {
  if (provider) return provider;
  const kind = process.env.EMAIL_PROVIDER ?? "console";
  if (kind !== "console") {
    console.warn(`[email] Provider "${kind}" is not implemented; falling back to console.`);
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
