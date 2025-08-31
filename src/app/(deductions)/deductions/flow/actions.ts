"use server";

import { getYearParams } from "@/lib/deductions/params";
import { calculateDeductions } from "@/lib/deductions/calc";
import { deductionsInputSchema } from "@/lib/deductions/schema";
import type { DeductionsInput } from "@/types/deductions";

export async function runSampleCalculation(formData: FormData): Promise<void> {
  const year = Number(formData.get("taxYear") ?? 2024);
  const params = getYearParams(year);

  const parsed = deductionsInputSchema.parse({
    basic: { taxYear: year as 2023 | 2024 | 2025, totalIncome: Number(formData.get("totalIncome") ?? 0) },
    medical: { paidTotal: Number(formData.get("medicalPaid") ?? 0), reimbursements: Number(formData.get("medicalReimbursed") ?? 0) },
  });

  const input: DeductionsInput = parsed as DeductionsInput;
  // スケルトン: 結果は現状返さず、将来 useFormState で扱う
  void calculateDeductions(input, params);
}


