"use server";

import { getYearParams } from "@/lib/deductions/params";
import { calculateDeductions } from "@/lib/deductions/calc";
import { deductionsInputSchema } from "@/lib/deductions/schema";
import type { DeductionsInput } from "@/types/deductions";

function toIntOrNull(v: unknown): number | null {
  if (v === "" || v == null) return null;
  const s = typeof v === "string" ? v.replace(/,/g, "") : String(v);
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

export async function runSampleCalculation(formData: FormData): Promise<void> {
  const year = Number(formData.get("taxYear") ?? 2024);
  const params = getYearParams(year);

  const parsed = deductionsInputSchema.parse({
    basic: { taxYear: year as 2023 | 2024 | 2025, totalIncome: toIntOrNull(formData.get("totalIncome")) },
    medical: { paidTotal: toIntOrNull(formData.get("medicalPaid")), reimbursements: toIntOrNull(formData.get("medicalReimbursed")) },
  });

  const input: DeductionsInput = parsed as DeductionsInput;
  // スケルトン: 結果は現状返さず、将来 useFormState で扱う
  void calculateDeductions(input, params);
}


