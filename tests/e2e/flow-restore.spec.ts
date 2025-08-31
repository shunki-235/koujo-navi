import { test, expect } from "@playwright/test";

const STORAGE_KEY = "deductions-flow:v1";

test("未保存離脱→自動復元が機能する", async ({ page }) => {
  await page.goto("/deductions/flow");

  const incomeInput = page.locator("label:has-text('総所得金額等') >> input");
  await incomeInput.click();
  await incomeInput.fill("1234567");
  await incomeInput.blur();

  await page.waitForTimeout(700); // 自動保存デバウンス待ち

  const saved = await page.evaluate((key) => window.localStorage.getItem(key), STORAGE_KEY);
  expect(saved).toContain("1234567");

  await page.reload();
  // 復元プロンプトに従って復元を実行
  await page.getByRole("button", { name: "復元する" }).click();

  const value = await incomeInput.inputValue();
  expect(value.replace(/,/g, "")).toBe("1234567");
});


