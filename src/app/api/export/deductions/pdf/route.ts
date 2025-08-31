import type { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function labelOf(key: string): string {
  switch (key) {
    case "medical":
      return "医療費控除";
    case "socialInsurance":
      return "社会保険料控除";
    case "iDeCo":
      return "iDeCo掛金控除";
    case "smallBusinessMutualAid":
      return "小規模企業共済等掛金控除";
    case "lifeInsurance":
      return "生命保険料控除";
    case "earthquakeInsurance":
      return "地震保険料控除";
    case "donations":
      return "寄附金控除(所得税)";
    default:
      return key;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { result, taxYear } = await req.json();
    const pdfDoc = await PDFDocument.create();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfDoc.registerFontkit(fontkit as unknown as any);
    let page = pdfDoc.addPage([595.28, 841.89]); // A4
    let font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    try {
      const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.ttf");
      const fontBytes = await readFile(fontPath);
      font = await pdfDoc.embedFont(fontBytes);
    } catch {}
    let { width, height } = page.getSize();
    const left = 50;
    const right = width - 50;
    let y = height - 60;

    const drawHr = (yy: number) => {
      page.drawRectangle({ x: left, y: yy, width: right - left, height: 0.6, color: rgb(0.85, 0.85, 0.85) });
    };

    const drawTableHeader = () => {
      const headerY = y;
      page.drawText("内訳", { x: left, y: headerY, size: 12, font, color: rgb(0, 0, 0) });
      const amtHeader = "金額(円)";
      const ahw = font.widthOfTextAtSize(amtHeader, 12);
      page.drawText(amtHeader, { x: right - ahw, y: headerY, size: 12, font, color: rgb(0.2, 0.2, 0.2) });
      drawHr(headerY - 4);
      y -= 16;
    };

    const ensurePage = (advance: number) => {
      if (y - advance < 50) {
        page = pdfDoc.addPage([595.28, 841.89]);
        ({ width, height } = page.getSize());
        y = height - 60;
        // ページヘッダ
        page.drawText("控除結果レポート", { x: left, y, size: 14, font, color: rgb(0, 0, 0) });
        y -= 20;
        drawTableHeader();
      }
    };

    // タイトルと年度
    page.drawText("控除結果レポート", { x: left, y, size: 18, font, color: rgb(0, 0, 0) });
    if (taxYear) {
      const yearText = `対象年度: ${String(taxYear)}年`;
      const tw = font.widthOfTextAtSize(yearText, 12);
      page.drawText(yearText, { x: right - tw, y, size: 12, font, color: rgb(0.2, 0.2, 0.2) });
    }
    y -= 26;

    // 合計
    const totalText = `合計控除額`;
    const amountText = `${Number(result?.total ?? 0).toLocaleString()} 円`;
    page.drawText(totalText, { x: left, y, size: 14, font });
    const aw = font.widthOfTextAtSize(amountText, 14);
    page.drawText(amountText, { x: right - aw, y, size: 14, font });
    y -= 24;

    // テーブルヘッダ
    drawTableHeader();

    for (const item of result?.items ?? []) {
      const label = labelOf(item.key);
      const value = `${Number(item.amount).toLocaleString()}`;
      ensurePage(20);
      page.drawText(label, { x: left, y, size: 12, font, color: rgb(0, 0, 0) });
      const vw = font.widthOfTextAtSize(value, 12);
      page.drawText(value, { x: right - vw, y, size: 12, font, color: rgb(0, 0, 0) });
      drawHr(y - 4);
      y -= 20;
      if (item.notes && item.notes.length) {
        for (const n of item.notes) {
          const noteText = `・${n}`;
          const advance = 14;
          ensurePage(advance);
          page.drawText(noteText, { x: left + 14, y, size: 11, font, color: rgb(0.3, 0.3, 0.3) });
          y -= advance;
        }
      }
    }

    // フッター（各ページ: ページ番号、最終ページ: 発行日時）
    try {
      const pages = pdfDoc.getPages();
      const total = pages.length;
      pages.forEach((p, idx) => {
        const footerY = 30;
        const pageLabel = `${idx + 1} / ${total}`;
        const pw = font.widthOfTextAtSize(pageLabel, 10);
        p.drawText(pageLabel, { x: right - pw, y: footerY, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
      });
      const last = pages[pages.length - 1];
      last.drawText(`発行日時: ${new Date().toLocaleString("ja-JP")}`,
        { x: left, y: 30, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
    } catch {}

    const pdfBytes = await pdfDoc.save();
    return new Response(new Uint8Array(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=deductions-result.pdf",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return new Response("Bad Request", { status: 400 });
  }
}


