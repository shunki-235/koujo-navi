import { createBreakdown, toInt } from "./utils";
import { DeductionBreakdown } from "@/types/deductions";

export function calculateSimpleFullDeduction(
  key: DeductionBreakdown["key"],
  paidTotal: number | null | undefined
) {
  const amount = toInt(paidTotal ?? 0);
  return createBreakdown(key, amount);
}


