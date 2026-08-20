require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { verifyFirebaseToken } = require("./verifyToken");
const { getRelevantChunks } = require("./pdfContext");
const { buildSystemPrompt } = require("./buildSystemPrompt");
const { sendChatCompletion } = require("./openrouter");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.post("/api/chat", async (req, res) => {
  try {
    const { messages, dbContext, idToken } = req.body;

    if (!idToken) {
      return res.status(401).json({ error: "Kirjautuminen vaaditaan." });
    }

    const user = await verifyFirebaseToken(idToken);
    if (!user) {
      return res.status(401).json({ error: "Virheellinen kirjautuminen." });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Viestit puuttuvat." });
    }

    if (!dbContext?.year || !dbContext?.summary) {
      return res.status(400).json({ error: "Taloustiedot puuttuvat." });
    }

    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");
    const query = lastUserMessage?.content || "";
    const pdfChunks = getRelevantChunks(query);
    const systemPrompt = buildSystemPrompt(dbContext, pdfChunks);

    const reply = await sendChatCompletion([
      { role: "system", content: systemPrompt },
      ...messages,
    ]);

    res.json({ reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: error.message || "Chat-pyyntö epäonnistui." });
  }
});

app.listen(PORT, () => {
  console.log(`KirjoBot server running on http://localhost:${PORT}`);
});
