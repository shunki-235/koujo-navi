export default function Home() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="card overflow-hidden">
        <div className="px-8 py-12">
          <span className="badge badge-primary">クラウド確定申告の体験を、もっと自由に</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">控除ナビ</h1>
          <p className="mt-2 text-base text-muted">シンプルな入力で所得控除を自動計算。医療費・保険・寄附金などをまとめてサクッと。</p>
          <div className="flex flex-wrap gap-3 pt-5 text-sm">
            <a href="/deductions/flow" className="btn btn-primary">すぐ入力を始める</a>
            <a href="/deductions" className="btn btn-outline">ダッシュボードを見る</a>
          </div>
          <div className="text-xs text-muted pt-4">対応: 医療費・社会保険・iDeCo・小規模共済・生命/地震保険・寄附金。</div>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="card p-5">
          <div className="text-sm font-semibold">年度パラメータに準拠</div>
          <p className="mt-1 text-sm text-muted">2023/2024/2025の根拠を明記し、境界値もテストで担保。</p>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold">PDF/JSON出力</div>
          <p className="mt-1 text-sm text-muted">日本語フォントを埋め込んだPDF、JSONの2形式で保存。</p>
        </div>
        <div className="card p-5">
          <div className="text-sm font-semibold">自動保存＆復元</div>
          <p className="mt-1 text-sm text-muted">離脱しても自動復元。E2Eテストで回帰を防止。</p>
        </div>
      </div>
    </section>
  );
}
