const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");
const { createWorker } = require("tesseract.js");

const DOCS_DIR = path.join(__dirname, "..", "docs");
const OUTPUT_DIR = path.join(__dirname, "..", "server", "data");
const OUTPUT_FILE = path.join(OUTPUT_DIR, "pdfChunks.json");

const CHUNK_SIZE = 800;
const CHUNK_OVERLAP = 100;

const PDF_FILES = [
  { filename: "Kaupparekisteriote.pdf", title: "Kaupparekisteriote" },
  { filename: "Yhtiojarjestys.pdf", title: "Yhtiöjärjestys" },
];

function splitIntoChunks(text, source, title) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [];

  const chunks = [];
  for (let i = 0; i < normalized.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
    chunks.push({
      source,
      title,
      text: normalized.slice(i, i + CHUNK_SIZE),
    });
  }
  return chunks;
}

async function ocrPdf(fileInfo, worker) {
  const filePath = path.join(DOCS_DIR, fileInfo.filename);
  const buffer = fs.readFileSync(filePath);
  const parser = new PDFParse({ data: buffer });

  let text = "";

  try {
    const textResult = await parser.getText();
    text = textResult.text || "";

    if (text.replace(/[-\s\d/]+/g, "").length < 50) {
      const imageResult = await parser.getImage({ imageThreshold: 0 });
      const pageTexts = [];

      for (const page of imageResult.pages) {
        for (const image of page.images) {
          const { data: ocrResult } = await worker.recognize(image.data);
          if (ocrResult.text.trim()) {
            pageTexts.push(ocrResult.text.trim());
          }
        }
      }

      text = pageTexts.join("\n\n");
    }
  } finally {
    await parser.destroy();
  }

  return splitIntoChunks(text, fileInfo.filename, fileInfo.title);
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const worker = await createWorker("fin");
  const allChunks = [];

  try {
    for (const fileInfo of PDF_FILES) {
      console.log(`Processing ${fileInfo.filename}...`);
      const chunks = await ocrPdf(fileInfo, worker);
      console.log(`  ${chunks.length} chunks (${chunks[0]?.text?.length || 0}+ chars)`);
      allChunks.push(...chunks);
    }
  } finally {
    await worker.terminate();
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allChunks, null, 2));
  console.log(`Wrote ${allChunks.length} chunks to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error("PDF extraction failed:", error);
  process.exit(1);
});
