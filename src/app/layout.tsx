import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "控除ナビ - 確定申告の所得控除をかんたんに",
    template: "%s | 控除ナビ",
  },
  description: "医療費・社会保険・iDeCo・小規模共済・生命/地震保険・寄附金などの所得控除を、シンプルな入力で自動計算できるツールです。",
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  openGraph: {
    title: "控除ナビ | 所得控除の自動計算とPDF出力",
    description: "医療費・社会保険・iDeCo・小規模共済・生命/地震保険・寄附金の控除額を質問に答えるだけで自動計算。日本語フォント埋め込みPDF/JSONで保存できます。",
    url: "/",
    siteName: "控除ナビ",
    locale: "ja_JP",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "控除ナビ" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "控除ナビ | 所得控除の自動計算とPDF出力",
    description: "質問に沿って入力するだけで主要な所得控除を自動計算。日本語対応PDFで保存。",
    images: ["/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 btn btn-outline">本文へスキップ</a>
        <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
          <div className="mx-auto max-w-5xl px-6 h-14 flex items-center">
            <Link href="/" className="font-semibold tracking-tight text-gray-900">控除ナビ</Link>
          </div>
        </header>
        <main id="main" className="mx-auto max-w-5xl px-6 py-8">
          {children}
        </main>
        <footer className="border-t py-8 text-center text-xs text-gray-500">© 控除ナビ</footer>
      </body>
    </html>
  );
}
