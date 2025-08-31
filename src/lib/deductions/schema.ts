import { z } from "zod";

export const taxYearSchema = z.union([z.literal(2023), z.literal(2024), z.literal(2025)]);

export const basicInputSchema = z.object({
  taxYear: taxYearSchema,
  totalIncome: z.number().int().min(0).nullable().optional(),
});

export const medicalInputSchema = z.object({
  paidTotal: z.number().int().min(0).nullable().optional(),
  reimbursements: z.number().int().min(0).nullable().optional(),
});

export const simpleAmountSchema = z.object({
  paidTotal: z.number().int().min(0).nullable().optional(),
});

export const lifeInsuranceInputSchema = z.object({
  general: z.number().int().min(0).nullable().optional(),
  pension: z.number().int().min(0).nullable().optional(),
  medicalCare: z.number().int().min(0).nullable().optional(),
  oldSystem: z.number().int().min(0).nullable().optional(),
});

export const earthquakeInsuranceInputSchema = z.object({
  paidTotal: z.number().int().min(0).nullable().optional(),
  oldSystem: z.number().int().min(0).nullable().optional(),
});

export const donationsInputSchema = z.object({
  hometown: z.number().int().min(0).nullable().optional(),
  other: z.number().int().min(0).nullable().optional(),
});

export const deductionsInputSchema = z.object({
  basic: basicInputSchema,
  medical: medicalInputSchema.optional(),
  socialInsurance: simpleAmountSchema.optional(),
  iDeCo: simpleAmountSchema.optional(),
  smallBusinessMutualAid: simpleAmountSchema.optional(),
  lifeInsurance: lifeInsuranceInputSchema.optional(),
  earthquakeInsurance: earthquakeInsuranceInputSchema.optional(),
  donations: donationsInputSchema.optional(),
});

export type DeductionsInputSchema = z.infer<typeof deductionsInputSchema>;


