import { YearParams } from "@/types/deductions";

// 根拠:
// - 生命保険料控除（所得税/新契約）No.1140
//   しきい値: 20,000 / 40,000 / 80,000
//   計算式: p, 0.5p+10,000, 0.25p+20,000, 上限40,000。3枠合計上限120,000。旧制度上限50,000。
// - 地震保険料控除 No.1145: 新制度上限50,000、旧長期損害保険等 上限15,000（経過措置）
// - 医療費控除 No.1120/1119: 足切り min(100,000, 総所得金額等×5%)、上限2,000,000

export const params2024: YearParams = {
  lifeInsurance: {
    thresholds: [20000, 40000, 80000],
    formulas: [
      (p) => p,
      (p) => Math.floor(p * 0.5 + 10000),
      (p) => Math.floor(p * 0.25 + 20000),
      () => 40000,
    ],
    maxPerCategory: 40000,
    maxTotal: 120000,
    maxOldSystem: 50000,
  },
  earthquakeInsurance: {
    maxNew: 50000,
    maxOld: 15000,
  },
  medical: {
    floorAmount: 100000,
    maxAmount: 2000000,
    useIncomeFloorRate: 0.05,
  },
};


