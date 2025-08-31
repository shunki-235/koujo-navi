import type { NextRequest } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { result } = await req.json();
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit as unknown as any);
    const page = pdfDoc.addPage([595.28, 841.89]); // A4
    let font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    try {
      const fontPath = path.join(process.cwd(), "public", "fonts", "NotoSansJP-Regular.ttf");
      const fontBytes = await readFile(fontPath);
      font = await pdfDoc.embedFont(fontBytes);
    } catch {}
    const { width, height } = page.getSize();
    let y = height - 50;
    const left = 50;

    const drawText = (t: string, size = 12, color = rgb(0, 0, 0)) => {
      page.drawText(t, { x: left, y, size, font, color });
      y -= size + 6;
      if (y < 50) {
        y = height - 50;
        pdfDoc.addPage();
      }
    };

    drawText("控除結果レポート", 18);
    drawText("");
    drawText(`合計控除額: ${Number(result?.total ?? 0).toLocaleString()} 円`, 14);
    drawText("");
    for (const item of result?.items ?? []) {
      drawText(`${item.key}: ${Number(item.amount).toLocaleString()} 円`, 12);
      if (item.notes && item.notes.length) {
        for (const n of item.notes) drawText(`  - ${n}`, 11, rgb(0.3, 0.3, 0.3));
      }
    }

    // フッター（最終ページ下部）
    try {
      const pages = pdfDoc.getPages();
      const last = pages[pages.length - 1];
      last.drawText(`発行日時: ${new Date().toLocaleString("ja-JP")}`, { x: left, y: 30, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
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


