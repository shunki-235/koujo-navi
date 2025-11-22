# 控除ナビ（koujo-navi）

確定申告における各種「所得控除」の漏れ・誤りを防ぎ、入力ガイドと自動計算を提供するWebアプリケーションです。

## 📋 プロジェクト概要

### 目的

- 確定申告における各種所得控除の漏れ・誤りを防ぐ
- 入力ガイドと自動計算を提供する
- 対象控除の入力→検証→計算→結果要約までを、ステップ形式で完結できるUIを提供する

### 対応控除

以下の7種類の控除に対応しています：

- **医療費控除**: 自己・生計一親族の医療費（上限200万円）
- **社会保険料控除**: 国民年金、国民健康保険、介護保険、厚生年金保険料等
- **iDeCo（個人型確定拠出年金）**: 掛金の全額
- **小規模企業共済等掛金控除**: 掛金の全額
- **生命保険料控除**: 一般・個人年金・介護医療・旧制度に対応
- **地震保険料控除**: 新制度・旧制度に対応（上限5万円）
- **寄附金控除**: ふるさと納税を含む寄附金（所得税分）

### 主な機能

- ✅ **年度別対応**: 2023〜2025年の制度に対応。選んだ年度にあわせて自動で計算
- ✅ **PDF/JSON出力**: 日本語フォントを埋め込んだPDF、JSONの2形式で保存
- ✅ **自動保存＆復元**: 離脱しても自動復元。いつでも続きから再開可能
- ✅ **型安全な入力**: `react-hook-form` + `zod` による型安全なフォームとバリデーション

## 🚀 クイックスタート

### 必要な環境

- Node.js 20以上
- pnpm（推奨）または npm/yarn/bun

### セットアップ

```bash
# 依存関係のインストール
pnpm install

# 開発サーバーの起動
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。

### 主要なスクリプト

```bash
pnpm dev       # 開発サーバー（Turbopack使用）
pnpm build     # 本番ビルド（Turbopack使用）
pnpm start     # 本番サーバーの起動
pnpm typecheck # TypeScriptの型チェック
pnpm lint      # ESLintによるコードチェック
pnpm test      # ユニットテスト（Vitest）
pnpm test:ui   # ユニットテスト（UIモード）
pnpm e2e       # E2Eテスト（Playwright）
pnpm lhci      # Lighthouse CI（パフォーマンス計測）
```

## 📁 プロジェクト構成

```text
src/
├── app/                          # Next.js App Router
│   ├── (deductions)/             # 控除関連のルートグループ
│   │   └── deductions/
│   │       └── flow/             # 入力フロー（ステッパーUI）
│   ├── api/
│   │   └── export/
│   │       └── deductions/
│   │           └── pdf/          # PDFエクスポートAPI
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # トップページ
│   └── globals.css               # グローバルスタイル
├── lib/
│   └── deductions/
│       ├── calc/                 # 控除計算ロジック
│       │   ├── medical.ts        # 医療費控除
│       │   ├── lifeInsurance.ts # 生命保険料控除
│       │   ├── earthquakeInsurance.ts # 地震保険料控除
│       │   ├── donations.ts      # 寄附金控除
│       │   ├── simpleFull.ts    # 全額控除（社会保険・iDeCo・小規模共済）
│       │   └── index.ts          # 計算エントリーポイント
│       ├── params/               # 年度別パラメータ
│       │   ├── y2023.ts         # 2023年度のパラメータ
│       │   ├── y2024.ts         # 2024年度のパラメータ
│       │   ├── y2025.ts         # 2025年度のパラメータ
│       │   └── index.ts         # パラメータエントリーポイント
│       └── schema.ts            # Zodスキーマ定義
└── types/
    └── deductions.ts            # TypeScript型定義

tests/
├── unit/                         # ユニットテスト（Vitest）
│   ├── medical.test.ts
│   ├── lifeInsurance.test.ts
│   ├── earthquakeInsurance.test.ts
│   └── donations.test.ts
└── e2e/                          # E2Eテスト（Playwright）
    ├── flow.spec.ts              # 基本フローテスト
    ├── flow-validate.spec.ts     # バリデーションテスト
    ├── flow-restore.spec.ts      # 自動復元テスト
    ├── flow-downloads.spec.ts    # ダウンロードテスト
    └── flow-axe.spec.ts          # アクセシビリティテスト

docs/
└── deductions/
    └── README.md                 # 詳細な要件・設計ドキュメント
```

## 🛠️ 技術スタック

### コア技術

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI**: [React 19](https://react.dev/)
- **言語**: [TypeScript 5](https://www.typescriptlang.org/) (`strict` モード)
- **スタイリング**: [Tailwind CSS 4](https://tailwindcss.com/)

### 主要ライブラリ

- **フォーム管理**: [`react-hook-form`](https://react-hook-form.com/) + [`zod`](https://zod.dev/) + [`@hookform/resolvers`](https://github.com/react-hook-form/resolvers)
- **PDF生成**: [`pdf-lib`](https://pdf-lib.js.org/) + [`@pdf-lib/fontkit`](https://github.com/Hopding/pdf-lib)

### 開発ツール

- **Linter**: [ESLint 9](https://eslint.org/) (Flat Config)
- **テスト**:
  - ユニットテスト: [Vitest 3](https://vitest.dev/)
  - E2Eテスト: [Playwright 1.55](https://playwright.dev/)
  - アクセシビリティ: [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm)
- **パフォーマンス**: [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### ビルドツール

- **Bundler**: [Turbopack](https://turbo.build/pack) (Next.js 15のデフォルト)

## 🎯 主要ルート

- `/` - トップページ（導線・ハイライト・免責事項）
- `/deductions/flow` - 入力フロー（ステップ形式の入力・計算・PDF/JSON出力）

## 📝 開発ガイドライン

### コードスタイル

- TypeScriptの`strict`モードを有効化
- `any`型の使用は禁止（型安全性の徹底）
- ESLintのルールに従う
- フォーマットは自動修正を活用

### テスト方針

- **ユニットテスト**: 各控除計算ロジックの境界値・相関を網羅
- **E2Eテスト**: 入力→計算→出力の基本シナリオを検証
- **アクセシビリティ**: `@axe-core/playwright`による自動検証

### 計算ロジックの追加・修正

1. `src/lib/deductions/calc/` に計算関数を追加
2. `src/lib/deductions/params/` に年度別パラメータを定義
3. `src/lib/deductions/schema.ts` にZodスキーマを追加
4. `tests/unit/` にテストを追加

詳細は [`docs/deductions/README.md`](docs/deductions/README.md) を参照してください。

## ⚠️ 重要な注意事項

### 免責事項

**本ツールの計算は参考値です。** 最終的な申告内容は、国税庁の案内および申告書様式をご確認のうえご判断ください。

- 住民税側の特例や詳細控除は対象外です
- セルフメディケーション税制は非対応です
- e-Tax連携機能はありません

### ブラウザサポート

- 最新の Chrome / Edge / Firefox / Safari

### 既知の制約

- **E2Eテスト**: PDFダウンロードは環境依存で不安定のため、JSON生成トリガのみを検証
- **PDF API**: UIからの呼び出しを前提としており、E2Eでの直接API呼び出しは非推奨
- **PDFフォント**: `public/fonts/NotoSansJP-Regular.ttf` を読み込んで日本語を埋め込みます（サーバーRuntime: nodejs）

## 📚 参考資料

### プロジェクトドキュメント

- [`docs/deductions/README.md`](docs/deductions/README.md) - 詳細な要件・設計ドキュメント
- [`docs/NEXT_STEPS.md`](docs/NEXT_STEPS.md) - 今後の開発予定

### 外部リソース

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 コントリビューション

プロジェクトへの貢献を歓迎します。詳細は各ドキュメントを参照してください。

---

**控除ナビ** - 確定申告を、もっと自由に。
