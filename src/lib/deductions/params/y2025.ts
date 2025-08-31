import { YearParams } from "@/types/deductions";

export const params2025: YearParams = {
  lifeInsurance: {
    thresholds: [12000, 32000, 56000],
    formulas: [
      (p) => p,
      (p) => Math.floor(p * 0.5 + 6000),
      (p) => Math.floor(p * 0.25 + 14000),
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


