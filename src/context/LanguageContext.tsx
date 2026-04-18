"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type Lang, type TranslationKey, translate, getLangFromStorage, setLangInStorage } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    setLangState(getLangFromStorage());
    const sync = () => setLangState(getLangFromStorage());
    window.addEventListener("vims:lang_change", sync);
    return () => window.removeEventListener("vims:lang_change", sync);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    setLangInStorage(l);
    window.dispatchEvent(new CustomEvent("vims:lang_change"));
  }, []);

  const t = useCallback((key: TranslationKey) => translate(key, lang), [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
