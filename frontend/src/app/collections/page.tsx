"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiProjects } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { SlidersHorizontal, Search, ArrowUpRight, RotateCcw } from "lucide-react";

export default function CollectionsPage() {
  const { language, t } = useLanguage();
  const [pieces, setPieces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [material, setMaterial] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");

  const fetchFilteredPieces = () => {
    setLoading(true);
    apiProjects
      .getAll({
        category: "Furniture",
        search: search || undefined,
        subCategory: subCategory || undefined,
        material: material || undefined,
        priceMin: priceMin || undefined,
        priceMax: priceMax || undefined,
      })
      .then((data) => {
        setPieces(data);
      })
      .catch((err) => console.error("Error fetching furniture collections:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFilteredPieces();
  }, [subCategory, material]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFilteredPieces();
  };

  const handleReset = () => {
    setSearch("");
    setSubCategory("");
    setMaterial("");
    setPriceMin("");
    setPriceMax("");
    setLoading(true);
    apiProjects
      .getAll({ category: "Furniture" })
      .then((data) => setPieces(data))
      .catch((err) => console.error("Error resetting collections:", err))
      .finally(() => setLoading(false));
  };

  const subCategories = ["Table", "Chair", "Cabinet"];
  const materials = ["Marble", "Velvet", "Walnut", "Brass", "Steel"];

  return (
    <div className="flex flex-col min-h-screen bg-ink-black text-silver">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Header Title */}
        <div className="mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2 animate-fade-in-up">
            COLLECTIBLE DESIGNS
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-champagne font-bold animate-fade-in-up">
            {t("nav.collections")}
          </h1>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-6 rounded-lg mb-12 flex flex-col lg:flex-row gap-6 items-stretch lg:items-center justify-between">
          {/* Text Search */}
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

          {/* Selector Dropdowns & Price range */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Sub-Category */}
            <select
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-xs uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
            >
              <option value="">Category</option>
              {subCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-deep-charcoal text-silver">
                  {cat}s
                </option>
              ))}
            </select>

            {/* Material */}
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-xs uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
            >
              <option value="">Material</option>
              {materials.map((mat) => (
                <option key={mat} value={mat} className="bg-deep-charcoal text-silver">
                  {mat}
                </option>
              ))}
            </select>

            {/* Price Filter inputs */}
            <div className="flex items-center space-x-2 rtl:space-x-reverse bg-ink-black/40 border border-silver/10 rounded px-2">
              <input
                type="number"
                placeholder="Min ($)"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-16 bg-transparent text-silver text-xs py-2 px-1 focus:outline-none"
              />
              <span className="text-silver/20 text-xs">|</span>
              <input
                type="number"
                placeholder="Max ($)"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-16 bg-transparent text-silver text-xs py-2 px-1 focus:outline-none"
              />
              <button
                onClick={fetchFilteredPieces}
                className="text-gold hover:text-champagne p-1 text-xs"
              >
                Go
              </button>
            </div>

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
              Curating pieces collections...
            </span>
          </div>
        ) : pieces.length === 0 ? (
          <div className="py-24 text-center glass-panel rounded-lg">
            <span className="text-sm text-silver/50 uppercase tracking-widest">
              No matching pieces found in the catalog.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pieces.map((piece) => (
              <div
                key={piece.id}
                className="group flex flex-col bg-deep-charcoal border border-silver/5 rounded-lg overflow-hidden transition-all duration-300 hover:border-gold/20"
              >
                <div className="relative aspect-square w-full overflow-hidden">
                  <img
                    src={piece.images[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800"}
                    alt={getLocalized(piece, "title", language)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60" />
                  <div className="absolute top-4 left-4 bg-ink-black/60 backdrop-blur-md px-3 py-1 rounded text-[10px] tracking-widest text-gold uppercase">
                    {piece.subCategory || "Furniture"}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-4">
                  <span className="text-xs text-silver/45 tracking-widest uppercase block">
                    {getLocalized(piece, "location", language)} &bull; {piece.year}
                  </span>
                  <h3 className="font-serif text-xl text-champagne font-semibold group-hover:text-gold transition-colors">
                    {getLocalized(piece, "title", language)}
                  </h3>
                  <p className="text-sm text-silver/70 line-clamp-2 leading-relaxed">
                    {getLocalized(piece, "description", language)}
                  </p>
                  <div className="pt-4 mt-auto border-t border-silver/5 flex items-center justify-between">
                    <span className="text-sm text-gold font-semibold tracking-wide">
                      {piece.price ? `$${parseFloat(piece.price).toLocaleString()}` : "Price upon request"}
                    </span>
                    <Link
                      href={`/projects/${piece.slug}`}
                      className="inline-flex items-center text-xs tracking-widest uppercase text-gold hover:text-champagne font-semibold transition-colors"
                    >
                      <span>VIEW PIECE</span>
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
