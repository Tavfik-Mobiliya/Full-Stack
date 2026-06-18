"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiProjects } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { SlidersHorizontal, Search, ArrowUpRight, RotateCcw } from "lucide-react";

export default function ProjectsPage() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [roomType, setRoomType] = useState("");
  const [style, setStyle] = useState("");
  const [budget, setBudget] = useState("");

  const fetchFilteredProjects = () => {
    setLoading(true);
    apiProjects
      .getAll({
        category: "Interior",
        search: search || undefined,
        roomType: roomType || undefined,
        style: style || undefined,
        budget: budget || undefined,
      })
      .then((data) => {
        setProjects(data);
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFilteredProjects();
  }, [roomType, style, budget]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredProjects();
  };

  const handleReset = () => {
    setSearch("");
    setRoomType("");
    setStyle("");
    setBudget("");
    // We need to fetch all since we reset states
    setLoading(true);
    apiProjects
      .getAll({ category: "Interior" })
      .then((data) => setProjects(data))
      .catch((err) => console.error("Error resetting projects:", err))
      .finally(() => setLoading(false));
  };

  const roomTypes = ["Living Room", "Bedroom", "Kitchen"];
  const styles = ["Monolithic Minimalist", "Nocturnal Luxury", "Coastal Minimalism", "Contemporary Monolithic"];
  const budgets = ["Premium", "Ultra-Luxury", "Bespoke"];

  return (
    <div className="flex flex-col min-h-screen bg-ink-black text-silver">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2 animate-fade-in-up">
            ARCHITECTURAL GALLERY
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-champagne font-bold animate-fade-in-up">
            {t("nav.projects")}
          </h1>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-6 rounded-lg mb-12 flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
            <input
              type="text"
              placeholder={t("filters.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-ink-black/40 border border-silver/10 rounded-l px-4 py-3 pl-10 rtl:pl-4 rtl:pr-10 text-silver text-sm focus:outline-none focus:border-gold transition-all"
            />
            <Search size={16} className="absolute left-3.5 rtl:left-auto rtl:right-3.5 text-silver/40" />
            <button
              type="submit"
              className="bg-gold hover:bg-gold/90 text-ink-black px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded-r transition-colors"
            >
              Search
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-4">
            {/* Room Type */}
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-xs uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
            >
              <option value="">Room Type</option>
              {roomTypes.map((type) => (
                <option key={type} value={type} className="bg-deep-charcoal text-silver">
                  {type}
                </option>
              ))}
            </select>

            {/* Style */}
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-xs uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
            >
              <option value="">Aesthetic Style</option>
              {styles.map((s) => (
                <option key={s} value={s} className="bg-deep-charcoal text-silver">
                  {s}
                </option>
              ))}
            </select>

            {/* Budget */}
            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-xs uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
            >
              <option value="">Budget Scale</option>
              {budgets.map((b) => (
                <option key={b} value={b} className="bg-deep-charcoal text-silver">
                  {b}
                </option>
              ))}
            </select>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1 rtl:space-x-reverse text-xs uppercase tracking-widest text-silver/50 hover:text-gold transition-colors py-3 px-4 rounded border border-silver/10 hover:border-gold/20"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
              Curating gallery collection...
            </span>
          </div>
        ) : projects.length === 0 ? (
          <div className="py-24 text-center glass-panel rounded-lg">
            <span className="text-sm text-silver/50 uppercase tracking-widest">
              No matching masterpieces found.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group flex flex-col bg-deep-charcoal border border-silver/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20"
              >
                <div className="relative aspect-video w-full overflow-hidden">
                  <img
                    src={project.images[0] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"}
                    alt={getLocalized(project, "title", language)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-ink-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] tracking-widest text-gold uppercase">
                    {project.subCategory || "Residential"}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <span className="text-xs text-silver/45 tracking-widest uppercase block">
                    {getLocalized(project, "location", language)} &bull; {project.year}
                  </span>
                  <h3 className="font-serif text-xl text-champagne font-semibold group-hover:text-gold transition-colors">
                    {getLocalized(project, "title", language)}
                  </h3>
                  <p className="text-sm text-silver/70 line-clamp-2 leading-relaxed">
                    {getLocalized(project, "description", language)}
                  </p>
                  <div className="pt-4 mt-auto border-t border-silver/5 flex items-center justify-between">
                    <span className="text-xs tracking-widest text-silver/50 uppercase">
                      {project.budget || "Bespoke"}
                    </span>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center text-xs tracking-widest uppercase text-gold hover:text-champagne font-semibold transition-colors"
                    >
                      <span>EXPLORE DETAILS</span>
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
