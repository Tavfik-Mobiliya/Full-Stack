"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import en from "../locales/en.json";
import ar from "../locales/ar.json";
import tr from "../locales/tr.json";

export type Language = "en" | "ar" | "tr";
export type Theme = "light" | "dark";

const dictionaries: Record<Language, any> = { en, ar, tr };

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: "ltr" | "rtl";
  t: (key: string) => string;
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [theme, setThemeState] = useState<Theme>("dark"); // Default to dark luxury theme

  useEffect(() => {
    // Load language preference from localStorage if available
    const savedLang = localStorage.getItem("preferred_lang") as Language;
    if (savedLang && ["en", "ar", "tr"].includes(savedLang)) {
      setLanguageState(savedLang);
    }

    // Load theme preference from localStorage if available
    const savedTheme = localStorage.getItem("preferred_theme") as Theme;
    if (savedTheme && ["light", "dark"].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

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
    let current = dict;

    for (const part of parts) {
      if (current && current[part] !== undefined) {
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
