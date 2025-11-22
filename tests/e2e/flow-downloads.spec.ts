import { test } from "@playwright/test";

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
  await page.locator("label:has-text('総所得金額等') >> input").fill("0");
  await page.getByText("次へ").click();
  await page.locator("label:has-text('医療費(支払額)') >> input").fill("0");
  await page.locator("label:has-text('医療費(補填額)') >> input").fill("0");
  await page.getByText("次へ").click();
  await page.locator("label:has-text('社会保険料 合計') >> input").fill("0");
  await page.locator("label:has-text('iDeCo 掛金') >> input").fill("0");
  await page.locator("label:has-text('小規模企業共済 掛金') >> input").fill("0");
  await page.getByText("次へ").click();
  await page.locator("label:has-text('一般(新制度)') >> input").fill("0");
  await page.locator("label:has-text('個人年金(新制度)') >> input").fill("0");
  await page.locator("label:has-text('介護医療(新制度)') >> input").fill("0");
  await page.locator("label:has-text('旧制度') >> input").fill("0");
  await page.getByText("次へ").click();
  await page.locator("label:has-text('地震保険料(新制度)') >> input").fill("0");
  await page.locator("label:has-text('旧長期損害保険等') >> input").fill("0");
  await page.getByText("次へ").click();
  await page.locator("label:has-text('ふるさと納税') >> input").fill("0");
  await page.locator("label:has-text('その他寄附') >> input").fill("0");
  await page.getByText("次へ").click();
  await page.getByRole("button", { name: "計算する" }).click();

  await page.getByRole("button", { name: "JSONをダウンロード" }).click();
  await page.waitForFunction(() => (window as unknown as { __objectUrlCount: number }).__objectUrlCount >= 1);

  // PDFは環境依存で不安定なため、JSONのトリガ検知のみをE2Eで担保
});

// APIの詳細はユニット/結合で担保。E2Eではトリガ起動のみカバー。


