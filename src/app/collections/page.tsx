"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiCollections } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Collection } from "@/types/api";

export default function CollectionsPage() {
  const { language } = useLanguage();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiCollections
      .getAll()
      .then((data) => {
        setCollections(data || []);
      })
      .catch((err) => {
        console.error("Error fetching collections:", err);
        setCollections([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2 animate-fade-in-up">
            COLLECTIBLE DESIGNS
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-on-surface font-bold animate-fade-in-up">
            {language === "ar" ? "المجموعات" : language === "tr" ? "Koleksiyonlar" : "Collections"}
          </h1>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
              Curating collections...
            </span>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-24 text-center glass-panel rounded-lg">
            <span className="text-sm text-on-surface-variant/50 uppercase tracking-widest">
              No collections available yet.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.id}`}
                className="group flex flex-col bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20 shadow-md hover:shadow-lg"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={col.products?.[0]?.images?.[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"}
                    alt={getLocalized(col, "name", language)}
                    fill
                    className="transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-background/80 border border-outline-variant/30 backdrop-blur-md px-3 py-1 rounded text-[10px] tracking-widest text-gold uppercase">
                    {(col.products?.length || 0)} {language === "ar" ? "قطعة" : language === "tr" ? "parça" : "pieces"}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-serif text-xl text-on-surface font-semibold group-hover:text-gold transition-colors">
                    {getLocalized(col, "name", language)}
                  </h3>
                  <div className="pt-4 mt-auto border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="text-xs tracking-widest uppercase text-gold hover:text-primary font-semibold transition-colors">
                      {language === "ar" ? "عرض المجموعة" : language === "tr" ? "Koleksiyonu Gör" : "View Collection"}
                    </span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gold">
                      <path d="M7 17L17 7M17 7H7M17 7V17" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
