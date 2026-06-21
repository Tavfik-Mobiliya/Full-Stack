"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import tr from "../locales/tr.json";

export type Language = "en" | "ar" | "tr";
export type Theme = "light" | "dark";

interface TranslationDict {
  [key: string]: string | TranslationDict;
}

const dictionaries: Record<Language, TranslationDict> = {
  en: en as TranslationDict,
  ar: ar as TranslationDict,
  tr: tr as TranslationDict,
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

function getInitialLanguage(): Language {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("preferred_lang") as Language;
    if (saved && ["en", "ar", "tr"].includes(saved)) return saved;
  }
  return "en";
}

function getInitialTheme(): Theme {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("preferred_theme") as Theme;
    if (saved && ["light", "dark"].includes(saved)) return saved;
  }
  return "dark";
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_lang", lang);
  };

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem("preferred_theme", t);
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  // Apply direction and theme to HTML element
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    }
  }, [theme]);

  // Nested object lookup for dot-separated keys, e.g. "nav.home"
  const t = (key: string): string => {
    const dict = dictionaries[language];
    const parts = key.split(".");
    let current: string | TranslationDict = dict;

    for (const part of parts) {
      if (typeof current !== "string" && current[part] !== undefined) {
        current = current[part];
      } else {
        return key; // Fallback to key if not found
      }
    }

    return typeof current === "string" ? current : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t, theme, setTheme }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
