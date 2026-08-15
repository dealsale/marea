"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { dict, type Lang } from "@/lib/i18n";

type Dictionary = (typeof dict)["es"];
type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Dictionary };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("marea_lang")) as Lang | null;
    if (saved === "es" || saved === "en") {
      setLangState(saved);
    } else if (typeof navigator !== "undefined" && navigator.language.startsWith("en")) {
      setLangState("en");
    }
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("marea_lang", l);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: dict[lang] as Dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
