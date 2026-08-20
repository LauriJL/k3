async function sendChatMessage(messages, dbContext, idToken, signal) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, dbContext, idToken }),
    signal,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Chat-pyyntö epäonnistui.");
  }

  return data.reply;
}

export default sendChatMessage;
