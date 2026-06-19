"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const translations = {
  en: {
    title: "An Unexpected Error Occurred",
    subtitle: "We apologize for the inconvenience. Our digital showroom encountered an unexpected spatial anomaly.",
    resetBtn: "Try Again",
    homeBtn: "Go Home",
    digestText: "Error Signature:"
  },
  ar: {
    title: "حدث خطأ غير متوقع",
    subtitle: "نعتذر عن الإزعاج. واجه صالون العرض الرقمي لدينا مشكلة فنية غير متوقعة.",
    resetBtn: "إعادة المحاولة",
    homeBtn: "الرئيسية",
    digestText: "بصمة الخطأ:"
  },
  tr: {
    title: "Beklenmedik Bir Hata Oluştu",
    subtitle: "Özür dileriz. Dijital showroomumuz beklenmedik bir teknik hata ile karşılaştı.",
    resetBtn: "Tekrar Dene",
    homeBtn: "Ana Sayfaya Git",
    digestText: "Hata Kodu:"
  }
};

export default function ErrorPage({ error, reset }: ErrorProps) {
  const { language } = useLanguage();
  const lang = (language === "ar" || language === "tr") ? language : "en";
  const t = translations[lang];

  useEffect(() => {
    // Log the error to console or error tracker
    console.error("Showroom error boundary triggered:", error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-8 md:p-12 rounded-2xl border border-outline-variant/30 flex flex-col items-center text-center space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Subtle decorative glow effects */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Elegant Gold Alert Icon */}
        <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold animate-pulse">
          <AlertTriangle size={32} />
        </div>

        {/* Error Text Details */}
        <div className="space-y-3">
          <h1 className="font-serif text-2xl md:text-3xl font-semibold text-on-surface leading-tight">
            {t.title}
          </h1>
          <p className="text-on-surface-variant/80 text-sm leading-relaxed font-light font-sans">
            {t.subtitle}
          </p>
        </div>

        {/* Digest Info Code if present */}
        {error.digest && (
          <div className="w-full bg-surface-container-low/50 border border-outline-variant/20 rounded p-3 text-[10px] text-on-surface-variant/60 font-mono select-all">
            <span className="font-semibold block mb-1 uppercase tracking-wider">{t.digestText}</span>
            {error.digest}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-primary hover:bg-primary/90 text-on-primary py-3.5 px-6 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all shadow-md active:scale-[0.98]"
          >
            <RefreshCw size={14} className="animate-spin" style={{ animationDuration: "3s" }} />
            <span>{t.resetBtn}</span>
          </button>
          
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant text-on-surface py-3.5 px-6 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all active:scale-[0.98]"
          >
            <Home size={14} />
            <span>{t.homeBtn}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
