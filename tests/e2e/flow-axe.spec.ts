import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("flowページに重大なアクセシビリティ違反がない", async ({ page }) => {
  await page.goto("/deductions/flow");

  // 初期状態のA11yチェック
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  expect(results.violations, JSON.stringify(results.violations, null, 2)).toHaveLength(0);
});


