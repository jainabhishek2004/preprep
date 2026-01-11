import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import PDFParser from "pdf2json";
import os from "os";
import path from "path";

export async function GET() {
  // ✅ Change this to your local or online PDF path:
  // Example 1 (Local): "C:\\Users\\Abhishek\\Desktop\\bitcoin.pdf"
  // Example 2 (Online): "https://bitcoin.org/bitcoin.pdf"
 const pdfPathOrUrl = "https://bitcoin.org/bitcoin.pdf";


  const fileName = `${uuidv4()}.pdf`;
  const tempFilePath = path.join(os.tmpdir(), fileName);

  try {
    let buffer: Buffer;

    // 1️⃣ Check if it's a URL or a local path
    if (pdfPathOrUrl.startsWith("http")) {
      console.log("🌐 Fetching PDF from online URL...");
      const response = await fetch(pdfPathOrUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch PDF: ${response.statusText}`);
      }
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      console.log("💾 Reading PDF from local computer path...");
      buffer = await fs.readFile(pdfPathOrUrl);
    }

    // 2️⃣ Save a temporary copy
    await fs.writeFile(tempFilePath, buffer);

    // 3️⃣ Parse PDF using pdf2json
    const pdfParser = new (PDFParser as any)(null, 1);
    let parsedText = "";

    pdfParser.on("pdfParser_dataError", (errData: any) =>
      console.error("❌ PDF parsing error:", errData.parserError)
    );

    pdfParser.on("pdfParser_dataReady", () => {
      parsedText = (pdfParser as any).getRawTextContent();
      console.log("📄 Extracted Text:\n", parsedText);
    });

    // 4️⃣ Wait for parsing to finish
    await new Promise((resolve, reject) => {
      pdfParser.loadPDF(tempFilePath);
      pdfParser.on("pdfParser_dataReady", resolve);
      pdfParser.on("pdfParser_dataError", reject);
    });

    // 5️⃣ Return response
    return NextResponse.json({
      message: "✅ PDF parsed successfully. Check your terminal for extracted text.",
      fileName,
      source: pdfPathOrUrl,
    });
  } catch (error: any) {
    console.error("❌ Error parsing PDF:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
