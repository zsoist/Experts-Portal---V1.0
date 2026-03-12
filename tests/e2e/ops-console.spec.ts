import { expect, test } from "@playwright/test";

test("ops console dashboard and expert detail render", async ({ page }) => {
  await page.goto("http://127.0.0.1:3001");
  await expect(
    page.getByText("Operations command center for expert supply"),
  ).toBeVisible();
  await expect(page.getByText("Recent state changes")).toBeVisible();

  await page.goto(
    "http://127.0.0.1:3001/experts/4dd4d84f-33fd-476f-b814-5cc6d55f32a9",
  );
  await expect(page.getByText("Expert summary")).toBeVisible();
  await expect(page.getByText("Payment status controls")).toBeVisible();
});
