import { BRAND } from "@/lib/site";
import type { EmailMessage } from "./index";

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";

const SIGN_OFF = `Regards,\n${BRAND}`;

/** Joins paragraphs with a blank line between them. */
const body = (...paragraphs: (string | null | undefined | false)[]) => paragraphs.filter(Boolean).join("\n\n");

const hello = (firstName?: string | null) => (firstName ? `Hello ${firstName},` : "Hello,");

/** Plain-text transactional email templates. */
export const emailTemplates = {
  welcome: (to: string, firstName: string): EmailMessage => ({
    to,
    subject: `Welcome to ${BRAND}`,
    text: body(
      hello(firstName),
      `Your ${BRAND} client account is ready.`,
      "You can use your account to submit a project request, review project information, exchange files and communicate with our team.",
      `Access your client portal: ${appUrl()}/dashboard`,
      SIGN_OFF,
    ),
  }),
  projectReceived: (to: string, firstName: string, businessName: string, projectId: string): EmailMessage => ({
    to,
    subject: "We've received your project request",
    text: body(
      hello(firstName),
      `Thank you for submitting your project information for ${businessName}.`,
      "We've received your requirements and will review them before contacting you with the next steps.",
      `View your project: ${appUrl()}/dashboard/project/${projectId}`,
      SIGN_OFF,
    ),
  }),
  /** Sent to the client or to the studio, whichever side did not write the message. */
  newMessage: (to: string, projectName: string, href: string): EmailMessage => ({
    to,
    subject: `New message regarding ${projectName}`,
    text: body(
      `You have received a new message regarding ${projectName}.`,
      "Please sign in to review and respond.",
      `${appUrl()}${href}`,
      SIGN_OFF,
    ),
  }),
  designReady: (to: string, projectName: string, title: string, version: number, projectId: string): EmailMessage => ({
    to,
    subject: "Your design is ready for review",
    text: body(
      `A new design version for ${projectName} (${title}, version ${version}) is ready for your review.`,
      "Please review the design and either approve it or submit any requested changes through your client portal.",
      `Review design: ${appUrl()}/dashboard/project/${projectId}/reviews`,
      SIGN_OFF,
    ),
  }),
  revisionRequested: (to: string, projectName: string, href: string): EmailMessage => ({
    to,
    subject: `Changes requested on ${projectName}`,
    text: body(`The client has requested changes on ${projectName}.`, `Review the request: ${appUrl()}${href}`),
  }),
  approvalReceived: (to: string, projectName: string, what: string, href: string): EmailMessage => ({
    to,
    subject: `${what} received for ${projectName}`,
    text: body(`The client has approved: ${what}.`, `View the project: ${appUrl()}${href}`),
  }),
  approvalRequested: (to: string, projectName: string, projectId: string): EmailMessage => ({
    to,
    subject: `Your approval is required for ${projectName}`,
    text: body(
      "The next stage of your project requires your review and approval.",
      "Please sign in to your client portal to review the requested item.",
      `Review project: ${appUrl()}/dashboard/project/${projectId}/reviews`,
      SIGN_OFF,
    ),
  }),
  projectLaunched: (
    to: string,
    firstName: string,
    businessName: string,
    projectId: string,
    websiteUrl?: string | null,
  ): EmailMessage => ({
    to,
    subject: "Your website is now live",
    text: body(
      hello(firstName),
      `Your website for ${businessName} has been successfully launched.`,
      `Thank you for choosing ${BRAND}.`,
      websiteUrl ? `View your website: ${websiteUrl}` : null,
      `Access your client portal: ${appUrl()}/dashboard/project/${projectId}`,
      SIGN_OFF,
    ),
  }),
  newLead: (
    to: string,
    lead: {
      name: string;
      businessName?: string;
      email: string;
      phone?: string;
      country?: string;
      service?: string;
      budgetRange?: string;
      message: string;
    },
    leadId: string,
  ): EmailMessage => ({
    to,
    subject: `New enquiry from ${lead.name}${lead.businessName ? ` (${lead.businessName})` : ""}`,
    text: [
      `Name: ${lead.name}`,
      lead.businessName ? `Business: ${lead.businessName}` : null,
      `Email: ${lead.email}`,
      lead.phone ? `Phone: ${lead.phone}` : null,
      lead.country ? `Country: ${lead.country === "IN" ? "India" : lead.country === "CA" ? "Canada" : lead.country}` : null,
      lead.service ? `Looking for: ${lead.service}` : null,
      lead.budgetRange ? `Estimated budget: ${lead.budgetRange}` : null,
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
    subject: `Set up your ${BRAND} client account`,
    text: body(
      "Hello,",
      `We've set up a project for ${businessName} in the ${BRAND} client portal.`,
      "Create your client account with this email address to review your project, share files and communicate with our team:",
      `${appUrl()}/signup?email=${encodeURIComponent(to)}`,
      SIGN_OFF,
    ),
  }),
};
