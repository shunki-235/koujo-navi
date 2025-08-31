import { DeductionBreakdown } from "@/types/deductions";

export function toInt(value: number | null | undefined): number {
  if (value == null || Number.isNaN(value)) return 0;
  return Math.max(0, Math.trunc(value));
}

export function formatCurrencyYen(n: number): string {
  try {
    return new Intl.NumberFormat("ja-JP").format(n);
  } catch {
    return String(n);
  }
}

export function clampToNonNegative(n: number): number {
  return n < 0 ? 0 : n;
}

export function sumBreakdowns(items: DeductionBreakdown[]): number {
  return items.reduce((acc, cur) => acc + cur.amount, 0);
}

export function createBreakdown(key: DeductionBreakdown["key"], amount: number, notes?: string[]): DeductionBreakdown {
  return { key, amount: toInt(amount), notes };
}


