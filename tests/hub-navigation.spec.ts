import { test, expect } from "@playwright/test";

test("Time Core web app opens from the hub without a 404", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /Launch Web App/ }).click();
  await expect(page).toHaveURL(/\/time-core\/?$/);
  await expect(page.getByRole("heading", { name: /Time Core/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Countdowns" })).toBeVisible();
});

test("main store is visible in navigation and hero", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: /Main Store/ })).toHaveAttribute("href", "https://hbombrg.com/");
  await expect(page.getByRole("link", { name: /Visit Main Store/ })).toHaveAttribute("href", "https://hbombrg.com/");
});
