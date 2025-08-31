import { test, expect } from "@playwright/test";

test("JSON のダウンロードトリガを検知できる", async ({ page, context }) => {
  await context.addInitScript(() => {
    const orig = URL.createObjectURL;
    (window as unknown as { __objectUrlCount: number }).__objectUrlCount = 0;
    URL.createObjectURL = (obj: Blob | MediaSource) => {
      (window as unknown as { __objectUrlCount: number }).__objectUrlCount += 1;
      return orig(obj);
    };
  });

  await page.goto("/deductions/flow");
  for (let i = 0; i < 6; i++) await page.getByText("次へ").click();
  await page.getByRole("button", { name: "計算する" }).click();

  await page.getByRole("button", { name: "JSONをダウンロード" }).click();
  await page.waitForFunction(() => (window as unknown as { __objectUrlCount: number }).__objectUrlCount >= 1);

  // PDFは環境依存で不安定なため、JSONのトリガ検知のみをE2Eで担保
});

// APIの詳細はユニット/結合で担保。E2Eではトリガ起動のみカバー。


