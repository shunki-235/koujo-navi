import { describe, it, expect } from "vitest";
import { calculateMedicalDeduction } from "@/lib/deductions/calc/medical";
import { params2024 } from "@/lib/deductions/params/y2024";

describe("medical deduction", () => {
  it("calculates deductible with income floor 100,000", () => {
    const r = calculateMedicalDeduction(
      { basic: { taxYear: 2024, totalIncome: 4_000_000 }, medical: { paidTotal: 300_000, reimbursements: 50_000 } },
      params2024
    );
    expect(r.amount).toBe(150_000);
    expect(r.key).toBe("medical");
  });

  it("returns 0 with note when no eligible base", () => {
    const r = calculateMedicalDeduction({ basic: { taxYear: 2024, totalIncome: 4_000_000 }, medical: { paidTotal: 0, reimbursements: 0 } }, params2024);
    expect(r.amount).toBe(0);
    expect(r.notes?.[0]).toContain("対象医療費がありません");
  });
});


