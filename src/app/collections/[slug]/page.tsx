"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiCollections, apiProducts } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Collection, Product } from "@/types/api";
import { ArrowLeft } from "lucide-react";

export default function CollectionDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const collectionId = parseInt(slug, 10);
  const { language } = useLanguage();

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collectionId || isNaN(collectionId)) return;
    Promise.all([
      apiCollections.getById(collectionId),
      apiProducts.getAll({ collectionId: String(collectionId) }),
    ])
      .then(([col, prods]) => {
        setCollection(col);
        setProducts(prods || []);
      })
      .catch((err) => {
        console.error("Error fetching collection:", err);
      })
      .finally(() => setLoading(false));
  }, [collectionId]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
          <div className="py-24 text-center">
            <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
              Loading collection...
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
          <div className="py-24 text-center glass-panel rounded-lg">
            <span className="text-sm text-on-surface-variant/50 uppercase tracking-widest">
              Collection not found.
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const name = getLocalized(collection, "name", language);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 pt-24 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Back */}
        <div className="pt-12 pb-6">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest text-on-surface-variant/60 hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            <span>{language === "ar" ? "العودة إلى المجموعات" : language === "tr" ? "Koleksiyonlara Geri Dön" : "Back to collections"}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">
            {(products.length || 0)} {language === "ar" ? "قطعة" : language === "tr" ? "parça" : "pieces"}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-on-surface font-bold">
            {name}
          </h1>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="py-24 text-center glass-panel rounded-lg">
            <span className="text-sm text-on-surface-variant/50 uppercase tracking-widest">
              {language === "ar" ? "لا توجد منتجات في هذه المجموعة بعد" : language === "tr" ? "Bu koleksiyonda henüz ürün yok" : "No products in this collection yet."}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/projects/${product.slug}`}
                className="group flex flex-col bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20 shadow-md hover:shadow-lg"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <Image
                    src={product.images[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"}
                    alt={getLocalized(product, "title", language)}
                    fill
                    className="transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-background/80 border border-outline-variant/30 backdrop-blur-md px-3 py-1 rounded text-[10px] tracking-widest text-gold uppercase">
                    {product.subCategory || "Furniture"}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <span className="text-xs text-on-surface-variant/60 tracking-widest uppercase block">
                    {getLocalized(product, "location", language)} &bull; {product.year}
                  </span>
                  <h3 className="font-serif text-xl text-on-surface font-semibold group-hover:text-gold transition-colors">
                    {getLocalized(product, "title", language)}
                  </h3>
                  <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                    {getLocalized(product, "description", language)}
                  </p>
                  <div className="pt-4 mt-auto border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="text-sm text-primary font-semibold tracking-wide">
                      {product.price ? `$${parseFloat(String(product.price)).toLocaleString()}` : "Price upon request"}
                    </span>
                    <span className="inline-flex items-center text-xs tracking-widest uppercase text-gold hover:text-primary font-semibold transition-colors">
                      {language === "ar" ? "عرض التفاصيل" : language === "tr" ? "Detayları Gör" : "View Details"}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                        <path d="M7 17L17 7M17 7H7M17 7V17" />
                      </svg>
                    </span>
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
