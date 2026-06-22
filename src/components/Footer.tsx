"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { apiSettings } from "@/utils/api";
import { CompanySettings } from "@/types/api";

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    apiSettings.get().then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 pt-20 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2 flex flex-col space-y-6">
          <Link href="/home" className="flex flex-col items-start justify-center w-fit">
            <Image
              src="/logo.png"
              alt="TEVFIK"
              width={324}
              height={332}
              className="h-8 w-auto object-contain hover:opacity-90 transition-opacity"
            />
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.15em] text-on-surface-variant/70 mt-1 block">
              {t("nav.subtitle")}
            </span>
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
            {t("footer.about")}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-lg text-primary font-medium tracking-wide">
            {t("footer.hours")}
          </h4>
          <p className="text-on-surface-variant/80 text-sm leading-relaxed">
            {t("footer.hoursVal")}
          </p>
          <div className="pt-2 text-on-surface-variant/50 text-xs">
            <p>Milano: Via della Spiga 12</p>
            <p>Istanbul: Bebek Cd. No: 45</p>
          </div>
        </div>

        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-lg text-primary font-medium tracking-wide">
            {t("footer.location")}
          </h4>
          <p className="text-on-surface-variant/80 text-sm">
            {t("footer.gps")}
          </p>
        </div>
      </div>
    </footer>
  );
};
