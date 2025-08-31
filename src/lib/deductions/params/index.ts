import { YearParams } from "@/types/deductions";

import { params2023 } from "./y2023";
import { params2024 } from "./y2024";
import { params2025 } from "./y2025";

export const YEAR_PARAMS: Record<number, YearParams> = {
  2023: params2023,
  2024: params2024,
  2025: params2025,
};

export function getYearParams(year: number): YearParams {
  const params = YEAR_PARAMS[year];
  if (!params) {
    throw new Error(`Unsupported tax year: ${year}`);
  }
  return params;
}


