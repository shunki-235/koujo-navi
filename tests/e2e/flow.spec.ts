import { test, expect } from "@playwright/test";

test("控除フロー: 入力→計算→PDF/JSON", async ({ page }) => {
  await page.goto("/deductions/flow");
  // 基本
  await page.locator("label:has-text('総所得金額等') >> input").fill("0");
  await page.getByText("次へ").click();
  // 医療費
  await page.locator("label:has-text('医療費(支払額)') >> input").fill("0");
  await page.locator("label:has-text('医療費(補填額)') >> input").fill("0");
  await page.getByText("次へ").click();
  // 社会保険等
  await page.locator("label:has-text('社会保険料 合計') >> input").fill("0");
  await page.locator("label:has-text('iDeCo 掛金') >> input").fill("0");
  await page.locator("label:has-text('小規模企業共済 掛金') >> input").fill("0");
  await page.getByText("次へ").click();
  // 生命保険
  await page.locator("label:has-text('一般(新制度)') >> input").fill("0");
  await page.locator("label:has-text('個人年金(新制度)') >> input").fill("0");
  await page.locator("label:has-text('介護医療(新制度)') >> input").fill("0");
  await page.locator("label:has-text('旧制度') >> input").fill("0");
  await page.getByText("次へ").click();
  // 地震保険
  await page.locator("label:has-text('地震保険料(新制度)') >> input").fill("0");
  await page.locator("label:has-text('旧長期損害保険等') >> input").fill("0");
  await page.getByText("次へ").click();
  // 寄附金
  await page.locator("label:has-text('ふるさと納税') >> input").fill("0");
  await page.locator("label:has-text('その他寄附') >> input").fill("0");
  await page.getByText("次へ").click();
  await page.getByRole("button", { name: "計算する" }).click();

  await expect(page.getByText("計算結果")).toBeVisible();
  await expect(page.getByText(/合計控除額/)).toBeVisible();
});


