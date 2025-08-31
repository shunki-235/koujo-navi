"use client";

import { useEffect, useState, useTransition, type FocusEvent } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DeductionsInput, DeductionsResult, TaxYear } from "@/types/deductions";
import { getYearParams } from "@/lib/deductions/params";
import { calculateDeductions } from "@/lib/deductions/calc";
import { formatCurrencyYen } from "@/lib/deductions/calc/utils";
import { z } from "zod";

const flowFormSchema = z
  .object({
    taxYear: z.union([z.literal(2023), z.literal(2024), z.literal(2025)]),
    totalIncome: z
      .number()
      .int()
      .min(0, "0以上で入力してください")
      .nullable()
      .refine((v) => v !== null, { path: ["totalIncome"], message: "入力してください" }),
    medicalPaid: z.number().int().min(0, "0以上で入力してください").nullable(),
    medicalReimbursed: z
      .number()
      .int()
      .min(0, "0以上で入力してください")
      .nullable()
      .refine((v) => v !== null, { path: ["medicalReimbursed"], message: "入力してください" }),
    socialPaid: z.number().int().min(0, "0以上で入力してください").nullable(),
    idecoPaid: z.number().int().min(0, "0以上で入力してください").nullable(),
    sbmPaid: z.number().int().min(0, "0以上で入力してください").nullable(),
    lifeGeneral: z.number().int().min(0, "0以上で入力してください").nullable(),
    lifePension: z.number().int().min(0, "0以上で入力してください").nullable(),
    lifeMedical: z.number().int().min(0, "0以上で入力してください").nullable(),
    lifeOld: z.number().int().min(0, "0以上で入力してください").nullable(),
    quakePaid: z.number().int().min(0, "0以上で入力してください").nullable(),
    quakeOld: z.number().int().min(0, "0以上で入力してください").nullable(),
    donationHome: z.number().int().min(0, "0以上で入力してください").nullable(),
    donationOther: z.number().int().min(0, "0以上で入力してください").nullable(),
  })
  .refine(
    (data) => {
      const paid = data.medicalPaid ?? 0;
      const reimb = data.medicalReimbursed ?? 0;
      return reimb <= paid;
    },
    { path: ["medicalReimbursed"], message: "補填額は支払額以下にしてください" }
  );

type FormValues = z.infer<typeof flowFormSchema>;

function toIntOrNull(v: unknown): number | null {
  if (v === "" || v == null) return null;
  const s = typeof v === "string" ? v.replace(/,/g, "") : String(v);
  const n = Number(s);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function onCurrencyFocus(e: FocusEvent<HTMLInputElement>) {
  e.currentTarget.value = e.currentTarget.value.replace(/,/g, "");
}

function onCurrencyBlur(e: FocusEvent<HTMLInputElement>) {
  const n = toIntOrNull(e.currentTarget.value);
  e.currentTarget.value = n != null ? formatCurrencyYen(n) : "";
}

export function FlowForm() {
  const [result, setResult] = useState<DeductionsResult | null>(null);
  const [isPending, startTransition] = useTransition();
  const [restoreCandidate, setRestoreCandidate] = useState<Partial<FormValues> | null>(null);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  const STORAGE_KEY = "deductions-flow:v1";

  const { register, handleSubmit, reset, watch, trigger, setFocus, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(flowFormSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      taxYear: 2024,
      totalIncome: null,
      medicalPaid: null,
      medicalReimbursed: null,
      socialPaid: null,
      idecoPaid: null,
      sbmPaid: null,
      lifeGeneral: null,
      lifePension: null,
      lifeMedical: null,
      lifeOld: null,
      quakePaid: null,
      quakeOld: null,
      donationHome: null,
      donationOther: null,
    },
  });

  const steps: { key: string; label: string; fields: Path<FormValues>[] }[] = [
    { key: "basic", label: "基本", fields: ["taxYear", "totalIncome"] },
    { key: "medical", label: "医療費", fields: ["medicalPaid", "medicalReimbursed"] },
    { key: "social", label: "社会保険等", fields: ["socialPaid", "idecoPaid", "sbmPaid"] },
    { key: "life", label: "生命保険", fields: ["lifeGeneral", "lifePension", "lifeMedical", "lifeOld"] },
    { key: "earthquake", label: "地震保険", fields: ["quakePaid", "quakeOld"] },
    { key: "donation", label: "寄附金", fields: ["donationHome", "donationOther"] },
    { key: "review", label: "確認", fields: [] },
  ];
  const [step, setStep] = useState(0);
  useEffect(() => {
    const first = steps[step]?.fields[0];
    if (first) setFocus(first);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  // 初回マウント時: 保存済みドラフトがあれば復元選択を提示
  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormValues>;
        setRestoreCandidate({
          taxYear: (parsed.taxYear ?? 2024) as FormValues["taxYear"],
          totalIncome: parsed.totalIncome ?? null,
          medicalPaid: parsed.medicalPaid ?? null,
          medicalReimbursed: parsed.medicalReimbursed ?? null,
          socialPaid: parsed.socialPaid ?? null,
          idecoPaid: parsed.idecoPaid ?? null,
          sbmPaid: parsed.sbmPaid ?? null,
          lifeGeneral: parsed.lifeGeneral ?? null,
          lifePension: parsed.lifePension ?? null,
          lifeMedical: parsed.lifeMedical ?? null,
          lifeOld: parsed.lifeOld ?? null,
          quakePaid: parsed.quakePaid ?? null,
          quakeOld: parsed.quakeOld ?? null,
          donationHome: parsed.donationHome ?? null,
          donationOther: parsed.donationOther ?? null,
        });
        setShowRestorePrompt(true);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 入力を監視して自動保存（500msデバウンス）
  const watched = watch();
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(watched));
        }
      } catch {}
    }, 500);
    return () => clearTimeout(id);
  }, [watched]);

  const onSubmit = (values: FormValues) => {
    const taxYear = values.taxYear ?? 2024;

    const input: DeductionsInput = {
      basic: { taxYear, totalIncome: toIntOrNull(values.totalIncome) },
      medical: { paidTotal: toIntOrNull(values.medicalPaid) ?? 0, reimbursements: toIntOrNull(values.medicalReimbursed) ?? 0 },
      socialInsurance: { paidTotal: toIntOrNull(values.socialPaid) ?? 0 },
      iDeCo: { paidTotal: toIntOrNull(values.idecoPaid) ?? 0 },
      smallBusinessMutualAid: { paidTotal: toIntOrNull(values.sbmPaid) ?? 0 },
      lifeInsurance: {
        general: toIntOrNull(values.lifeGeneral) ?? 0,
        pension: toIntOrNull(values.lifePension) ?? 0,
        medicalCare: toIntOrNull(values.lifeMedical) ?? 0,
        oldSystem: toIntOrNull(values.lifeOld) ?? 0,
      },
      earthquakeInsurance: { paidTotal: toIntOrNull(values.quakePaid) ?? 0, oldSystem: toIntOrNull(values.quakeOld) ?? 0 },
      donations: { hometown: toIntOrNull(values.donationHome) ?? 0, other: toIntOrNull(values.donationOther) ?? 0 },
    };

    const params = getYearParams(taxYear);
    startTransition(() => {
      const r = calculateDeductions(input, params);
      setResult(r);
    });
  };

  const errorMessages = Object.values(errors).map((e) => String(e?.message ?? "")).filter(Boolean);
  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 card p-5">
        {/* エラー要約（A11y） */}
        {errorMessages.length > 0 && (
          <div role="alert" aria-live="polite" className="card p-3" aria-atomic="true">
            <div className="text-sm font-semibold">入力エラーがあります</div>
            <ul className="list-disc pl-5 mt-1 text-sm text-danger">
              {errorMessages.slice(0, 5).map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>
        )}
        {showRestorePrompt && (
          <div className="card p-3 flex items-center gap-3" role="status" aria-live="polite">
            <div className="text-sm">前回の入力内容が見つかりました。復元しますか？</div>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                if (restoreCandidate) {
                  reset(restoreCandidate as FormValues);
                }
                setShowRestorePrompt(false);
              }}
            >復元する</button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => {
                try {
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem(STORAGE_KEY);
                  }
                } catch {}
                setShowRestorePrompt(false);
              }}
            >破棄して新規</button>
          </div>
        )}
        <nav aria-label="ステップ">
          <ul className="flex items-center gap-6 text-sm overflow-x-auto">
            {steps.map((s, idx) => {
              const isSelected = idx === step;
              const isLast = idx === steps.length - 1;
              const isFieldsComplete = s.fields.length > 0 && s.fields.every((f) => {
                const v = (watched as unknown as Record<string, unknown>)[f as string];
                const hasError = Boolean((errors as unknown as Record<string, unknown>)[f as string]);
                return v !== null && v !== undefined && String(v) !== "" && !hasError;
              });
              const arePreviousStepsComplete = steps
                .slice(0, steps.length - 1)
                .every((ps) => ps.fields.length > 0 && ps.fields.every((f) => {
                  const v = (watched as unknown as Record<string, unknown>)[f as string];
                  const hasError = Boolean((errors as unknown as Record<string, unknown>)[f as string]);
                  return v !== null && v !== undefined && String(v) !== "" && !hasError;
                }));
              const isComplete = isLast ? arePreviousStepsComplete : isFieldsComplete;
              const badgeText = isLast ? (isComplete ? "確認OK" : "確認待ち") : (isComplete ? "完了" : "未完了");
              return (
                <li key={s.key} aria-current={isSelected ? "step" : undefined} className={`pb-2 ${isSelected ? "border-b-2 border-blue-600" : "border-b border-transparent"}`}>
                  <button
                    type="button"
                    className={`px-0 py-1 ${isSelected ? "text-gray-900" : "text-muted hover:text-gray-900"}`}
                    onClick={async () => {
                      const valid = await trigger(steps[step].fields);
                      if (valid) setStep(idx);
                    }}
                  >
                    {idx + 1}. {s.label}
                  </button>
                  <span className={`ml-2 align-middle badge ${isComplete ? "badge-primary" : "badge-neutral"}`}>{badgeText}</span>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid grid-cols-2 gap-4 max-w-3xl">
          {step === 0 && (
            <>
          <label className="flex flex-col text-sm gap-1">
            <span>年度</span>
            <select className="select" {...register("taxYear", { setValueAs: (v) => Number(v) as TaxYear })} defaultValue={2024}>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
              <option value={2025}>2025</option>
            </select>
          </label>

          <label className="flex flex-col text-sm gap-1">
            <span>
              総所得金額等
              <span className="ml-1 text-gray-400 cursor-help" title="医療費控除の足切り(10万円または所得の5%の小さい方)の計算に使用します。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.totalIncome} aria-describedby="totalIncome-error" className="input" {...register("totalIncome", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("totalIncome")} />
            {errors.totalIncome && <span id="totalIncome-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.totalIncome.message as string}</span>}
          </label>
            </>
          )}

          {step === 1 && (
            <>
          <div className="col-span-2 section-title"><span className="icon">🩺</span>医療費控除</div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              医療費(支払額)
              <span className="ml-1 text-gray-400 cursor-help" title="対象医療費の自己負担分合計を入力します。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.medicalPaid} aria-describedby="medicalPaid-error" className="input" {...register("medicalPaid", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger(["medicalPaid","medicalReimbursed"]) } />
            {errors.medicalPaid && <span id="medicalPaid-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.medicalPaid.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>
              医療費(補填額)
              <span className="ml-1 text-gray-400 cursor-help" title="医療保険等で補填された金額を入力します。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.medicalReimbursed} aria-describedby="medicalReimbursed-error" className="input" {...register("medicalReimbursed", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger(["medicalPaid","medicalReimbursed"]) } />
            {errors.medicalReimbursed && <span id="medicalReimbursed-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.medicalReimbursed.message as string}</span>}
          </label>
            </>
          )}

          {step === 2 && (
            <>
          <div className="col-span-2 section-title"><span className="icon">🛡️</span>社会保険・iDeCo・小規模共済</div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              社会保険料 合計
              <span className="ml-1 text-gray-400 cursor-help" title="国民年金、国民健康保険、介護保険等の自己負担分の合計。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.socialPaid} aria-describedby="socialPaid-error" className="input" {...register("socialPaid", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("socialPaid")} />
            {errors.socialPaid && <span id="socialPaid-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.socialPaid.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>
              iDeCo 掛金
              <span className="ml-1 text-gray-400 cursor-help" title="年内に拠出した個人型確定拠出年金の掛金。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.idecoPaid} aria-describedby="idecoPaid-error" className="input" {...register("idecoPaid", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("idecoPaid")} />
            {errors.idecoPaid && <span id="idecoPaid-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.idecoPaid.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>
              小規模企業共済 掛金
              <span className="ml-1 text-gray-400 cursor-help" title="年内に支払った小規模企業共済等の掛金。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.sbmPaid} aria-describedby="sbmPaid-error" className="input" {...register("sbmPaid", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("sbmPaid")} />
            {errors.sbmPaid && <span id="sbmPaid-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.sbmPaid.message as string}</span>}
          </label>
            </>
          )}

          {step === 3 && (
            <>
          <div className="col-span-2 section-title"><span className="icon">💙</span>生命保険料控除</div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              一般(新制度)
              <span className="ml-1 text-gray-400 cursor-help" title="一般生命保険料(新制度)の支払額。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.lifeGeneral} aria-describedby="lifeGeneral-error" className="input" {...register("lifeGeneral", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("lifeGeneral")} />
            {errors.lifeGeneral && <span id="lifeGeneral-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.lifeGeneral.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>
              個人年金(新制度)
              <span className="ml-1 text-gray-400 cursor-help" title="個人年金保険料(新制度)の支払額。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.lifePension} aria-describedby="lifePension-error" className="input" {...register("lifePension", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("lifePension")} />
            {errors.lifePension && <span id="lifePension-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.lifePension.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>
              介護医療(新制度)
              <span className="ml-1 text-gray-400 cursor-help" title="介護医療保険料(新制度)の支払額。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.lifeMedical} aria-describedby="lifeMedical-error" className="input" {...register("lifeMedical", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("lifeMedical")} />
            {errors.lifeMedical && <span id="lifeMedical-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.lifeMedical.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>
              旧制度
              <span className="ml-1 text-gray-400 cursor-help" title="旧制度(2011年以前契約)の対象保険料。簡易計上。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.lifeOld} aria-describedby="lifeOld-error" className="input" {...register("lifeOld", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("lifeOld")} />
            {errors.lifeOld && <span id="lifeOld-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.lifeOld.message as string}</span>}
          </label>
            </>
          )}

          {step === 4 && (
            <>
          <div className="col-span-2 section-title"><span className="icon">🏠</span>地震保険料控除</div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              地震保険料(新制度)
              <span className="ml-1 text-gray-400 cursor-help" title="当年分の地震保険料。上限あり。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.quakePaid} aria-describedby="quakePaid-error" className="input" {...register("quakePaid", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("quakePaid")} />
            {errors.quakePaid && <span id="quakePaid-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.quakePaid.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>
              旧長期損害保険等
              <span className="ml-1 text-gray-400 cursor-help" title="旧制度の長期損害保険等。上限あり。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.quakeOld} aria-describedby="quakeOld-error" className="input" {...register("quakeOld", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("quakeOld")} />
            {errors.quakeOld && <span id="quakeOld-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.quakeOld.message as string}</span>}
          </label>
            </>
          )}

          {step === 5 && (
            <>
          <div className="col-span-2 section-title"><span className="icon">🎁</span>寄附金控除</div>
          <label className="flex flex-col text-sm gap-1">
            <span>
              ふるさと納税
              <span className="ml-1 text-gray-400 cursor-help" title="住民税側の特例控除はMVP対象外です。">?</span>
            </span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.donationHome} aria-describedby="donationHome-error" className="input" {...register("donationHome", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("donationHome")} />
            {errors.donationHome && <span id="donationHome-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.donationHome.message as string}</span>}
          </label>
          <label className="flex flex-col text-sm gap-1">
            <span>その他寄附</span>
            <input type="text" inputMode="numeric" aria-invalid={!!errors.donationOther} aria-describedby="donationOther-error" className="input" {...register("donationOther", { setValueAs: toIntOrNull })} onFocus={onCurrencyFocus} onBlur={onCurrencyBlur} onChange={() => trigger("donationOther")} />
            {errors.donationOther && <span id="donationOther-error" role="alert" aria-live="polite" className="text-xs text-red-600">{errors.donationOther.message as string}</span>}
          </label>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="btn btn-outline"
            >
              戻る
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              type="button"
              onClick={async () => {
                const fields = steps[step].fields;
                const validByZod = await trigger(fields);
                const hasErrors = fields.some((n) => (errors as unknown as Record<string, unknown>)[n as string]);
                const firstEmpty = fields.find((n) => {
                  const v = (watched as unknown as Record<string, unknown>)[n as string];
                  return v === null || v === undefined || String(v) === "";
                });
                if (validByZod && !hasErrors && !firstEmpty) {
                  setStep((s) => Math.min(steps.length - 1, s + 1));
                } else {
                  const firstInvalid = fields.find((n) => (errors as unknown as Record<string, unknown>)[n as string]);
                  const target = firstInvalid ?? firstEmpty;
                  if (target) setFocus(target);
                }
              }}
              className="btn btn-primary"
            >
              次へ
            </button>
          )}
          {step === steps.length - 1 && (
            <button disabled={isPending} className="btn btn-primary disabled:opacity-70">
              {isPending ? "計算中..." : "計算する"}
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              const sample: FormValues = {
                taxYear: 2024,
                totalIncome: 4000000,
                medicalPaid: 300000,
                medicalReimbursed: 50000,
                socialPaid: 600000,
                idecoPaid: 240000,
                sbmPaid: 84000,
                lifeGeneral: 50000,
                lifePension: 40000,
                lifeMedical: 30000,
                lifeOld: 0,
                quakePaid: 20000,
                quakeOld: 0,
                donationHome: 50000,
                donationOther: 10000,
              };
              reset(sample);
            }}
            className="btn btn-outline"
          >
            サンプル値を入れる
          </button>
          <div className="ml-auto text-xs text-gray-500">
            自動保存: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </form>

      {result && (
        <div className="card p-0 overflow-hidden">
          <div className="sticky top-0 bg-white/80 backdrop-blur p-4 flex items-center justify-between">
            <div className="font-semibold">計算結果</div>
            <div className="text-base">
              合計控除額: <span className="font-bold">{result.total.toLocaleString()} 円</span>
            </div>
          </div>
          <div className="p-4 space-y-3">
            <ul className="space-y-2 text-sm">
              {result.items.map((i) => (
                <li key={i.key} className="">
                  <div className="flex items-center justify-between">
                    <span>{labelOf(i.key)}</span>
                    <span>{formatCurrencyYen(i.amount)} 円</span>
                  </div>
                  {i.notes && i.notes.length > 0 && (
                    <ul className="list-disc pl-5 mt-1 text-gray-500">
                      {i.notes.map((n, idx) => (
                        <li key={idx}>{n}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.localStorage.removeItem(STORAGE_KEY);
                  }
                  reset();
                  setResult(null);
                }}
                className="btn btn-outline"
              >
                入力をクリア
              </button>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (!result) return;
                    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "deductions-result.json";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn btn-outline"
                >
                  JSONをダウンロード
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!result) return;
                    const res = await fetch("/api/export/deductions/pdf", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ result, taxYear: watched.taxYear ?? 2024 }),
                    });
                    if (!res.ok) return;
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "deductions-result.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    URL.revokeObjectURL(url);
                  }}
                  className="btn btn-outline"
                >
                  PDFをダウンロード
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function labelOf(key: DeductionsResult["items"][number]["key"]): string {
  switch (key) {
    case "medical":
      return "医療費控除";
    case "socialInsurance":
      return "社会保険料控除";
    case "iDeCo":
      return "iDeCo掛金控除";
    case "smallBusinessMutualAid":
      return "小規模企業共済等掛金控除";
    case "lifeInsurance":
      return "生命保険料控除";
    case "earthquakeInsurance":
      return "地震保険料控除";
    case "donations":
      return "寄附金控除(所得税)";
    default:
      return key;
  }
}


