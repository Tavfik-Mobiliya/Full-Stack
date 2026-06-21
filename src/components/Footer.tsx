"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 pt-20 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand Information */}
        <div className="md:col-span-2 flex flex-col space-y-6">
          <Link href="/" className="flex items-center w-fit">
            <Image 
              src="/logo.png" 
              alt="TEVFIK" 
              width={32}
              height={32}
              className="object-contain hover:opacity-90 transition-opacity"
            />
          </Link>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
            {t("footer.about")}
          </p>
        </div>

        {/* Studio Locations / Hours */}
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

        {/* Contact info & Socials */}
        <div className="flex flex-col space-y-4">
          <h4 className="font-serif text-lg text-primary font-medium tracking-wide">
            {t("footer.contact")}
          </h4>
          <ul className="text-on-surface-variant/80 text-sm space-y-2">
            <li>
              <a href="mailto:concierge@aura-interiors.com" className="hover:text-gold transition-colors">
                concierge@aura-interiors.com
              </a>
            </li>
            <li>
              <a href="tel:+905551234567" className="hover:text-gold transition-colors">
                +90 (555) 123 45 67
              </a>
            </li>
          </ul>

          <div className="flex space-x-4 rtl:space-x-reverse pt-4">
            {["Instagram", "Pinterest", "LinkedIn"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-xs uppercase tracking-widest text-on-surface-variant/60 hover:text-primary transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-outline-variant/20 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-on-surface-variant/55 space-y-4 md:space-y-0">
        <p>
          &copy; {new Date().getFullYear()} TEVFIK. {t("footer.rights")}
        </p>
        <div className="flex space-x-6 rtl:space-x-reverse">
          <Link href="/privacy" className="hover:text-gold transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gold transition-colors">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
};
