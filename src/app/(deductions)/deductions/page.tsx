export default function DeductionsDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="bg-white p-8">
        <h1 className="text-2xl font-semibold text-gray-900">控除ダッシュボード</h1>
        <p className="mt-2 text-sm text-gray-700">年度を選び、入力フローに進んでください。</p>
        <div className="mt-4 text-sm">
          <a href="/deductions/flow" className="text-gray-900 underline underline-offset-4 hover:opacity-70">入力フローへ</a>
        </div>
      </div>
    </section>
  );
}


