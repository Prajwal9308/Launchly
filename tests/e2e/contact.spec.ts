import { expect, test } from "@playwright/test";

/** Regression: validation errors must not wipe what the visitor typed, and short messages are accepted. */
test("contact form keeps input on error and accepts a short message", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Name").fill("Jamie");
  await page.getByLabel("Email").fill("not-an-email");
  await page.getByLabel("Message").fill("Hi there");
  await page.getByRole("button", { name: "Send message" }).click();

  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue("Jamie");
  await expect(page.getByLabel("Message")).toHaveValue("Hi there");

  await page.getByLabel("Email").fill("jamie@example.com");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Message sent")).toBeVisible();
});
