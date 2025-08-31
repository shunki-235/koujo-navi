import { DeductionsInput, YearParams } from "@/types/deductions";
import { createBreakdown, toInt } from "./utils";

function applyBracket(paid: number, thresholds: number[], formulas: ((p: number) => number)[], maxPerCategory: number): number {
  if (paid <= 0) return 0;
  const [t1, t2, t3] = thresholds;
  let result: number;
  if (paid <= t1) result = formulas[0](paid);
  else if (paid <= t2) result = formulas[1](paid);
  else if (paid <= t3) result = formulas[2](paid);
  else result = formulas[3](paid);
  return Math.min(maxPerCategory, Math.max(0, Math.trunc(result)));
}

export function calculateLifeInsuranceDeduction(input: DeductionsInput, params: YearParams) {
  const { thresholds, formulas, maxPerCategory, maxTotal, maxOldSystem } = params.lifeInsurance;

  const general = applyBracket(toInt(input.lifeInsurance?.general ?? 0), thresholds, formulas, maxPerCategory);
  const pension = applyBracket(toInt(input.lifeInsurance?.pension ?? 0), thresholds, formulas, maxPerCategory);
  const medical = applyBracket(toInt(input.lifeInsurance?.medicalCare ?? 0), thresholds, formulas, maxPerCategory);
  const oldRaw = toInt(input.lifeInsurance?.oldSystem ?? 0);
  const old = Math.min(oldRaw, maxOldSystem);

  const subtotal = general + pension + medical + old;
  const amount = Math.min(maxTotal, subtotal);

  const notes: string[] = [];
  if (oldRaw > 0 && oldRaw > maxOldSystem) notes.push(`旧制度分は上限(${maxOldSystem.toLocaleString()}円)で打ち止め。`);
  if (subtotal > maxTotal) notes.push("3枠合計が上限を超えたため上限で打ち止め。");

  return createBreakdown("lifeInsurance", amount, notes.length ? notes : undefined);
}


