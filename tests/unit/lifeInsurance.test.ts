import { describe, it, expect } from "vitest";
import { calculateLifeInsuranceDeduction } from "@/lib/deductions/calc/lifeInsurance";
import { params2024 } from "@/lib/deductions/params/y2024";

describe("life insurance deduction", () => {
  it("applies bracket per category and clamps per-category max", () => {
    const res = calculateLifeInsuranceDeduction(
      {
        basic: { taxYear: 2024 },
        lifeInsurance: { general: 12_000, pension: 32_000, medicalCare: 56_000, oldSystem: 0 },
      },
      params2024
    );
    // 12,000 => 12,000 ; 32,000 => 0.5*32000+6000=22000 ; 56,000 => 0.25*56000+14000=28000 ; total 62,000
    expect(res.amount).toBe(62_000);
  });

  it("clamps total to 120,000 and notes message; old limited to 50,000", () => {
    const res = calculateLifeInsuranceDeduction(
      {
        basic: { taxYear: 2024 },
        lifeInsurance: { general: 200_000, pension: 200_000, medicalCare: 200_000, oldSystem: 100_000 },
      },
      params2024
    );
    expect(res.amount).toBe(120_000);
    expect(res.notes?.some((n) => n.includes("上限"))).toBe(true);
  });
});


