import { DeductionsInput, DeductionsResult, DeductionBreakdown, YearParams } from "@/types/deductions";
import { calculateMedicalDeduction } from "./medical";
import { calculateSimpleFullDeduction } from "./simpleFull";
import { calculateLifeInsuranceDeduction } from "./lifeInsurance";
import { calculateEarthquakeInsuranceDeduction } from "./earthquakeInsurance";
import { calculateDonationsDeduction } from "./donations";
import { clampToNonNegative, sumBreakdowns } from "./utils";

export function calculateDeductions(input: DeductionsInput, params: YearParams): DeductionsResult {
  const breakdowns: DeductionBreakdown[] = [];

  // 医療費控除
  const medical = calculateMedicalDeduction(input, params);
  if (medical.amount > 0) breakdowns.push(medical);

  // 社会保険料控除（全額）
  const social = calculateSimpleFullDeduction("socialInsurance", input.socialInsurance?.paidTotal ?? 0);
  if (social.amount > 0) breakdowns.push(social);

  // iDeCo（全額）
  const ideco = calculateSimpleFullDeduction("iDeCo", input.iDeCo?.paidTotal ?? 0);
  if (ideco.amount > 0) breakdowns.push(ideco);

  // 小規模企業共済（全額）
  const sbm = calculateSimpleFullDeduction("smallBusinessMutualAid", input.smallBusinessMutualAid?.paidTotal ?? 0);
  if (sbm.amount > 0) breakdowns.push(sbm);

  // 生命保険料控除（段階）
  const life = calculateLifeInsuranceDeduction(input, params);
  if (life.amount > 0) breakdowns.push(life);

  // 地震保険料控除
  const quake = calculateEarthquakeInsuranceDeduction(input, params);
  if (quake.amount > 0) breakdowns.push(quake);

  // 寄附金控除（所得税分）
  const don = calculateDonationsDeduction(input);
  if (don.amount > 0) breakdowns.push(don);

  return {
    total: clampToNonNegative(sumBreakdowns(breakdowns)),
    items: breakdowns,
  };
}


