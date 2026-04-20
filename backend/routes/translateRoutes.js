import express from "express";
import rateLimit from "express-rate-limit";

const router = express.Router();

const translateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Too many translation requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

// POST /translate — translate array of strings from English to target language
// Uses MyMemory free API (no key needed, 10k chars/day per IP)
router.post("/", translateLimiter, async (req, res) => {
  const { texts, target } = req.body;

  if (!texts || !Array.isArray(texts) || !target) {
    return res.status(400).json({ error: "texts[] and target language code required" });
  }

  if (texts.length > 50) {
    return res.status(400).json({ error: "Maximum 50 texts per request" });
  }

  if (texts.some(t => t && String(t).length > 500)) {
    return res.status(400).json({ error: "Each text must be under 500 characters" });
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
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;
