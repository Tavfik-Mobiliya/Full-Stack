"use client";

import React, { useEffect, useState, startTransition, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiProducts } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Product } from "@/types/api";
import { Search, ArrowUpRight, RotateCcw } from "lucide-react";

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");

  const fetchFilteredProjects = useCallback(() => {
    setLoading(true);
      apiProducts
        .getAll({
          search: search || undefined,
          roomType: roomType || undefined,
        })
      .then((data) => {
        setProjects(data || []);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  }, [search, roomType]);

  useEffect(() => {
    startTransition(() => {
      fetchFilteredProjects();
    });
  }, [fetchFilteredProjects]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredProjects();
  };

  const handleReset = () => {
    setSearch("");
    setRoomType("");

    // We need to fetch all since we reset states
    setLoading(true);
    apiProducts
      .getAll({})
      .then((data) => setProjects(data || []))
      .catch((err) => {
        console.error("Error resetting products:", err);
        setProjects([]);
      })
      .finally(() => setLoading(false));
  };

  const roomTypes = [
    { value: "Living Room", labelKey: "projects.roomTypes.livingRoom" },
    { value: "Bedroom", labelKey: "projects.roomTypes.bedroom" },
    { value: "Kitchen", labelKey: "projects.roomTypes.kitchen" },
  ];
  const styles = [
    { value: "Monolithic Minimalist", labelKey: "projects.styles.monolithicMinimalist" },
    { value: "Nocturnal Luxury", labelKey: "projects.styles.nocturnalLuxury" },
    { value: "Coastal Minimalism", labelKey: "projects.styles.coastalMinimalism" },
    { value: "Contemporary Monolithic", labelKey: "projects.styles.contemporaryMonolithic" },
  ];
  const budgets = [
    { value: "Premium", labelKey: "projects.budgets.premium" },
    { value: "Ultra-Luxury", labelKey: "projects.budgets.ultraLuxury" },
    { value: "Bespoke", labelKey: "projects.budgets.bespoke" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="mb-0">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2 animate-fade-in-up">
            {t("projects.galleryLabel")}
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-on-surface font-bold animate-fade-in-up">
            {t("nav.projects")}
          </h1>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 py-9 border-y border-outline-variant/20 mb-8 text-center animate-fade-in-up">
          <div className="flex flex-col items-center">
            <span className="font-serif text-4xl md:text-5xl font-semibold text-gold mb-2 tracking-tight">
              140+
            </span>
            <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant/75 font-medium px-4">
              {t("stats.projects")}
            </span>
          </div>
          <div className="flex flex-col items-center md:border-l md:border-outline-variant/20 md:rtl:border-l-0 md:rtl:border-r">
            <span className="font-serif text-4xl md:text-5xl font-semibold text-gold mb-2 tracking-tight">
              12
            </span>
            <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant/75 font-medium px-4">
              {t("stats.awards")}
            </span>
          </div>
          <div className="flex flex-col items-center md:border-l md:border-outline-variant/20 md:rtl:border-l-0 md:rtl:border-r">
            <span className="font-serif text-4xl md:text-5xl font-semibold text-gold mb-2 tracking-tight">
              8
            </span>
            <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant/75 font-medium px-4">
              {t("stats.studios")}
            </span>
          </div>
          <div className="flex flex-col items-center md:border-l md:border-outline-variant/20 md:rtl:border-l-0 md:rtl:border-r">
            <span className="font-serif text-4xl md:text-5xl font-semibold text-gold mb-2 tracking-tight">
              24
            </span>
            <span className="text-[10px] md:text-[11px] uppercase tracking-widest text-on-surface-variant/75 font-medium px-4">
              {t("stats.artistry")}
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-3 rounded-lg mb-12 flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
            <input
              type="text"
              placeholder={t("filters.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-l px-4 py-3 pl-10 rtl:pl-4 rtl:pr-10 text-on-surface text-sm focus:outline-none focus:border-gold transition-all"
            />
            <Search size={16} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 text-on-surface-variant/40" />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded-r transition-colors"
            >
              {t("projects.searchButton")}
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            {/* Room Type */}
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface text-xs uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
            >
              <option value="">{t("projects.roomTypePlaceholder")}</option>
              {roomTypes.map((type) => (
                  <option key={type.value} value={type.value} className="bg-surface text-on-surface">
                    {t(type.labelKey)}
                  </option>
                ))}
            </select>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs uppercase tracking-widest text-on-surface-variant/70 hover:text-gold transition-colors py-3 px-4 rounded border border-outline-variant hover:border-gold/20"
            >
              <RotateCcw size={12} />
              <span>{t("projects.resetButton")}</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
              {t("projects.loading")}
            </span>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center glass-panel rounded-lg">
            <span className="text-sm text-on-surface-variant/50 uppercase tracking-widest">
              {t("projects.empty")}
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group flex flex-col bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20 shadow-md hover:shadow-lg"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  {project.images[0] ? (
                    <Image
                      src={project.images[0]}
                      alt={getLocalized(project, "title", language)}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                      <span className="text-on-surface-variant/20 text-[10px] uppercase tracking-widest">{t("deals.imageLabel")}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-background/80 border border-outline-variant/30 backdrop-blur-md px-3 py-1 rounded text-[10px] tracking-widest text-gold uppercase">
                    {project.subCategory || t("projects.fallbackSubCategory")}
                  </div>
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded text-[10px] tracking-widest uppercase font-semibold ${
                    project.category === "Interior"
                      ? "bg-gold/15 text-gold border border-gold/30"
                      : "bg-primary/15 text-primary border border-primary/30"
                  }`}>
                    {project.category === "Interior"
                      ? t("projects.categories.interior")
                      : t("projects.categories.furniture")}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <span className="text-xs text-on-surface-variant/60 tracking-widest uppercase block">
                    {getLocalized(project, "location", language)} &bull; {project.year}
                  </span>
                  <h3 className="font-serif text-xl text-on-surface font-semibold group-hover:text-gold transition-colors">
                    {getLocalized(project, "title", language)}
                  </h3>
                  <p className="text-sm text-on-surface-variant/80 line-clamp-2 leading-relaxed">
                    {getLocalized(project, "description", language)}
                  </p>
                  <div className="pt-4 mt-auto border-t border-outline-variant/30 flex items-center justify-between">
                    <span className="text-xs tracking-widest text-on-surface-variant/60 uppercase">
                      {project.budget || t("projects.fallbackBudget")}
                    </span>
                    <span className="inline-flex items-center text-xs tracking-widest uppercase text-gold hover:text-primary font-semibold transition-colors cursor-pointer">
                      {t("projects.exploreDetails")}
                      <ArrowUpRight size={14} className="ml-1 rtl:mr-1" />
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
