import { afterEach, describe, expect, it, vi } from "vitest";
import { ResendEmailProvider } from "@/providers/email";
import { emailTemplates } from "@/providers/email/templates";

afterEach(() => vi.unstubAllGlobals());

describe("Resend email provider", () => {
  it("sends from the configured sender with the studio reply-to address", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    await new ResendEmailProvider("re_test", "CoreGravity <onboarding@resend.dev>", "studio@example.test").send({
      to: "client@example.test",
      subject: "Hello",
      text: "Body",
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer re_test");
    expect(JSON.parse(init.body)).toEqual({
      from: "CoreGravity <onboarding@resend.dev>",
      to: ["client@example.test"],
      subject: "Hello",
      text: "Body",
      reply_to: ["studio@example.test"],
    });
  });

  it("surfaces API errors so sendEmail can log them", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("domain not verified", { status: 403 })));
    await expect(new ResendEmailProvider("re_test", "x@example.test").send({ to: "a@example.test", subject: "s", text: "t" })).rejects.toThrow(/403/);
  });

  it("formats contact-form enquiries for the studio", () => {
    const mail = emailTemplates.newLead("studio@example.test", { name: "Pat", businessName: "Pat's Pizza", email: "pat@example.test", message: "Need a site" }, "lead-1");
    expect(mail.subject).toBe("New enquiry from Pat (Pat's Pizza)");
    expect(mail.text).toContain("Email: pat@example.test\n");
    expect(mail.text).toContain("/admin/leads/lead-1");
  });
});
