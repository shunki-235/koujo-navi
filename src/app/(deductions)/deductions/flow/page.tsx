import { FlowForm } from "./FlowForm";

export default function DeductionsFlowPage() {
  return (
    <section className="space-y-8">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">控除入力</h1>
        <a href="/deductions" className="text-sm text-gray-900 underline underline-offset-4 hover:opacity-70">
          ダッシュボードへ戻る
        </a>
      </div>
      <div className="bg-white p-6">
        <FlowForm />
      </div>
    </section>
  );
}


