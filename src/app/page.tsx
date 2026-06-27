"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage, Language } from "@/context/LanguageContext";
import { Globe, ArrowRight, ArrowLeft } from "lucide-react";

export default function WelcomePage() {
  const { language, setLanguage, t, dir } = useLanguage();
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEnter = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/home");
    }, 800);
  };

  const languages: { code: Language; name: string }[] = [
    { code: "en", name: "English" },
    { code: "ar", name: "العربية" },
    { code: "tr", name: "Türkçe" },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-between bg-[#050505] text-white transition-all duration-1000 ease-in-out select-none overflow-hidden ${isNavigating ? "opacity-0 scale-102 pointer-events-none" : "opacity-100"
        }`}
    >
      {/* Background Video showing luxury interior design */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="object-cover w-full h-full opacity-55 scale-105 transition-transform duration-1000"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>
        {/* Modern subtle gradient map to preserve text contrast while showing the video */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/75 via-[#050505]/25 to-[#050505]/85" />
      </div>

      {/* Top Header - Language Selection */}
      <header
        className={`w-full max-w-7xl mx-auto px-8 py-8 relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all duration-1000 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
      >
        <div className="flex items-center space-x-3 rtl:space-x-reverse text-[11px] uppercase tracking-[0.25em] text-white/40 font-light">
          <Globe size={13} className="text-gold animate-pulse" />
          <span>{t("welcome.selectLanguage")}</span>
        </div>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className={`text-[11px] uppercase tracking-[0.2em] transition-all duration-300 relative py-1 cursor-pointer ${language === lang.code
                  ? "text-gold font-medium"
                  : "text-white/40 hover:text-white"
                }`}
            >
              {lang.name}
              {language === lang.code && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-gold rounded-full" />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* Main Branding & CTA Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-4xl flex-grow">
        {/* Subtle Radial Glow */}
        <div className="absolute w-[500px] h-[500px] rounded-full bg-gold/5 blur-[120px] pointer-events-none -translate-y-12" />

        {/* Logo Container */}
        <div
          className={`mb-0 relative group transition-all duration-1000 delay-100 ${isMounted ? "opacity-100 scale-100" : "opacity-0 scale-95"
            }`}
        >
          <div className="absolute -inset-3 bg-gradient-to-r from-gold/10 to-amber-500/10 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition duration-1000" />
          <Image
            src="/logo1.png"
            alt="Tevfik Logo Icon"
            width={120}
            height={60}
            className="object-contain mx-auto transition-transform duration-700 hover:scale-105"
            priority
          />
        </div>

        {/* Name of the Platform */}
        <div
          className={`flex flex-col items-center justify-center transition-all duration-1000 delay-200 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
        >
          <Image
            src="/logo.png"
            alt="TEVFIK"
            width={600}
            height={400}
            className="object-contain mx-auto filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            priority
          />
          <span className="block mt-8 text-xs md:text-sm tracking-[0.35em] text-gold font-light">
            {t("welcome.tagline")}
          </span>
        </div>

        {/* Modern Divider */}
        <div
          className={`w-12 h-[1px] bg-gold/40 my-6 transition-all duration-1000 delay-300 ${isMounted ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
            }`}
        />

        {/* Subtitle & CTA Button Block */}
        <div
          className={`flex flex-col items-center gap-6 transition-all duration-1000 delay-400 ${isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          <button
            onClick={handleEnter}
            className="group relative inline-flex items-center justify-center border border-gold/30 bg-black/40 backdrop-blur-md text-gold hover:bg-gold hover:text-black font-medium text-xs uppercase tracking-[0.3em] py-4 px-12 rounded-sm transition-all duration-700 hover:shadow-[0_0_35px_rgba(242,202,80,0.25)] hover:-translate-y-0.5 cursor-pointer overflow-hidden mt-2"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />

            <span className="relative flex items-center gap-3">
              {t("welcome.cta")}
              {dir === "rtl" ? (
                <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-1.5" />
              ) : (
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1.5" />
              )}
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
