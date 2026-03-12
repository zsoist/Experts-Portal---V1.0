import { expect, test } from "@playwright/test";

test("expert portal dashboard and profile route render", async ({ page }) => {
  await page.goto("http://127.0.0.1:3000");
  await expect(
    page.getByText("Expert self-service without losing compliance control"),
  ).toBeVisible();
  await expect(
    page.getByText("Respond before ops chases by email"),
  ).toBeVisible();

  await page.goto("http://127.0.0.1:3000/profile");
  await expect(page.getByText("Profile and recency management")).toBeVisible();
  await expect(page.getByLabel("Full name")).toBeVisible();
});
