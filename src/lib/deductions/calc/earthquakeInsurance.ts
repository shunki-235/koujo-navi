import { DeductionsInput, YearParams } from "@/types/deductions";
import { createBreakdown, toInt } from "./utils";

export function calculateEarthquakeInsuranceDeduction(input: DeductionsInput, params: YearParams) {
  const newPaid = toInt(input.earthquakeInsurance?.paidTotal ?? 0);
  const oldPaid = toInt(input.earthquakeInsurance?.oldSystem ?? 0);

  const newAmount = Math.min(newPaid, params.earthquakeInsurance.maxNew);
  const oldAmount = Math.min(oldPaid, params.earthquakeInsurance.maxOld);

  return createBreakdown("earthquakeInsurance", newAmount + oldAmount);
}


