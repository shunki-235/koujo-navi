import { FlowForm } from "./FlowForm";

export default function DeductionsFlowPage() {
  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between">
        <h1 className="text-2xl font-bold text-blue-700">控除入力</h1>
        <a href="/deductions" className="text-sm text-blue-700 hover:underline">
          ダッシュボードへ戻る
        </a>
      </div>
      <div className="border bg-white p-4 shadow-sm">
        <FlowForm />
      </div>
    </section>
  );
}


