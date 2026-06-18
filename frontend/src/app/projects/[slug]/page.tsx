"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BeforeAfter } from "@/components/BeforeAfter";
import { useLanguage } from "@/context/LanguageContext";
import { apiProjects, apiInquiries } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Calendar, MapPin, Tag, Info, ArrowLeft, Send } from "lucide-react";

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { language, t } = useLanguage();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");

  // Inquiry form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    apiProjects
      .getBySlug(slug)
      .then((data) => {
        setProject(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
      })
      .catch((err) => {
        console.error("Error fetching project details:", err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Set default message once project is loaded
  useEffect(() => {
    if (project) {
      const pTitle = getLocalized(project, "title", language);
      setMessage(`Hello Aura, I am interested in inquiring about "${pTitle}". Please provide me with more information.`);
    }
  }, [project, language]);

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
        details: { projectSlug: slug, projectName: project.titleEn },
      });
      setSuccess(t("concierge.success"));
      setName("");
      setEmail("");
    } catch (err: any) {
      setError(t("concierge.error"));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-ink-black text-silver">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
            Retrieving masterwork details...
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col min-h-screen bg-ink-black text-silver">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <span className="text-sm uppercase tracking-widest text-silver/50">
            Masterpiece not found.
          </span>
          <Link href="/projects" className="text-xs uppercase tracking-widest text-gold border-b border-gold">
            Return to Gallery
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

  return (
    <div className="flex flex-col min-h-screen bg-ink-black text-silver">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Back Link */}
        <Link
          href={project.category === "Interior" ? "/projects" : "/collections"}
          className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest text-silver/50 hover:text-gold transition-colors mb-12"
        >
          <ArrowLeft size={14} className="rtl:rotate-180" />
          <span>{t("project.back")}</span>
        </Link>

        {/* Project Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="bg-gold/10 border border-gold/20 text-gold px-3 py-1 rounded text-[10px] tracking-widest uppercase">
                {project.category}
              </span>
              {project.subCategory && (
                <span className="bg-silver/10 border border-silver/20 text-silver px-3 py-1 rounded text-[10px] tracking-widest uppercase">
                  {project.subCategory}
                </span>
              )}
            </div>
            <h1 className="font-serif text-4xl md:text-6xl text-champagne font-bold leading-tight">
              {title}
            </h1>
            <p className="text-silver/80 text-lg font-light leading-relaxed max-w-3xl">
              {description}
            </p>
          </div>

          {/* Quick Specifications Metadata */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-lg h-fit space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-gold font-bold border-b border-silver/10 pb-3">
              Project Overview
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-silver/50 flex items-center space-x-2 rtl:space-x-reverse">
                  <MapPin size={14} />
                  <span>{t("project.location")}</span>
                </span>
                <span className="text-champagne font-medium">{location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-silver/50 flex items-center space-x-2 rtl:space-x-reverse">
                  <Calendar size={14} />
                  <span>{t("project.year")}</span>
                </span>
                <span className="text-champagne font-medium">{project.year}</span>
              </div>
              {material && (
                <div className="flex items-center justify-between">
                  <span className="text-silver/50 flex items-center space-x-2 rtl:space-x-reverse">
                    <Tag size={14} />
                    <span>{t("project.material")}</span>
                  </span>
                  <span className="text-champagne font-medium text-right max-w-[180px] truncate">{material}</span>
                </div>
              )}
              {style && (
                <div className="flex items-center justify-between">
                  <span className="text-silver/50 flex items-center space-x-2 rtl:space-x-reverse">
                    <Info size={14} />
                    <span>{t("project.style")}</span>
                  </span>
                  <span className="text-champagne font-medium">{style}</span>
                </div>
              )}
              {project.price && (
                <div className="flex items-center justify-between border-t border-silver/10 pt-3">
                  <span className="text-gold uppercase tracking-wider font-semibold text-xs">
                    {t("project.price")}
                  </span>
                  <span className="text-gold font-bold text-base">
                    ${parseFloat(project.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery & Interactive Slider */}
        <div className="space-y-12 mb-16">
          {/* Main active image */}
          {activeImage && (
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-silver/10">
              <img
                src={activeImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Thumbnail list */}
          {project.images && project.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {project.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-28 aspect-video rounded overflow-hidden flex-shrink-0 border transition-all ${
                    activeImage === img ? "border-gold scale-95" : "border-silver/10 hover:border-gold/30"
                  }`}
                >
                  <img src={img} alt={`${title} ${index}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Before / After Slider */}
          {project.beforeImage && project.afterImage && (
            <div className="space-y-6 pt-8 border-t border-silver/10">
              <h2 className="font-serif text-2xl text-champagne font-semibold text-center">
                {t("project.beforeAfter")}
              </h2>
              <BeforeAfter beforeImage={project.beforeImage} afterImage={project.afterImage} />
            </div>
          )}
        </div>

        {/* Custom Specifications specs details if present */}
        {project.specs && Object.keys(project.specs).length > 0 && (
          <div className="mb-16 pt-12 border-t border-silver/10">
            <h2 className="font-serif text-2xl text-champagne font-semibold mb-6">
              {t("project.specs")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(project.specs).map(([key, value]) => (
                <div key={key} className="glass-panel p-6 rounded">
                  <span className="text-xs uppercase tracking-widest text-silver/40 block mb-2">{key}</span>
                  <span className="text-champagne font-serif text-lg font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inquiry Form Call to Action */}
        <section className="pt-12 border-t border-silver/10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block">
                ACQUISITIONS & INQUIRIES
              </span>
              <h2 className="font-serif text-3xl text-champagne font-bold">
                {t("project.inquire")}
              </h2>
              <p className="text-silver/70 text-sm leading-relaxed">
                Connect with our showroom concierges to request physical material samples, customization options, or catalog details.
              </p>
            </div>

            <div className="lg:col-span-7 glass-panel p-8 rounded-lg">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                
                {success && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-sm animate-fade-in-up">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm animate-fade-in-up">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-silver/65">{t("concierge.name")}</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-sm focus:outline-none focus:border-gold transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-silver/65">{t("concierge.email")}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-sm focus:outline-none focus:border-gold transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest text-silver/65">{t("concierge.message")}</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-ink-black/40 border border-silver/10 rounded px-4 py-3 text-silver text-sm focus:outline-none focus:border-gold transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gold hover:bg-gold/90 disabled:bg-gold/50 text-ink-black py-4 px-6 rounded text-xs uppercase tracking-widest font-semibold transition-colors shadow-lg"
                >
                  <Send size={14} />
                  <span>{submitting ? t("concierge.submitting") : t("concierge.submit")}</span>
                </button>

              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
