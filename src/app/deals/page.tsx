"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiDeals } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Deal } from "@/types/api";
import { ArrowUpRight } from "lucide-react";

const statusColors: Record<string, string> = {
  Completed: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
  "In Progress": "bg-amber-500/10 border-amber-500/20 text-amber-400",
  Upcoming: "bg-blue-500/10 border-blue-500/20 text-blue-400",
};

export default function DealsPage() {
  const { language, t } = useLanguage();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiDeals
      .getAll()
      .then((data) => setDeals(data))
      .catch((err) => console.error("Error fetching deals:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2 animate-fade-in-up">
            FEATURED PROJECTS
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-on-surface font-bold animate-fade-in-up">
            {t("nav.projectsDeals")}
          </h1>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
              Curating project gallery...
            </span>
          </div>
        ) : deals.length === 0 ? (
          <div className="py-24 text-center glass-panel rounded-lg">
            <span className="text-sm text-on-surface-variant/50 uppercase tracking-widest">
              No projects available yet.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="group flex flex-col bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20 shadow-md hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={deal.coverImage || deal.images[0] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"}
                    alt={getLocalized(deal, "title", language)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60" />
                  <div className={`absolute top-4 left-4 text-[10px] tracking-widest uppercase px-3 py-1 rounded border ${statusColors[deal.status] || statusColors.Completed}`}>
                    {deal.status}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <span className="text-xs text-on-surface-variant/60 tracking-widest uppercase block">
                    {deal.clientName && <>{deal.clientName} &bull; </>}
                    {deal.year}
                  </span>
                  <h3 className="font-serif text-xl text-on-surface font-semibold group-hover:text-gold transition-colors">
                    {getLocalized(deal, "title", language)}
                  </h3>
                  <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                    {getLocalized(deal, "description", language)}
                  </p>
                  <div className="pt-4 mt-auto border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="text-xs tracking-widest text-on-surface-variant/60 uppercase">
                      {deal.products?.length || 0} {deal.products?.length === 1 ? "Product" : "Products"}
                    </span>
                    <Link
                      href={`/deals/${deal.slug}`}
                      className="inline-flex items-center text-xs tracking-widest uppercase text-gold hover:text-primary font-semibold transition-colors"
                    >
                      <span>VIEW PROJECT</span>
                      <ArrowUpRight size={14} className="ml-1 rtl:mr-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
