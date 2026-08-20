const fs = require("fs");
const path = require("path");

const CHUNKS_FILE = path.join(__dirname, "data", "pdfChunks.json");
const MAX_CHUNKS = 5;

let cachedChunks = null;

function loadChunks() {
  if (cachedChunks) {
    return cachedChunks;
  }

  if (!fs.existsSync(CHUNKS_FILE)) {
    console.warn("PDF chunks not found. Run: npm run extract-pdfs");
    cachedChunks = [];
    return cachedChunks;
  }

  cachedChunks = JSON.parse(fs.readFileSync(CHUNKS_FILE, "utf8"));
  return cachedChunks;
}

function scoreChunk(chunk, queryWords) {
  const text = chunk.text.toLowerCase();
  let score = 0;

  for (const word of queryWords) {
    if (word.length < 3) continue;
    if (text.includes(word)) {
      score += 1;
    }
  }

  return score;
}

function getRelevantChunks(query) {
  const chunks = loadChunks();
  if (chunks.length === 0) {
    return [];
  }

  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length >= 3);

  if (queryWords.length === 0) {
    return chunks.slice(0, MAX_CHUNKS);
  }

  return chunks
    .map((chunk) => ({ chunk, score: scoreChunk(chunk, queryWords) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_CHUNKS)
    .map(({ chunk }) => chunk);
}

module.exports = { getRelevantChunks };
