import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { translations, type Lang, type TKey } from "./translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  t: (key: TKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Lang>("tr");

  // Hydrate from localStorage on the client.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("vega-lang");
    if (stored === "tr" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") window.localStorage.setItem("vega-lang", l);
    if (typeof document !== "undefined") document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => setLang(lang === "tr" ? "en" : "tr"), [lang, setLang]);

  const t = useCallback((key: TKey) => translations[lang][key] ?? translations.tr[key] ?? key, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};
