"use client";

import React, { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

const loadingPhrases = {
  en: [
    "Curating your architectural vision...",
    "Sculpting light and shadow...",
    "Defining timeless elegance...",
    "Crafting bespoke environments...",
    "Harmonizing space and form..."
  ],
  ar: [
    "تنسيق رؤيتك المعمارية...",
    "نحت الضوء والظل...",
    "تحديد الأناقة الخالدة...",
    "صياغة بيئات مخصصة...",
    "تناغم المساحة والشكل..."
  ],
  tr: [
    "Mimari vizyonunuzu kürate ediyoruz...",
    "Işığı ve gölgeyi şekillendiriyoruz...",
    "Zamansız zarafeti tanımlıyoruz...",
    "Özel mekanlar tasarlıyoruz...",
    "Boşluk ve formu uyumlulaştırıyoruz..."
  ]
};

export default function LoadingPage() {
  const { language } = useLanguage();
  const lang = (language === "ar" || language === "tr") ? language : "en";
  const phrases = loadingPhrases[lang];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
        setFade(true);
      }, 500); // Wait for fade-out to complete
    }, 3500);

    return () => clearInterval(interval);
  }, [phrases.length]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const amount = 15; // Max displacement in pixels
      const x = (e.clientX / window.innerWidth - 0.5) * amount;
      const y = (e.clientY / window.innerHeight - 0.5) * amount;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-on-surface overflow-hidden select-none transition-colors duration-500"
    >
      {/* Decorative Background Glows */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none transition-transform duration-700"
        style={{
          transform: `translate(${mousePos.x * -0.8}px, ${mousePos.y * -0.8}px)`,
          top: "-15%",
          left: "-15%",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-gold/5 blur-[120px] pointer-events-none transition-transform duration-700"
        style={{
          transform: `translate(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px)`,
          bottom: "-15%",
          right: "-15%",
        }}
      />

      {/* Main Loading Box */}
      <div className="relative z-10 flex flex-col items-center gap-10 text-center max-w-lg px-6">
        
        {/* Golden Loader Ring */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          }}
        >
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-gold/15 blur-2xl rounded-full scale-90" />
          
          {/* Logo */}
          <Image
            src="/logo1.png"
            alt="Tevfik Logo Icon"
            width={200}
            height={120}
            className="object-contain mx-auto mb-4"
            priority
          />

        </div>

        {/* Identity & Subtitles */}
        <div className="space-y-4">
          <h1 className="font-serif text-3xl md:text-4xl tracking-[0.25em] text-on-surface uppercase select-none font-medium">
            Tevfik Mobilya
          </h1>
          
          <div className="h-6 overflow-hidden flex items-center justify-center">
            <p
              className={`text-on-surface-variant/70 text-xs tracking-widest italic font-light transition-all duration-500 ease-in-out transform ${
                fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
            >
              {phrases[phraseIndex]}
            </p>
          </div>
        </div>

        {/* Vertical divider line */}
        <div className="w-px h-12 bg-gradient-to-b from-gold/40 to-transparent mt-4" />
      </div>

      {/* Decorative Layout Frame Elements */}
      <div className="fixed top-12 left-12 border-l border-t border-outline-variant/40 w-12 h-12 hidden md:block" />
      <div className="fixed top-12 right-12 border-r border-t border-outline-variant/40 w-12 h-12 hidden md:block" />
      <div className="fixed bottom-12 left-12 border-l border-b border-outline-variant/40 w-12 h-12 hidden md:block" />
      <div className="fixed bottom-12 right-12 border-r border-b border-outline-variant/40 w-12 h-12 hidden md:block" />

      {/* Footer established watermark */}
      <div className="fixed bottom-8 w-full text-center px-6">
        <p className="text-[10px] text-on-surface-variant/50 tracking-[0.3em] uppercase">
          Established MMXXIV — Architectural Excellence
        </p>
      </div>
    </div>
  );
}
