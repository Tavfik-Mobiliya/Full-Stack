"use client";

import React, { useEffect, useState } from "react";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe, ArrowRight, ArrowLeft } from "lucide-react";

export const WelcomeScreen: React.FC = () => {
  const { language, setLanguage, t, dir } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    // Check if the user has already entered during the current session
    const entered = sessionStorage.getItem("showroom_entered");
    if (!entered) {
      setMounted(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const handleEnter = () => {
    setDismissing(true);
    document.body.style.overflow = "";
    setTimeout(() => {
      setMounted(false);
      sessionStorage.setItem("showroom_entered", "true");
    }, 800); // Matches the duration-800 transition
  };

  if (!mounted) return null;

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "tr", name: "Türkçe" },
  ];

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-between bg-[#070707] text-white transition-all duration-800 ease-in-out select-none ${
        dismissing ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Background Image with Slow Zoom Ambient Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg-70ZBH9uCh-Q7hg84E5AtIta9Ku1C_Q6oD0QsvSBHaIFAwtG7RBkbLHMZ5tPXIoD3nH_ntNJ6tli560FWFoIO9SNW2zkcmfN37YhB__WfSFMrkMZWHj0UoUyS9spuQRRsnQcsPoDN-_dHkZC9DuJn9F-SgWjr60WrAtydVzg8Mz6kYrYiXS-FLD8yZo6-DTwrU_xzuE8uUjQpZ13o_XCTAcF9fJ4XlbA68-d9U_aWtintSc634CA_4_HAWwyzKnhQuyW955Lgd5"
          alt="Luxury Interior Showroom"
          className="w-full h-full object-cover opacity-20 filter blur-[3px] scale-105 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/30 to-black/90" />
      </div>

      {/* Top Header - Language Selection */}
      <header className="w-full max-w-7xl mx-auto px-6 py-8 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-[0.2em] text-white/50 font-light">
          <Globe size={14} className="text-gold" />
          <span>{t("welcome.selectLanguage")}</span>
        </div>
        <div className="flex space-x-2 rtl:space-x-reverse">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`px-4 py-1.5 text-[11px] uppercase tracking-widest rounded transition-all duration-300 font-medium cursor-pointer ${
                language === lang.code
                  ? "border border-gold text-gold bg-gold/10 shadow-[0_0_15px_rgba(242,202,80,0.15)]"
                  : "border border-white/10 text-white/50 hover:border-white/30 hover:text-white"
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main Branding & CTA Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-3xl flex-grow">
        {/* Subtle Radial Glow */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-gold/5 blur-[100px] pointer-events-none" />

        {/* Logo Container */}
        <div className="mb-8 relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-gold/20 to-amber-500/20 rounded-full blur-lg opacity-40 group-hover:opacity-75 transition duration-1000" />
          <img
            src="/logo.png"
            alt="Tevfik Logo"
            className="h-16 w-auto relative object-contain mx-auto transition-transform duration-500 hover:scale-105"
          />
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-widest mb-3 uppercase leading-none drop-shadow-[0_2px_15px_rgba(0,0,0,0.6)]">
          {t("welcome.title")}
        </h1>

        {/* Dynamic separator */}
        <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent my-6" />

        {/* Subtitle */}
        <p className="text-white/80 text-xs sm:text-sm font-sans uppercase tracking-[0.25em] font-light max-w-xl leading-relaxed mb-12">
          {t("welcome.subtitle")}
        </p>

        {/* Call To Action */}
        <button
          onClick={handleEnter}
          className="group relative inline-flex items-center justify-center bg-gold text-black hover:bg-white hover:text-black font-semibold text-xs uppercase tracking-[0.25em] py-5 px-12 rounded transition-all duration-500 hover:shadow-[0_0_30px_rgba(242,202,80,0.3)] hover:-translate-y-0.5 cursor-pointer overflow-hidden"
        >
          {/* Shine effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
          
          <span className="relative flex items-center gap-3">
            {t("welcome.cta")}
            {dir === "rtl" ? (
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            ) : (
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            )}
          </span>
        </button>
      </main>

      {/* Footer Branding */}
      <footer className="w-full py-8 text-center text-[9px] uppercase tracking-[0.2em] text-white/30 relative z-10">
        <span>© 2026 {t("welcome.title")} • {t("nav.subtitle")}</span>
      </footer>
    </div>
  );
};
