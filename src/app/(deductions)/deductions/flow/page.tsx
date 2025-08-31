import { FlowForm } from "./FlowForm";

export default function DeductionsFlowPage() {
  return (
    <section className="space-y-8">
      <h1 className="text-2xl font-semibold">控除入力</h1>
      <div className="card p-6">
        <FlowForm />
      </div>
    </section>
  );
}


