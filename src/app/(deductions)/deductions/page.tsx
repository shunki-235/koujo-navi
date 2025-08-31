export default function DeductionsDashboardPage() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="relative overflow-hidden card">
        <div className="px-8 py-10">
          <span className="badge badge-primary">確定申告をかんたんに</span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">控除ナビで、面倒な控除入力をスマートに</h1>
          <p className="mt-2 text-sm text-muted">質問に答えるだけ。年度パラメータに基づく自動計算で、漏れなく・分かりやすく。</p>
          <div className="mt-6 flex gap-3">
            <a href="/deductions/flow" className="btn btn-primary">入力フローをはじめる</a>
            <a href="/" className="btn btn-outline">トップへ戻る</a>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="text-sm font-semibold">年度対応</div>
          <p className="mt-1 text-sm text-muted">2023/2024/2025のパラメータに対応。根拠は国税庁タックスアンサーに準拠。</p>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold">自動保存</div>
          <p className="mt-1 text-sm text-muted">入力は自動保存。離脱しても復元できます。</p>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold">PDF/JSON出力</div>
          <p className="mt-1 text-sm text-muted">結果はPDF/JSONでダウンロード可能。日本語フォント埋め込みで印刷も安心。</p>
        </div>
      </div>
    </section>
  );
}


