This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Scripts

```bash
pnpm dev       # 開発サーバ
pnpm build     # ビルド
pnpm start     # 本番起動
pnpm typecheck # 型チェック
pnpm lint      # Lint
pnpm test      # ユニットテスト（Vitest）
pnpm e2e       # E2Eテスト（Playwright）
```

### 主要ルート

- `/` トップ（導線/ハイライト/免責）
- `/deductions/flow` 入力フロー（自動保存・計算・PDF/JSON出力）

### PDFフォント

`public/fonts/NotoSansJP-Regular.ttf` を読み込んで日本語を埋め込みます（サーバRuntime: nodejs）。

### 免責

本ツールの計算は参考値です。最終的な申告内容は国税庁の案内および申告書様式をご確認のうえご判断ください。住民税側の特例や詳細控除は対象外です。

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
