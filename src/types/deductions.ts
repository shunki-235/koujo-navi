export type TaxYear = 2023 | 2024 | 2025;

export type BasicInput = {
  taxYear: TaxYear;
  totalIncome?: number | null; // 総所得金額等（医療費控除の足切りに利用）
};

export type MedicalInput = {
  paidTotal?: number | null; // 支払額合計
  reimbursements?: number | null; // 保険金等で補填された金額
};

export type SocialInsuranceInput = {
  paidTotal?: number | null; // 国保/年金等の合計
};

export type IdecoInput = {
  paidTotal?: number | null; // iDeCo掛金合計
};

export type SmallBusinessMutualAidInput = {
  paidTotal?: number | null; // 小規模企業共済等の掛金
};

export type LifeInsuranceInput = {
  general?: number | null; // 一般生命保険料（新制度）
  pension?: number | null; // 個人年金保険料（新制度）
  medicalCare?: number | null; // 介護医療保険料（新制度）
  oldSystem?: number | null; // 旧制度分（簡易取り扱い）
};

export type EarthquakeInsuranceInput = {
  paidTotal?: number | null; // 地震保険料
  oldSystem?: number | null; // 旧長期損害保険等
};

export type DonationsInput = {
  hometown?: number | null; // ふるさと納税
  other?: number | null; // その他寄附
};

export type DeductionsInput = {
  basic: BasicInput;
  medical?: MedicalInput;
  socialInsurance?: SocialInsuranceInput;
  iDeCo?: IdecoInput;
  smallBusinessMutualAid?: SmallBusinessMutualAidInput;
  lifeInsurance?: LifeInsuranceInput;
  earthquakeInsurance?: EarthquakeInsuranceInput;
  donations?: DonationsInput;
};

export type DeductionBreakdown = {
  key:
    | "medical"
    | "socialInsurance"
    | "iDeCo"
    | "smallBusinessMutualAid"
    | "lifeInsurance"
    | "earthquakeInsurance"
    | "donations";
  amount: number; // 控除額(円)
  notes?: string[];
};

export type DeductionsResult = {
  total: number;
  items: DeductionBreakdown[];
};

export type LifeInsuranceBracket = {
  // 入力額に対する段階計算ルール（新制度）
  thresholds: number[]; // 例: [12000, 32000, 56000]
  formulas: ((paid: number) => number)[]; // 同数長。各段階の計算式
  maxPerCategory: number; // 枠ごとの上限(例: 40,000)
  maxTotal: number; // 3枠合計上限(例: 120,000)
  maxOldSystem: number; // 旧制度の簡易上限(例: 50,000)
};

export type EarthquakeInsuranceParams = {
  maxNew: number; // 新制度の上限(例: 50,000)
  maxOld: number; // 旧制度の上限(例: 15,000)
};

export type MedicalParams = {
  floorAmount: number; // 10万円（所得5%と比較して小さい方を差し引く際に使用）
  maxAmount: number; // 上限200万円
  useIncomeFloorRate: number; // 0.05（総所得金額等×5%）
};

export type YearParams = {
  lifeInsurance: LifeInsuranceBracket;
  earthquakeInsurance: EarthquakeInsuranceParams;
  medical: MedicalParams;
};


