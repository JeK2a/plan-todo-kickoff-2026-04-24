import { expect, test } from "@playwright/test";

test("main flow: create, toggle, filter", async ({ page }) => {
  await page.goto("/");

  const titleInput = page.locator("#task-title");
  await titleInput.fill("Smoke task");
  await page.locator("button:has-text('Добавить')").click();

  await expect(page.locator(".task-item")).toHaveCount(1);
  await expect(page.locator(".task-title", { hasText: "Smoke task" })).toBeVisible();

  await page.locator(".task-item button:has-text('Готово')").click();
  await expect(page.locator(".task-title.is-done", { hasText: "Smoke task" })).toBeVisible();

  await page.locator("button[data-filter='active']").click();
  await expect(page.locator(".task-item")).toHaveCount(0);

  await page.locator("button[data-filter='done']").click();
  await expect(page.locator(".task-item")).toHaveCount(1);
});
