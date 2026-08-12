import React, { createContext, useContext, useEffect, useState } from "react";
import translations from "../i18n";
import { translateValue } from "../i18n/valueTranslations";

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ar");

  useEffect(() => {
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  // t: static UI strings (buttons, labels, headings) — defined in src/i18n/en.json and ar.json
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  // tv: dynamic values that come from the database (category names, color names) —
  // looked up in src/i18n/valueTranslations.js, falls back to the raw value if unknown
  const tv = (value) => translateValue(value, lang);

  const toggleLang = () => setLang((prev) => (prev === "en" ? "ar" : "en"));

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, tv }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
