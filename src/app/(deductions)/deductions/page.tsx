export default function DeductionsDashboardPage() {
  return (
    <section className="space-y-6">
      <div className="border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-blue-700">控除ダッシュボード</h1>
        <p className="mt-1 text-sm text-gray-600">年度を選び、入力フローに進んでください。</p>
        <div className="mt-4">
          <a href="/deductions/flow" className="inline-flex items-center bg-blue-600 text-white px-4 py-2 text-sm shadow hover:bg-blue-700">
            入力フローへ
          </a>
        </div>
      </div>
    </section>
  );
}


