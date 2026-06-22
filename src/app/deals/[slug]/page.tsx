"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiDeals } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Deal } from "@/types/api";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const statusColors: Record<string, string> = {
  Completed: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  "In Progress": "bg-amber-500/10 border-amber-500/20 text-amber-400",
  Upcoming: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

export default function DealDetailPage() {
  const { language, t } = useLanguage();
  const params = useParams();
  const slug = params?.slug as string;
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    apiDeals
      .getBySlug(slug)
      .then((data) => setDeal(data))
      .catch((err) => console.error("Error fetching deal:", err))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
          <div className="py-24 text-center">
            <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
              {t("deals.detailLoading")}
            </span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
          <div className="py-24 text-center">
            <span className="text-sm text-on-surface-variant/50 uppercase tracking-widest">
              {t("deals.notFound")}
            </span>
            <Link href="/deals" className="block mt-4 text-xs uppercase tracking-widest text-gold hover:text-primary">
              {t("deals.backToProjects")}
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const products = deal.products?.map((p) => p.product) || [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
          <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
            {deal.coverImage || deal.images[0] ? (
              <Image
                src={deal.coverImage || deal.images[0]}
                alt={getLocalized(deal, "title", language)}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                <span className="text-on-surface-variant/30 text-xs uppercase tracking-widest">{t("deals.imageLabel")}</span>
              </div>
            )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-7xl mx-auto">
            <Link
              href="/deals"
              className="inline-flex items-center text-xs uppercase tracking-widest text-gold hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={14} className="mr-2 rtl:ml-2" />
              {t("deals.backToProjects")}
            </Link>
            <h1 className="font-serif text-4xl md:text-6xl text-on-surface font-bold mb-4">
              {getLocalized(deal, "title", language)}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-on-surface-variant/80">
              {deal.clientName && (
                <span className="font-semibold">{deal.clientName}</span>
              )}
              <span>{deal.year}</span>
              <span className={`text-[10px] tracking-widest uppercase px-3 py-1 rounded border ${statusColors[deal.status] || statusColors.Completed}`}>
                {deal.status}
              </span>
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-24">
          {/* Description */}
          <section className="py-16 border-b border-outline-variant/20">
            <div className="max-w-3xl">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-4">
                {t("deals.projectOverview")}
              </span>
              <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed font-light">
                {getLocalized(deal, "description", language)}
              </p>
            </div>
          </section>

          {/* Gallery */}
          {deal.images.length > 0 && (
            <section className="py-16 border-b border-outline-variant/20">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-8">
                {t("deals.projectGallery")}
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {deal.images.map((img, idx) => (
                  <div key={idx} className={`relative overflow-hidden rounded-lg ${idx === 0 ? "md:col-span-2" : ""}`}>
                    <Image
                      src={img}
                      alt={`${getLocalized(deal, "title", language)} - ${t("deals.imageLabel")} ${idx + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Associated Products */}
          {products.length > 0 && (
            <section className="py-16">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-8">
                {t("deals.featuredProductsLabel")} ({products.length})
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="group flex flex-col bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20 shadow-md hover:shadow-lg"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={getLocalized(product, "title", language)}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                          <span className="text-on-surface-variant/20 text-[10px] uppercase tracking-widest">{t("deals.imageLabel")}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1 space-y-3">
                      <span className="text-[10px] text-on-surface-variant/60 tracking-widest uppercase">
                        {product.subCategory || product.category}
                      </span>
                      <h4 className="font-serif text-lg text-on-surface font-semibold group-hover:text-gold transition-colors">
                        {getLocalized(product, "title", language)}
                      </h4>
                      <div className="pt-3 mt-auto border-t border-outline-variant/30 flex items-center justify-between">
                        <span className="text-xs text-on-surface-variant/60">
                          {getLocalized(product, "location", language)}
                        </span>
                        <Link
                          href={`/projects/${product.slug}`}
                          className="inline-flex items-center text-xs tracking-widest uppercase text-gold hover:text-primary font-semibold transition-colors"
                        >
                          <span>{t("deals.viewProduct")}</span>
                          <ArrowUpRight size={12} className="ml-1 rtl:mr-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
