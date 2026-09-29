import path from "node:path";
import { expect, test, type Browser, type Page } from "@playwright/test";
import { ADMIN, expectToast, login } from "./utils";

/**
 * Complete happy path across the public site, client portal and studio admin:
 * visit → sign up → questionnaire → upload → submit → admin review → tasks →
 * design upload → client revision → v2 → client approval → activity.
 */

const DESIGN_PNG = path.join(process.cwd(), "tests/fixtures/homepage-design.png");
const LOGO_PNG = path.join(process.cwd(), "tests/fixtures/logo.png");

const run = Date.now().toString(36);
const client = {
  firstName: "Riley",
  lastName: "Nguyen",
  email: `riley.${run}@example.test`,
  password: "Riley-e2e-password-1",
  business: `Riverside Plumbing ${run}`,
};

test.describe.configure({ mode: "serial" });

/** Project section tab (scoped: the sidebar has links with the same names). */
function tab(page: Page, name: string) {
  return page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name, exact: true });
}

async function newPage(browser: Browser): Promise<Page> {
  const context = await browser.newContext();
  return context.newPage();
}

let projectUrl = "";
let projectId = "";

test("public site → sign up → questionnaire → upload → submit", async ({ page }) => {
  // 1. Visit the public website
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Websites and digital solutions built for your business" })).toBeVisible();
  await expect(page.getByText(/progress/i)).toHaveCount(0);
  await page.getByRole("link", { name: "Services", exact: true }).first().click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Professional digital services for small businesses");
  // Only sample (demo) work exists, so there is no public portfolio page.
  expect((await page.goto("/portfolio"))?.status()).toBe(404);

  // 2. Start project → contact page → project questionnaire → create account
  await page.goto("/");
  await page.getByRole("link", { name: "Start a Project" }).first().click();
  await expect(page).toHaveURL(/\/contact$/);
  await page.getByRole("link", { name: /Complete the project questionnaire/ }).click();
  await expect(page).toHaveURL(/\/start-project$/);
  await page.getByRole("link", { name: "Create Account" }).click();
  await page.getByLabel("First name").fill(client.firstName);
  await page.getByLabel("Last name").fill(client.lastName);
  await page.getByLabel("Email address").fill(client.email);
  await page.getByLabel("Business name").fill(client.business);
  await page.getByLabel("Country").selectOption("CA");
  await page.getByLabel("Phone").fill("555-010-7788");
  await page.getByLabel("Password").fill(client.password);
  await page.getByRole("button", { name: "Create Account" }).click();

  // 3. Begin the questionnaire
  await expect(page).toHaveURL(/\/start-project$/);
  await page.getByRole("button", { name: /Start a Project/ }).click();
  await expect(page).toHaveURL(/\/start-project\/[0-9a-f-]{36}$/);
  projectId = page.url().split("/").pop()!;

  // Business
  await expect(page.getByLabel("Business name")).toHaveValue(client.business);
  await page.getByLabel("Industry").selectOption("Plumbing");
  await page.getByLabel("Business description").fill("Residential plumbing repairs, water heater installs and drain cleaning.");
  await page.getByRole("button", { name: "Continue" }).click();

  // Goals
  await expect(page.getByRole("heading", { name: "What would you like your website to accomplish?" })).toBeVisible();
  await page.getByText("Increase phone calls").click();
  await page.getByLabel("Who are your ideal customers?").fill("Homeowners nearby");
  await page.getByRole("button", { name: "Continue" }).click();

  // Website
  await expect(page.getByRole("heading", { name: "What does your website need?" })).toBeVisible();
  for (const p of ["Home", "Services", "Contact"]) await page.getByText(p, { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Brand — upload a logo
  await expect(page.getByRole("heading", { name: "Tell us about your brand" })).toBeVisible();
  await page.locator('input[type="file"]').first().setInputFiles(LOGO_PNG);
  await expect(page.getByText("Uploaded").first()).toBeVisible();
  await page.getByText("Modern", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Content
  await expect(page.getByRole("heading", { name: "What content do you already have?" })).toBeVisible();
  await page.getByText("I have some content and need help with the rest.", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Inspiration → Features
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByRole("heading", { name: "What functionality do you need?" })).toBeVisible();
  await page.getByText("Contact form", { exact: true }).click();
  await page.getByRole("button", { name: "Continue" }).click();

  // Budget and timeline — budgets are in the country chosen at sign-up (Canada, CA$)
  await expect(page.getByRole("heading", { name: "Budget and timeline" })).toBeVisible();
  await page.getByText("CA$2,000 – CA$3,500").click();
  await page.getByText("1–3 months").click();
  await page.getByRole("button", { name: "Review Your Information" }).click();

  // Review & submit
  await expect(page.getByText("Everything looks good.")).toBeVisible();
  await expect(page.getByText("logo.png")).toBeVisible();
  await page.getByRole("button", { name: "Submit Project Request" }).click();
  await expect(page.getByRole("heading", { name: "We've received your project request." })).toBeVisible();
  await expect(page.getByText(client.business)).toBeVisible();

  // Client dashboard
  await page.getByRole("link", { name: "View My Project" }).click();
  await expect(page).toHaveURL(new RegExp(`/dashboard/project/${projectId}$`));
  projectUrl = page.url();
  await expect(page.getByText("Project Request Received").first()).toBeVisible();
  await page.goto("/dashboard");
  await expect(page.getByText(client.business).first()).toBeVisible();
  // Progress ring (derived from real project state) and the current stage.
  await expect(page.getByRole("img", { name: /complete: \d+%/ })).toBeVisible();
  await expect(page.getByText("Now", { exact: true })).toBeVisible();
  await expect(page.getByText("Requirements", { exact: true }).first()).toBeVisible();

  // Files uploaded during onboarding are visible on the project
  await page.goto(`${projectUrl}/files`);
  await expect(page.getByRole("link", { name: "logo.png", exact: true })).toBeVisible();
});

test("admin reviews the project, manages tasks and uploads a design", async ({ browser }) => {
  const page = await newPage(browser);
  await login(page, ADMIN.email, ADMIN.password);
  await expect(page).toHaveURL(/\/admin$/);

  // Find the new project
  await page.goto(`/admin/projects?q=${encodeURIComponent(client.business)}`);
  await page.getByRole("link", { name: `${client.firstName} ${client.lastName}` }).first().click();
  await expect(page).toHaveURL(new RegExp(`/admin/projects/${projectId}$`));
  await expect(page.getByText("Review new project request")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Project brief" })).toBeVisible();

  // Requirements
  await tab(page, "Requirements").click();
  await expect(page.getByText("Residential plumbing repairs")).toBeVisible();

  // Approve requirements → Planning
  await page.getByRole("button", { name: "Approve Requirements" }).click();
  await expectToast(page, "Requirements approved");
  await expect(page.getByText("Planning").first()).toBeVisible();

  // Complete a task
  await tab(page, "Tasks").click();
  await page.getByRole("checkbox", { name: "Complete “Create sitemap”" }).click();
  await expect(page.getByRole("checkbox", { name: "Mark “Create sitemap” as not done" })).toBeVisible();

  // Change status → Design
  await page.getByRole("button", { name: "Change Status" }).click();
  await page.getByLabel("New status").selectOption("DESIGN");
  await page.getByRole("button", { name: "Update Status" }).click();
  await expectToast(page, "Status updated");

  // Message the client
  await tab(page, "Messages").click();
  await page.getByRole("textbox", { name: "Message" }).fill("Thanks Riley — the homepage design is coming shortly.");
  await page.getByRole("button", { name: "Send" }).click();
  await expect(page.getByText("the homepage design is coming shortly")).toBeVisible();

  // Upload design + request review
  await tab(page, "Design Reviews").click();
  await page.getByRole("button", { name: "Upload Design" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.locator('input[type="file"]').setInputFiles(DESIGN_PNG);
  await expect(dialog.getByRole("button", { name: "Replace" })).toBeVisible();
  await dialog.getByRole("button", { name: "Upload and Request Review" }).click();
  await expectToast(page, "sent to the client");
  await expect(page.getByText("Awaiting review")).toBeVisible();
  await page.context().close();
});

test("client reviews the design and requests a revision", async ({ browser }) => {
  const page = await newPage(browser);
  await login(page, client.email, client.password);
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByText("Action required")).toBeVisible();
  await expect(page.getByText("Your design is ready for review").first()).toBeVisible();
  await page.getByRole("link", { name: /Review Design/ }).click();

  await expect(page.getByText("Your design is ready for review.")).toBeVisible();
  await page.getByRole("button", { name: "Request Changes" }).click();
  await page.getByLabel("What would you like changed?").fill("Please make the phone number larger in the header.");
  await page.getByRole("button", { name: "Submit Change Request" }).click();
  await expectToast(page, "change request has been submitted");
  await expect(page.getByText("Changes requested").first()).toBeVisible();
  await page.context().close();
});

test("admin sees the revision and uploads version 2", async ({ browser }) => {
  const page = await newPage(browser);
  await login(page, ADMIN.email, ADMIN.password);
  await page.goto(`/admin/projects/${projectId}/reviews`);
  await expect(page.getByText("Please make the phone number larger in the header.")).toBeVisible();
  await page.getByRole("button", { name: "Mark addressed" }).click();
  await expectToast(page, "Marked as addressed");

  await page.getByRole("button", { name: "Upload Design" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.locator('input[type="file"]').setInputFiles(DESIGN_PNG);
  await expect(dialog.getByRole("button", { name: "Replace" })).toBeVisible();
  await dialog.getByRole("button", { name: "Upload and Request Review" }).click();
  await expectToast(page, "sent to the client");
  await expect(page.getByRole("heading", { name: /Homepage · v2/ })).toBeVisible();
  await page.context().close();
});

test("client approves version 2 and sees it in activity", async ({ browser }) => {
  const page = await newPage(browser);
  await login(page, client.email, client.password);
  await page.goto(`/dashboard/project/${projectId}/reviews`);
  await expect(page.getByRole("heading", { name: /Homepage · v2/ })).toBeVisible();

  await page.getByRole("button", { name: "Approve Design" }).click();
  const dialog = page.getByRole("dialog");
  const confirm = dialog.getByRole("button", { name: "Confirm Approval" });
  await expect(confirm).toBeDisabled(); // explicit confirmation required
  await dialog.getByRole("checkbox").click();
  await confirm.click();
  await expectToast(page, "Your approval has been recorded");
  await expect(page.getByText(/Approved by Riley Nguyen/)).toBeVisible();

  await page.goto(`/dashboard/project/${projectId}/activity`);
  await expect(page.getByText("Homepage v2 approved")).toBeVisible();
  await expect(page.getByText("Changes requested on Homepage v1")).toBeVisible();
  // Internal events are not shown to clients
  await expect(page.getByText("Internal note added")).toHaveCount(0);
  await page.context().close();
});

test("admin sees the approval and activity", async ({ browser }) => {
  const page = await newPage(browser);
  await login(page, ADMIN.email, ADMIN.password);
  await page.goto(`/admin/projects/${projectId}/reviews`);
  await expect(page.getByRole("heading", { name: /Design approval/ })).toBeVisible();
  await expect(page.getByText("Homepage v2").first()).toBeVisible();
  await page.goto(`/admin/projects/${projectId}/activity`);
  await expect(page.getByText("Homepage v2 approved")).toBeVisible();
  // Logins are business-wide events, shown in the global activity feed.
  await page.goto("/admin/activity");
  await expect(page.getByText("Riley Nguyen logged in").first()).toBeVisible();
  await expect(page.getByText("Riley Nguyen created a client account")).toBeVisible();
  await page.context().close();
});

test("a client cannot open another client's project or admin pages", async ({ browser }) => {
  const page = await newPage(browser);
  await login(page, "client@example.com", ADMIN.password);
  await page.goto(`/dashboard/project/${projectId}`);
  await expect(page.getByText("We couldn't find this project.")).toBeVisible();
  const download = await page.request.get(`/api/files/00000000-0000-4000-8000-000000000000`);
  expect(download.status()).toBe(404);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard$/);
  await page.context().close();
});
