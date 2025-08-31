import { test, expect } from "@playwright/test";

test("バリデーションエラーで次へが進めない", async ({ page }) => {
  await page.goto("/deductions/flow");

  // 基本→医療費へ
  await page.getByText("次へ").click();

  // 医療費(補填額) > 支払額 にしてみる
  const paid = page.locator("label:has-text('医療費(支払額)') >> input");
  const reimb = page.locator("label:has-text('医療費(補填額)') >> input");
  await paid.fill("1000");
  await reimb.fill("2000");

  await page.getByText("次へ").click();
  await expect(page.getByText("補填額は支払額以下にしてください")).toBeVisible();
});


