export default function Home() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="relative px-8 py-14">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900">控除ナビ</h1>
          <p className="text-base text-gray-700">
            確定申告の所得控除を、シンプルな入力で自動計算。医療費や保険、寄附金などをまとめてサクッと。
          </p>
          <div className="flex flex-wrap gap-6 pt-4 text-sm">
            <a href="/deductions/flow" className="text-gray-900 underline underline-offset-4 hover:opacity-70">すぐ入力を始める</a>
            <a href="/deductions" className="text-gray-900 underline underline-offset-4 hover:opacity-70">ダッシュボードを見る</a>
          </div>
          <div className="text-xs text-gray-500 pt-3">
            対応: 医療費・社会保険・iDeCo・小規模共済・生命/地震保険・寄附金。
          </div>
        </div>
      </div>
    </section>
  );
}
