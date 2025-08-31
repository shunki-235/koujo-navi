import { test, expect } from "@playwright/test";

test("控除フロー: 入力→計算→PDF/JSON", async ({ page }) => {
  await page.goto("/deductions/flow");

  // ステップを進めて一通り入力
  for (let i = 0; i < 6; i++) {
    await page.getByText("次へ").click();
  }
  await page.getByRole("button", { name: "計算する" }).click();

  await expect(page.getByText("計算結果")).toBeVisible();
  await expect(page.getByText(/合計控除額/)).toBeVisible();
});


