import { expect, test } from "@playwright/test";

/** Regression: validation errors must not wipe what the visitor typed, and short messages are accepted. */
test("contact form keeps input on error and accepts a short message", async ({ page }) => {
  await page.goto("/contact");
  const form = page.getByRole("form", { name: "Project enquiry" });
  await form.getByLabel("Full name").fill("Jamie");
  await form.getByLabel("Business name").fill("Jamie's Café");
  await form.getByLabel("Email address").fill("not-an-email");
  await form.getByLabel("Country").selectOption("CA");
  await expect(form.getByLabel("Estimated budget")).toContainText("CA$2,000 – CA$3,500");
  await form.getByLabel("Project requirements").fill("Hi there");
  await page.getByRole("button", { name: "Submit Enquiry" }).click();

  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await expect(form.getByLabel("Full name")).toHaveValue("Jamie");
  await expect(form.getByLabel("Project requirements")).toHaveValue("Hi there");

  await form.getByLabel("Email address").fill("jamie@example.com");
  await page.getByRole("button", { name: "Submit Enquiry" }).click();
  await expect(page.getByText(/received your enquiry/)).toBeVisible();
});
