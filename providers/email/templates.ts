import type { EmailMessage } from "./index";

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";

/** Plain-text transactional email templates. */
export const emailTemplates = {
  welcome: (to: string, firstName: string): EmailMessage => ({
    to,
    subject: "Welcome — your client account is ready",
    text: `Hi ${firstName},\n\nYour account is ready. You can start a project or check on an existing one at any time:\n${appUrl()}/dashboard`,
  }),
  projectReceived: (to: string, businessName: string, projectId: string): EmailMessage => ({
    to,
    subject: `We've received your project for ${businessName}`,
    text: `Thanks — we've received your project details and will review them before the next step.\n\nView your project: ${appUrl()}/dashboard/project/${projectId}`,
  }),
  newMessage: (to: string, projectName: string, href: string): EmailMessage => ({
    to,
    subject: `New message about ${projectName}`,
    text: `You have a new message about ${projectName}.\n\nRead it here: ${appUrl()}${href}`,
  }),
  designReady: (to: string, title: string, version: number, projectId: string): EmailMessage => ({
    to,
    subject: `Your ${title} design (v${version}) is ready for review`,
    text: `A new design is ready for your review.\n\nReview it here: ${appUrl()}/dashboard/project/${projectId}/reviews`,
  }),
  revisionRequested: (to: string, projectName: string, href: string): EmailMessage => ({
    to,
    subject: `Revision requested on ${projectName}`,
    text: `The client requested changes.\n\n${appUrl()}${href}`,
  }),
  approvalReceived: (to: string, projectName: string, what: string, href: string): EmailMessage => ({
    to,
    subject: `${what} approved on ${projectName}`,
    text: `The client approved: ${what}.\n\n${appUrl()}${href}`,
  }),
  approvalRequested: (to: string, projectName: string, projectId: string): EmailMessage => ({
    to,
    subject: `Your approval is needed for ${projectName}`,
    text: `Please review and approve your project.\n\n${appUrl()}/dashboard/project/${projectId}/reviews`,
  }),
  projectLaunched: (to: string, projectName: string, projectId: string): EmailMessage => ({
    to,
    subject: `${projectName} is live`,
    text: `Your website has launched.\n\n${appUrl()}/dashboard/project/${projectId}`,
  }),
  newLead: (
    to: string,
    lead: { name: string; businessName?: string; email: string; phone?: string; service?: string; message: string },
    leadId: string,
  ): EmailMessage => ({
    to,
    subject: `New enquiry from ${lead.name}${lead.businessName ? ` (${lead.businessName})` : ""}`,
    text: [
      `Name: ${lead.name}`,
      lead.businessName ? `Business: ${lead.businessName}` : null,
      `Email: ${lead.email}`,
      lead.phone ? `Phone: ${lead.phone}` : null,
      lead.service ? `Service: ${lead.service}` : null,
      "",
      lead.message,
      "",
      `${appUrl()}/admin/leads/${leadId}`,
    ]
      .filter((line) => line !== null)
      .join("\n"),
  }),
  invite: (to: string, businessName: string): EmailMessage => ({
    to,
    subject: `Set up your client account for ${businessName}`,
    text: `We've set up a project for ${businessName}. Create your account with this email address to get started:\n${appUrl()}/signup?email=${encodeURIComponent(to)}`,
  }),
};
