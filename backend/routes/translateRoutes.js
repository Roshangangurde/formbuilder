import express from "express";

const router = express.Router();

// POST /translate — translate array of strings from English to target language
// Uses MyMemory free API (no key needed, 10k chars/day per IP)
router.post("/", async (req, res) => {
  const { texts, target } = req.body;

  if (!texts || !Array.isArray(texts) || !target) {
    return res.status(400).json({ error: "texts[] and target language code required" });
  }

  if (target === "en") {
    return res.json({ translations: texts });
  }

  try {
    const translations = await Promise.all(
      texts.map(async (text) => {
        if (!text || !String(text).trim()) return text;
        try {
          const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(String(text))}&langpair=en|${target}`;
          const response = await fetch(url);
          const data = await response.json();
          const translated = data.responseData?.translatedText;
          return translated && translated !== "PLEASE SELECT TWO DISTINCT LANGUAGES"
            ? translated
            : text;
        } catch {
          return text;
        }
      })
    );
    res.json({ translations });
  } catch (err) {
    res.status(500).json({ error: "Translation failed", details: err.message });
  }
});

export default router;
