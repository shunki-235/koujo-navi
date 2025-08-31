## 控除ナビ: 要件・設計 (MVP)

### 目的
- 確定申告における各種「所得控除」の漏れ/誤りを防ぎ、入力ガイドと自動計算を提供する。
- 対象控除の入力→検証→計算→結果要約までを、ステップ形式で完結できるUIを提供する。

### スコープ (MVP)
- 対応控除: 医療費控除、社会保険料控除、iDeCo、小規模企業共済、生命保険料控除、地震保険料控除、寄附金控除(ふるさと納税含む・所得税分)。
- 年度選択に応じたパラメータ適用（控除上限・計算式の差異）。
- 入力値のバリデーション、計算結果のブレークダウン表示、JSONエクスポート。
- 非対応(初期): e-Tax連携、PDF出力、セルフメディケーション税制、住民税側計算、配偶者/扶養控除、高齢者/障害者特例など。

### ペルソナ
- 個人事業主/副業ありの個人納税者。青色/白色いずれも想定。
- 会計知識は限定的だが、金額や証憑をある程度把握しているユーザー。

## 画面/UX

### 画面一覧
- `/deductions/flow` ステッパー: 基本情報 → 各控除入力(タブ/ステップ) → 確認 → 結果。
- `/deductions/results` 結果要約: 控除合計、内訳、注記、JSONエクスポート。

### 入力UI原則
- `react-hook-form` + `zod` で型安全なフォームと同期/非同期バリデーション。
- 金額は数値(円)入力、補足説明/要件のヘルプテキストを併設。
- ステップ毎に保存、離脱保護(未保存時の警告)。
- 入力の最小集合を提示し、詳細入力は「詳細を開く」で段階表示。

## データモデル

### エンティティ(概念)
- User(将来導入): 認証後にドラフトを永続化。MVPはローカル保存から開始可。
- ReturnDraft: 申告年度、入力内容、計算結果、更新履歴を保持。
- DeductionsInput: 各控除の入力集合。
- DeductionsResult: 控除額の集計と各控除の内訳。
- YearParams: 年度別の控除パラメータ(上限/計算式/レートなど)。

### 型スケッチ(参考)
```ts
// types/deductions.ts
export type TaxYear = 2023 | 2024 | 2025; // 拡張可

export type DeductionsInput = {
  basic: { taxYear: TaxYear; totalIncome?: number | null };
  medical: { paidTotal?: number | null; reimbursements?: number | null };
  socialInsurance: { paidTotal?: number | null };
  iDeCo: { paidTotal?: number | null };
  smallBusinessMutualAid: { paidTotal?: number | null };
  lifeInsurance: { general?: number | null; pension?: number | null; medicalCare?: number | null; oldSystem?: number | null };
  earthquakeInsurance: { paidTotal?: number | null; oldSystem?: number | null };
  donations: { hometown?: number | null; other?: number | null };
};

export type DeductionBreakdown = {
  key: string; // 例: "medical"
  amount: number; // 控除額(円)
  notes?: string[]; // 注記
};

export type DeductionsResult = {
  total: number;
  items: DeductionBreakdown[];
};
```

## 年度パラメータ設計
- `lib/deductions/params/{year}.ts` に年度ごとのパラメータを配置し、`index.ts` で集約。
- 例: 生命保険料控除(新制度)の段階的限度額、地震保険料控除の上限、医療費控除の足切り(10万円/所得の5%の小さい方)など。
- バージョン管理し、年度追加はパラメータファイルの追加で完結させる。

## 計算仕様(概要)

### 医療費控除
- 対象: 自己/生計一親族の医療費。対象外/対象内の定義はヘルプで案内。
- 計算: `max(0, (支払額合計 - 保険等補填額) - min(100,000, 総所得金額等×5%))`、上限200万円。
- MVP: セルフメディケーション税制は非対応。

### 社会保険料控除
- 対象: 国民年金、国民健康保険、介護保険、厚生年金保険料等の自己負担分。
- 計算: 支払額の全額。

### iDeCo(小規模企業共済等掛金控除の一部)
- 対象: 個人型確定拠出年金の掛金。
- 計算: 支払額の全額。職業区分による拠出上限はMVPでは参考チェック(警告)のみ。

### 小規模企業共済等掛金控除
- 対象: 小規模企業共済、心身障害者扶養共済など。
- 計算: 支払額の全額。

### 生命保険料控除
- 新制度(2012年以降)の一般/個人年金/介護医療を対象。旧制度は簡易に旧枠一括で受け、注記。
- 計算: 各枠ごとに段階計算→合算(合計上限あり)。年度パラメータで段階式を定義。
  - しきい値(新制度/所得税): 20,000 / 40,000 / 80,000
  - 各枠の控除: p, 0.5p+10,000, 0.25p+20,000, 上限40,000
  - 3枠合計の上限: 120,000、旧制度簡易上限: 50,000

### 地震保険料控除
- 計算: 支払額に対し年度上限まで（新制度: 上限50,000、旧長期損害保険等: 上限15,000の経過措置）。

### 寄附金控除(ふるさと納税含む)
- 所得税側: `max(0, 寄附合計 - 2,000円)` を総所得金額等の40%を上限として計算。
- MVP: 住民税側の特例/控除は対象外。ワンストップ特例は注記のみ。

## バリデーション
- `zod` で `DeductionsInput` を厳格化。金額は0以上の整数(円)。
- 年度の必須選択、医療費の相殺(補填額 <= 支払額) 等の相関チェック。
- 将来: 金額の上限(制度上限)は強制ではなく警告として提示。

## 永続化/保存
- MVP: ローカル保存(IndexedDB/LocalStorage)。ログイン導入後はDB(Prisma+Postgres)へ移行。
- ドラフトの自動保存と手動保存(バージョン/更新日時)を両立。

## API/サーバ処理
- Server Actions を優先。純計算は `lib/deductions/calc/*.ts` に関数化し、サーバ側で実行。
- Route Handlers(API) は将来の外部連携/ファイル入出力に限定。

### 関数インターフェース(案)
```ts
// lib/deductions/calc/index.ts
export function calculateDeductions(input: DeductionsInput, params: YearParams): DeductionsResult {}

// app/(deductions)/deductions/flow/actions.ts
export async function saveDraft(input: DeductionsInput): Promise<{ id: string }>
export async function runCalculation(input: DeductionsInput): Promise<DeductionsResult>
```

## 非機能要件
- 性能: 入力/計算は100ms以下を目標(ローカル/サーバどちらでも体感即時)。
- アクセシビリティ: キーボード操作/スクリーンリーダー対応、エラー文言の明確化。
- セキュリティ: 個人情報はサーバ側処理を優先、通信はHTTPS、データは暗号化保存(将来)。
- 監査/ログ: 計算条件と結果のハッシュ/履歴を保持(将来)。

## テスト方針
- ユニット: 各控除の境界値(上限境界、ゼロ入力、過大入力の丸め)を網羅。
- 参照テスト: 年度パラメータを固定し、既知の例題でスナップショット検証。
- E2E: 入力→結果の基本シナリオ、未保存離脱、エラーハンドリング。

## 実装ロードマップ(提案)
1. 型と年度パラメータの下地作成(`types/`, `lib/deductions/params/`).
2. 医療費/社会保険料/iDeCoの計算ユニット作成とテスト。
3. ステッパーUI(フォーム/バリデーション/保存)の骨組み。
4. 生命保険料/地震/寄附の追加と境界テスト。
5. 結果要約画面とJSONエクスポート。
6. ローカル保存の安定化、入力ヘルプ/注記の整備。

## 未確定事項/質問
- 年度の初期対象(例: 2024/2025どちらを優先?)。
- 旧制度(生命保険/地震保険)の取り扱い詳細と入力方法。
- ログイン導入時期(ローカル保存のみで良いか)。
- PDF出力とe-Tax向けデータの対応優先度。

## 参考
- 実装で採用予定: Next.js App Router、Server Actions、`react-hook-form`、`zod`、TypeScript strict。

### 根拠リンク（国税庁タックスアンサー）
- 注意・免責
  - 本リポジトリの計算は学習/検証目的であり、実際の確定申告における最終判断は申告者の責任で行ってください。住民税側の特例や詳細控除は対象外です。
- 医療費控除: No.1120/1119（明細書・手続）
  - https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1120.htm
  - https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1119.htm
- 生命保険料控除: No.1140（新契約/旧契約の区分、計算方法・上限）
  - https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1140.htm
- 地震保険料控除: No.1145（上限5万円、旧長期損害保険の経過措置）
  - https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1145.htm
- 寄附金控除: No.1150（2,000円自己負担、総所得金額等の40%上限）
  - https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1150.htm
- 社会保険料控除: No.1130（国民年金/健康保険/介護保険等の自己負担分の全額）
  - https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1130.htm
- 小規模企業共済等掛金控除（iDeCo含む）: No.1135（拠出掛金の全額）
  - https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1135.htm
- ディレクトリ例:
```
app/
  (deductions)/deductions/
    page.tsx
    flow/
      page.tsx
      actions.ts
lib/
  deductions/
    calc/
    params/
types/
```


