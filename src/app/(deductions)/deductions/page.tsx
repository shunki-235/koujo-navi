export default function DeductionsDashboardPage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-br from-blue-50 to-white">
        <div className="px-8 py-10">
          <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">確定申告をかんたんに</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">控除ナビで、面倒な控除入力をスマートに</h1>
          <p className="mt-2 text-sm text-gray-600">質問に答えるだけ。年度パラメータに基づく自動計算で、漏れなく・分かりやすく。</p>
          <div className="mt-6 flex gap-3">
            <a href="/deductions/flow" className="inline-flex items-center rounded-md bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow hover:bg-blue-700">入力フローをはじめる</a>
            <a href="/" className="inline-flex items-center rounded-md border px-5 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50">トップへ戻る</a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-5">
          <div className="text-sm font-semibold text-gray-900">年度対応</div>
          <p className="mt-1 text-sm text-gray-600">2023/2024/2025のパラメータに対応。根拠は国税庁タックスアンサーに準拠。</p>
        </div>
        <div className="rounded-lg border p-5">
          <div className="text-sm font-semibold text-gray-900">自動保存</div>
          <p className="mt-1 text-sm text-gray-600">入力は自動保存。離脱しても復元できます。</p>
        </div>
        <div className="rounded-lg border p-5">
          <div className="text-sm font-semibold text-gray-900">PDF/JSON出力</div>
          <p className="mt-1 text-sm text-gray-600">結果はPDF/JSONでダウンロード可能。日本語フォント埋め込みで印刷も安心。</p>
        </div>
      </div>
    </section>
  );
}


