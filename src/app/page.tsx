export default function Home() {
  return (
    <section className="relative overflow-hidden border bg-white shadow-sm">
      <div className="relative px-8 py-14">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-700">控除ナビ</h1>
          <p className="text-base text-gray-600">
            確定申告の所得控除を、シンプルな入力で自動計算。医療費や保険、寄附金などをまとめてサクッと。
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="/deductions/flow" className="inline-flex items-center bg-blue-600 text-white px-4 py-2 text-sm shadow hover:bg-blue-700">
              すぐ入力を始める
            </a>
            <a href="/deductions" className="inline-flex items-center border px-4 py-2 text-sm hover:bg-blue-50">
              ダッシュボードを見る
            </a>
          </div>
          <div className="text-xs text-gray-500 pt-3">
            対応: 医療費・社会保険・iDeCo・小規模共済・生命/地震保険・寄附金。
          </div>
        </div>
      </div>
    </section>
  );
}
