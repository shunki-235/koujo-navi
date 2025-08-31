import { describe, it, expect } from "vitest";
import { calculateEarthquakeInsuranceDeduction } from "@/lib/deductions/calc/earthquakeInsurance";
import { params2024 } from "@/lib/deductions/params/y2024";

describe("earthquake insurance deduction", () => {
  it("caps new and old systems by year params", () => {
    const r = calculateEarthquakeInsuranceDeduction(
      { basic: { taxYear: 2024 }, earthquakeInsurance: { paidTotal: 100_000, oldSystem: 30_000 } },
      params2024
    );
    expect(r.amount).toBe(65_000);
  });
});


