import { createContext, useContext, useState, useEffect, useCallback } from "react";
import API from "../services/api";
import { INDIAN_LANGUAGES, UI_STRINGS } from "../config/languages";

const CACHE_PREFIX = "i18n_";
const RTL_LANGS = new Set(["ur", "ks", "sd"]);

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(
    () => localStorage.getItem("appLang") || "en"
  );
  const [t, setT] = useState(UI_STRINGS);
  const [translating, setTranslating] = useState(false);

  const applyLanguage = useCallback(async (code) => {
    localStorage.setItem("appLang", code);
    document.documentElement.dir = RTL_LANGS.has(code) ? "rtl" : "ltr";
    document.documentElement.lang = code;

    if (code === "en") {
      setT(UI_STRINGS);
      return;
    }

    const cacheKey = `${CACHE_PREFIX}${code}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        setT(JSON.parse(cached));
        return;
      } catch {
        localStorage.removeItem(cacheKey);
      }
    }

    setTranslating(true);
    try {
      const keys = Object.keys(UI_STRINGS);
      const values = Object.values(UI_STRINGS);
      const { data } = await API.post("/translate", { texts: values, target: code });
      const translated = {};
      keys.forEach((k, i) => {
        translated[k] = data.translations[i] || UI_STRINGS[k];
      });
      localStorage.setItem(cacheKey, JSON.stringify(translated));
      setT(translated);
    } catch {
      setT(UI_STRINGS);
    } finally {
      setTranslating(false);
    }
  }, []);

  useEffect(() => {
    applyLanguage(lang);
  }, [lang, applyLanguage]);

  const setLang = (code) => {
    setLangState(code);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, translating, INDIAN_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);

export default LanguageProvider;
