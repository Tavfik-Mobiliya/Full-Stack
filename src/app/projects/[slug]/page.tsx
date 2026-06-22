"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BeforeAfter } from "@/components/BeforeAfter";
import { useLanguage } from "@/context/LanguageContext";
import { apiProducts, apiInquiries } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Product } from "@/types/api";
import { ArrowLeft, Send } from "lucide-react";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { language, t } = useLanguage();
  const [project, setProject] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // Inquiry form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    apiProducts
      .getBySlug(slug)
      .then((data) => {
        if (cancelled) return;
        setProject(data);
        if (data) {
          const pTitle = getLocalized(data, "title", language);
          setMessage(`Hello Aura, I am interested in inquiring about "${pTitle}". Please provide me with more information.`);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Error fetching product details:", err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [slug, language]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      await apiInquiries.submit({
        name,
        email,
        message,
        type: "Catalog",
        details: { projectSlug: slug, projectName: project?.titleEn || "" },
      });
      setSuccess(t("concierge.success"));
      setName("");
      setEmail("");
    } catch {
      setError(t("concierge.error"));
    } finally {
      setSubmitting(false);
    }
  };


  const getSpecValue = (key: string, fallback: string): string => {
    if (!project || !project.specs) return fallback;
    const specsRecord = project.specs as Record<string, unknown>;
    const foundKey = Object.keys(specsRecord).find((k) => k.toLowerCase() === key.toLowerCase());
    if (foundKey) {
      const value = specsRecord[foundKey];
      return typeof value === "string" ? value : fallback;
    }
    return fallback;
  };

  const scrollToInquiry = () => {
    const inquirySec = document.getElementById("inquiry-section");
    if (inquirySec) {
      inquirySec.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
            {t("project.loading")}
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <span className="text-sm uppercase tracking-widest text-on-surface-variant/50">
            {t("project.notFound")}
          </span>
          <Link href="/projects" className="text-xs uppercase tracking-widest text-gold border-b border-gold">
            {t("project.returnToGallery")}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const title = getLocalized(project, "title", language);
  const description = getLocalized(project, "description", language);
  const location = getLocalized(project, "location", language);
  const material = getLocalized(project, "material", language);
  const style = getLocalized(project, "style", language);
  const galleryImages = project && project.images ? project.images.slice(1) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      {/* Hero Header */}
      <header className="relative h-[80vh] w-full overflow-hidden flex items-end">
              <div className="absolute inset-0 z-0">
                {project.images && project.images[0] ? (
                  <Image
                    src={project.images[0]}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-[2s] hover:scale-105"
                    sizes="100vw"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-surface-container-low flex items-center justify-center">
                    <span className="text-on-surface-variant/20 text-[10px] uppercase tracking-widest">{t("deals.imageLabel")}</span>
                  </div>
                )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"></div>
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 text-white flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="max-w-2xl">
            <span className="font-label-caps text-xs uppercase tracking-[0.2em] mb-3 block text-gold">
              {location} &bull; {project.year}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl mb-6 font-light leading-tight">
              {title}
            </h1>
            <div className="flex items-center gap-6">
              <button 
                onClick={scrollToInquiry}
                className="px-8 py-4 bg-gold hover:bg-gold/90 text-black font-label-caps text-xs uppercase tracking-widest transition-all rounded-none font-semibold flex items-center gap-3"
              >
                {t("project.requestSimilar")}
                <ArrowLeft className="rotate-180" size={14} />
              </button>
              <div className="h-px w-24 bg-white/30 hidden md:block"></div>
            </div>
          </div>
          
          <Link
            href={project.category === "Interior" ? "/projects" : "/collections"}
            className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest text-white/70 hover:text-gold transition-colors pb-1 border-b border-white/20 hover:border-gold"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            <span>{t("project.back")}</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full pb-24">
        {/* Design Concept & Specifications */}
        <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7 pr-0 md:pr-12">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4 block font-semibold">
              {t("project.concept")}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl text-on-surface font-light mb-8">
              {t("project.conceptTitle")}
            </h2>
            <div className="space-y-6 text-on-surface-variant text-base leading-relaxed font-light">
              <p>{description}</p>
            </div>
          </div>
          <div className="md:col-span-5 md:border-l border-outline-variant/30 md:pl-12 rtl:border-l-0 md:rtl:border-r">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-on-surface-variant/60 mb-8 block font-semibold">
              {t("project.specs")}
            </span>
            <div className="space-y-8">
              <div>
                <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant/50 mb-2 font-medium">
                  {t("project.clientNeeds")}
                </h4>
                <p className="font-serif text-lg md:text-xl text-on-surface leading-snug">
                  {getSpecValue("Client Needs", t("project.clientNeedsFallback"))}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant/50 mb-2 font-medium">
                    {t("project.timeline")}
                  </h4>
                  <p className="text-base text-on-surface">
                    {getSpecValue("Timeline", t("project.timelineFallback"))}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant/50 mb-2 font-medium">
                    {t("project.recognition")}
                  </h4>
                  <p className="text-base text-on-surface">
                    {getSpecValue("Recognition", t("project.recognitionFallback"))}
                  </p>
                </div>
              </div>

              {material && (
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant/50 mb-4 font-medium">
                    {t("project.materialsUsed")}
                  </h4>
                  <ul className="space-y-2.5">
                    {material.split(",").map((mat: string, idx: number) => (
                      <li key={idx} className="flex items-center gap-3 text-on-surface text-sm font-light">
                        <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                        <span>{mat.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {style && (
                <div>
                  <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant/50 mb-2 font-medium">
                    {t("project.style")}
                  </h4>
                  <p className="text-base text-on-surface">
                    {style}
                  </p>
                </div>
              )}
              
              {project.price && (
                <div className="border-t border-outline-variant/30 pt-4">
                  <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-gold mb-2 font-semibold">
                    {t("project.price")}
                  </h4>
                  <p className="font-serif text-2xl text-gold font-bold">
                    ${parseFloat(String(project.price)).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Before / After Metamorphosis */}
        {project.beforeImage && project.afterImage && (
          <section className="relative w-full max-w-7xl mx-auto px-6 mb-24">
            <div className="mb-12 text-center">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 block font-semibold">
              {t("project.transformation")}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-on-surface font-light">
                {t("project.beforeAfter")}
              </h2>
            </div>
            <div className="border border-outline-variant/30 rounded-none overflow-hidden">
              <BeforeAfter beforeImage={project.beforeImage} afterImage={project.afterImage} />
            </div>
          </section>
        )}

        {/* Asymmetric Detail Gallery */}
        {galleryImages.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-6">
            <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
              <div>
                <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-on-surface-variant/60 mb-3 block font-semibold">
                  {t("project.capturingDetail")}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-on-surface font-light">
                  {t("project.editorialPerspective")}
                </h2>
              </div>
              <p className="max-w-md text-on-surface-variant/80 text-sm leading-relaxed pb-2 border-b border-outline-variant/20 font-light">
                {t("project.galleryDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:h-[900px] mb-12">
              {/* Left Side (Col-span 8) */}
              <div className="md:col-span-8 flex flex-col gap-8 h-full">
                {/* Primary Gallery Image (2/3 height on desktop) */}
                {galleryImages[0] && (
                  <div className="md:h-2/3 relative group overflow-hidden border border-outline-variant/20 rounded-none aspect-video md:aspect-auto flex-1">
                    <Image
                      src={galleryImages[0]}
                      alt={t("project.galleryAlt")}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 66vw"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="px-8 py-4 bg-white text-black font-label-caps text-xs uppercase tracking-widest rounded-none shadow-md">
                        {t("project.viewMasterWork")}
                      </span>
                    </div>
                  </div>
                )}

                {/* Secondary Bottom Row (1/3 height) */}
                {(galleryImages[1] || galleryImages[2]) && (
                  <div className="grid grid-cols-2 gap-8 md:h-1/3">
                    {galleryImages[1] && (
                      <div className="relative group overflow-hidden border border-outline-variant/20 rounded-none aspect-square md:aspect-auto">
                        <Image
                          src={galleryImages[1]}
                          alt={t("project.detailAlt")}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    {galleryImages[2] && (
                      <div className="relative group overflow-hidden border border-outline-variant/20 rounded-none aspect-square md:aspect-auto">
                        <Image
                          src={galleryImages[2]}
                          alt={t("project.detailAlt")}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Side (Col-span 4) */}
              {galleryImages[3] && (
                <div className="md:col-span-4 h-full relative group overflow-hidden border border-outline-variant/20 rounded-none aspect-[3/4] md:aspect-auto">
                  <Image
                    src={galleryImages[3]}
                    alt={t("project.atriumAlt")}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                  />
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-background/95 backdrop-blur-md opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 border border-outline-variant/20">
                      <h3 className="font-serif text-lg text-on-surface mb-2 font-medium">{t("project.designFocus")}</h3>
                      <p className="text-on-surface-variant text-xs leading-relaxed font-light">
                        {t("project.designFocusDescription")}
                      </p>
                  </div>
                </div>
              )}
            </div>

            {/* Fallback list for remaining images (if more than 4) */}
            {galleryImages.length > 4 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {galleryImages.slice(4).map((img: string, idx: number) => (
                  <div key={idx} className="relative group overflow-hidden border border-outline-variant/20 rounded-none aspect-video">
                    <Image
                      src={img}
                      alt={`${t("project.additionalDetailAlt")} ${idx + 1}`}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Footer CTA & Inquiry Form Section */}
        <section id="inquiry-section" className="py-24 bg-surface-container-low border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gold mb-3 block font-semibold">
              {t("project.inquiriesLabel")}
              </span>
              <h2 className="font-serif text-3xl md:text-5xl text-on-surface font-light mb-6">
                {t("project.bringVision")}
              </h2>
              <p className="text-on-surface-variant/80 text-sm leading-relaxed font-light">
                {t("project.inquiriesDescription")}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-12">
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 bg-background border border-outline-variant/20 rounded-none space-y-6">
                  <h4 className="text-[10px] md:text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold border-b border-outline-variant/20 pb-2">
                    {t("project.showroomAssistance")}
                  </h4>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                    {t("project.showroomDescription")}
                  </p>
                  <div className="space-y-4 pt-2">
                    <button 
                      onClick={() => window.print()}
                      className="w-full py-3 border border-on-surface text-on-surface hover:bg-on-surface hover:text-background font-label-caps text-xs uppercase tracking-widest transition-all rounded-none font-semibold"
                    >
                      {t("project.downloadSpecs")}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 p-8 bg-background border border-outline-variant/20 rounded-none">
                <form onSubmit={handleInquirySubmit} className="space-y-8">
                  {success && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-none text-sm animate-fade-in-up">
                      {success}
                    </div>
                  )}

                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-none text-sm animate-fade-in-up">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">{t("concierge.name")}</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-b border-outline-variant/50 focus:border-gold py-2 text-on-surface text-sm focus:outline-none transition-all rounded-none"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">{t("concierge.email")}</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-b border-outline-variant/50 focus:border-gold py-2 text-on-surface text-sm focus:outline-none transition-all rounded-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">{t("concierge.message")}</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-transparent border-b border-outline-variant/50 focus:border-gold py-2 text-on-surface text-sm focus:outline-none transition-all resize-none rounded-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-on-surface hover:bg-on-surface/90 disabled:bg-on-surface/50 text-background py-4 px-6 rounded-none text-xs uppercase tracking-widest font-semibold transition-colors"
                  >
                    <Send size={14} />
                    <span>{submitting ? t("concierge.submitting") : t("concierge.submit")}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
