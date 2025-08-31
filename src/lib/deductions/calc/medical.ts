import { DeductionsInput, YearParams } from "@/types/deductions";
import { createBreakdown, toInt } from "./utils";

export function calculateMedicalDeduction(input: DeductionsInput, params: YearParams) {
  const paid = toInt(input.medical?.paidTotal ?? 0);
  const reimbursed = toInt(input.medical?.reimbursements ?? 0);
  const income = toInt(input.basic.totalIncome ?? 0);

  const base = Math.max(0, paid - reimbursed);
  const incomeFloor = Math.min(params.medical.floorAmount, Math.floor(income * params.medical.useIncomeFloorRate));
  const deductible = Math.min(params.medical.maxAmount, Math.max(0, base - incomeFloor));

  return createBreakdown("medical", deductible, base <= 0 ? ["対象医療費がありません"] : undefined);
}


