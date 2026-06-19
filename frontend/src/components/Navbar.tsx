"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe, Menu, X, ChevronDown, Sun, Moon } from "lucide-react";

export const Navbar: React.FC = () => {
  const { language, setLanguage, t, dir, theme, setTheme } = useLanguage();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on path change
  useEffect(() => {
    setMobileMenuOpen(false);
    setLangDropdownOpen(false);
  }, [pathname]);

  const navItems = [
    { name: t("nav.projects"), path: "/projects" },
    { name: t("nav.collections"), path: "/collections" },
    { name: t("nav.about"), path: "/about" },
  ];

  const languages = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "tr", name: "Türkçe" },
  ];

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "glass-panel py-4 shadow-lg"
          : "bg-transparent py-6 border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex flex-col">
          <span className="font-serif text-2xl font-semibold tracking-wider text-on-surface hover:text-gold transition-colors">
            AURA
          </span>
          <span className="text-[9px] uppercase tracking-[0.25em] text-on-surface-variant/60">
            Atelier of Space
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm uppercase tracking-widest font-medium transition-colors hover:text-gold ${
                  isActive ? "text-gold border-b border-gold" : "text-on-surface-variant"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right side: Language selection & Mobile menu trigger */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          {/* Theme Toggler */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 text-on-surface-variant hover:text-gold transition-colors focus:outline-none cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center space-x-2 text-on-surface-variant hover:text-gold text-xs uppercase tracking-widest transition-colors py-2 px-3 rounded border border-outline-variant/30 hover:border-gold/30 bg-surface-container-low/50"
            >
              <Globe size={14} className="text-gold" />
              <span>{languages.find((l) => l.code === language)?.name}</span>
              <ChevronDown size={12} className="opacity-60" />
            </button>

            {langDropdownOpen && (
              <div
                className={`absolute mt-2 w-36 glass-panel rounded shadow-xl py-1 text-sm ${
                  dir === "rtl" ? "left-0" : "right-0"
                }`}
              >
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as Language);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-start px-4 py-2 hover:bg-gold/10 hover:text-gold transition-colors ${
                      language === lang.code ? "text-gold font-medium" : "text-on-surface-variant"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-gold focus:outline-none"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[72px] z-40 bg-background/95 backdrop-blur-md md:hidden flex flex-col px-8 py-12 animate-fade-in-up border-t border-outline-variant/20">
          <div className="flex flex-col space-y-6">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xl uppercase tracking-widest font-serif transition-colors py-2 ${
                    isActive ? "text-gold border-b border-gold/30" : "text-on-surface-variant"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-auto border-t border-outline-variant/20 pt-8 flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-widest text-on-surface-variant/40">Select Language</span>
            <div className="flex flex-wrap gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as Language);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-2 text-xs uppercase tracking-widest rounded border transition-all ${
                    language === lang.code
                      ? "border-gold text-gold bg-gold/5"
                      : "border-outline-variant/30 text-on-surface-variant hover:border-gold/30"
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
