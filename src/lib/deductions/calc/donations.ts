import { DeductionsInput } from "@/types/deductions";
import { createBreakdown, toInt } from "./utils";

export function calculateDonationsDeduction(input: DeductionsInput) {
  const hometown = toInt(input.donations?.hometown ?? 0);
  const other = toInt(input.donations?.other ?? 0);
  const total = hometown + other;
  const amount = Math.max(0, total - 2000); // 所得税分: 2,000円の自己負担
  return createBreakdown("donations", amount);
}


