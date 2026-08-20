function buildSystemPrompt(dbContext, pdfChunks) {
  const pdfSection =
    pdfChunks.length > 0
      ? pdfChunks
          .map(
            (chunk) =>
              `[${chunk.title} / ${chunk.source}]\n${chunk.text}`
          )
          .join("\n\n---\n\n")
      : "Ei saatavilla olevia dokumenttiotteita.";

  return `Olet KirjoBot, tekoälyavustaja taloyhtiölle As Oy Kirjokallionkuja 5.

Vastaa vain annettujen taloustietojen ja dokumenttiotteiden perusteella.
Jos tietoa ei löydy, kerro se rehellisesti. Vastaa suomeksi.

## Taloustiedot (vuosi ${dbContext.year})

${dbContext.summary}

## Dokumenttiotteet

${pdfSection}`;
}

module.exports = { buildSystemPrompt };
