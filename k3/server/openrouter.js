const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "openai/gpt-oss-20b:free";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
  return status === 429 || status === 502 || status === 503;
}

function getErrorMessage(data, status) {
  const raw = data?.error?.metadata?.raw;
  if (typeof raw === "string" && raw.includes("rate-limited")) {
    return "KirjoBot on tilapäisesti ruuhkautunut. Yritä hetken kuluttua uudelleen.";
  }
  if (status === 429) {
    return "KirjoBot on tilapäisesti ruuhkautunut. Yritä hetken kuluttua uudelleen.";
  }
  return data?.error?.message || data?.error || "OpenRouter-pyyntö epäonnistui.";
}

function extractReply(data) {
  const message = data?.choices?.[0]?.message;
  return message?.content?.trim() || message?.reasoning?.trim() || null;
}

async function sendChatCompletion(messages) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  let lastError = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:3000",
        "X-OpenRouter-Title": "KirjoBot",
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        provider: {
          allow_fallbacks: true,
        },
      }),
    });

    const data = await response.json();

    if (response.ok) {
      const reply = extractReply(data);
      if (!reply) {
        throw new Error("OpenRouter ei palauttanut vastausta.");
      }
      return reply;
    }

    lastError = getErrorMessage(data, response.status);
    console.error(
      `OpenRouter attempt ${attempt + 1}/${MAX_RETRIES} failed:`,
      response.status,
      data?.error?.metadata?.raw || data?.error?.message
    );

    if (isRetryableStatus(response.status) && attempt < MAX_RETRIES - 1) {
      await sleep(RETRY_DELAY_MS * (attempt + 1));
      continue;
    }

    throw new Error(lastError);
  }

  throw new Error(lastError || "OpenRouter-pyyntö epäonnistui.");
}

module.exports = { sendChatCompletion };
