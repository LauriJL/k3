async function verifyFirebaseToken(idToken) {
  const apiKey = process.env.REACT_APP_API_KEY;
  if (!apiKey) {
    throw new Error("REACT_APP_API_KEY is not configured");
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return null;
  }

  return data.users?.[0] || null;
}

module.exports = { verifyFirebaseToken };
