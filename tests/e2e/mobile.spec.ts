import { expect, test } from "@playwright/test";
import { login } from "./utils";
import { E2E_PASSWORD } from "./global-setup";

/** Mobile smoke test: a client can see status, next action and reach key sections. */
test("client portal works on a phone", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(page.getByRole("dialog").getByRole("link", { name: "Pricing" })).toBeVisible();
  await page.keyboard.press("Escape");

  await login(page, "client@example.com", E2E_PASSWORD);
  await expect(page.getByText("Action required")).toBeVisible();
  const quickNav = page.getByRole("navigation", { name: "Quick navigation" });
  await expect(quickNav).toBeVisible();
  await quickNav.getByRole("link", { name: /Messages/ }).click();
  await expect(page.getByRole("textbox", { name: "Message" })).toBeVisible();
  await quickNav.getByRole("link", { name: /Reviews/ }).click();
  await expect(page.getByRole("button", { name: "Approve Design" })).toBeVisible();
});
