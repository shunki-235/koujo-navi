import { describe, it, expect } from "vitest";
import { calculateDonationsDeduction } from "@/lib/deductions/calc/donations";

describe("donations deduction", () => {
  it("applies 2,000 yen self burden", () => {
    const r = calculateDonationsDeduction({ basic: { taxYear: 2024 }, donations: { hometown: 10_000, other: 5_000 } });
    expect(r.amount).toBe(13_000);
  });
  it("does not go negative", () => {
    const r = calculateDonationsDeduction({ basic: { taxYear: 2024 }, donations: { hometown: 1_000, other: 0 } });
    expect(r.amount).toBe(0);
  });
});


