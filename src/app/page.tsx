export default function Home() {
  return (
    <section className="space-y-10">
      {/* Hero */}
      <div className="card overflow-hidden">
        <div className="px-8 py-12">
          <span className="badge badge-primary">クラウド確定申告の体験を、もっと自由に</span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">控除ナビ</h1>
          <p className="mt-2 text-base text-muted">質問に沿って入力するだけで、医療費・社会保険・iDeCo・小規模共済・生命/地震保険・寄附金の控除額を自動計算します。</p>
          <div className="flex flex-wrap gap-3 pt-5 text-sm">
            <a href="/deductions/flow" className="btn btn-primary">すぐ入力を始める</a>
            {/* ダッシュボード導線はTOP統一のため削除 */}
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

      {/* Notice */}
      <div className="card p-5">
        <div className="text-sm font-semibold">ご注意</div>
        <p className="mt-1 text-xs text-muted">本ツールの計算は参考値です。最終的な申告内容は、国税庁の案内および申告書様式をご確認のうえご判断ください。住民税側の特例や詳細控除は対象外です。</p>
      </div>
    </section>
  );
}
