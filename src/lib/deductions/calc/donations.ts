import { DeductionsInput } from "@/types/deductions";
import { createBreakdown, toInt } from "./utils";

export function calculateDonationsDeduction(input: DeductionsInput) {
  const hometown = toInt(input.donations?.hometown ?? 0);
  const other = toInt(input.donations?.other ?? 0);
  const total = hometown + other;
  const income = toInt(input.basic.totalIncome ?? 0);
  const maxByIncome = income > 0 ? Math.floor(income * 0.4) : Number.POSITIVE_INFINITY; // 総所得金額等の40%
  const raw = Math.max(0, total - 2000); // 所得税分: 2,000円の自己負担
  const amount = Math.min(raw, maxByIncome);
  const notes: string[] = [];
  if (raw > maxByIncome && Number.isFinite(maxByIncome)) {
    notes.push("総所得金額等の40%上限で打ち止め。");
  }
  return createBreakdown("donations", amount, notes.length ? notes : undefined);
}


