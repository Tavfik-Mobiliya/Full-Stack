"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiProducts, apiDeals, apiTestimonials, apiInquiries, apiSettings } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Deal, Product, Testimonial, CompanySettings } from "@/types/api";
import { Mail, Phone, Send, MessageSquare, BookOpen, Calendar, Sparkles,
  Star } from "lucide-react";

export default function HomePage() {
  const { language, t } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  // Concierge Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [inquiryType, setInquiryType] = useState("Contact");
  const [meetingDate, setMeetingDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Load backend portfolios and testimonials
  useEffect(() => {
    apiProducts
      .getAll({ featured: true })
      .then((data) => {
        if (data) {
          setFeaturedProjects(data);
        }
      });

    apiDeals
      .getAll({ featured: true })
      .then((data) => {
        if (data) {
          setDeals(data);
        }
      });

    apiTestimonials
      .getAll()
      .then((data) => {
        if (data) {
          setTestimonials(data);
        }
      });

    apiSettings
      .get()
      .then((data) => {
        if (data) {
          setSettings(data);
        }
      });
  }, []);

  // Auto-rotate hero backgrounds
  useEffect(() => {
    if (deals.length < 2) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % deals.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [deals.length]);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length < 2 || isPaused) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  // Reveal-on-scroll animation logic
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(".reveal-on-scroll");
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, [featuredProjects, testimonials]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const payload = {
        name,
        email,
        phone: phone || undefined,
        message,
        type: inquiryType,
        details: meetingDate ? { preferredDate: meetingDate } : undefined,
      };

      await apiInquiries.submit(payload);
      setSuccessMsg(t("concierge.success"));
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
      setMeetingDate("");
    } catch {
      setErrorMsg(t("concierge.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hello Tevfik Mobilya Concierge, I would like to inquire about your luxury design services. Name: ${name || "Client"}. Email: ${email || "Not provided"}.`;
    const encodedText = encodeURIComponent(text);
    const waNumber = settings?.whatsappNumber || "905551234567";
    const waUrl = `https://wa.me/${waNumber}?text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  // Prepares repeating items to cover high-res screen marquees and loop seamlessly
  const prepareMarqueeItems = (items: Product[]) => {
    if (!items || items.length === 0) return [];
    let list = [...items];
    while (list.length < 8) {
      list = [...list, ...items];
    }
    return [...list, ...list];
  };

  const marqueeItems = prepareMarqueeItems(featuredProjects);

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />
      <main>
        {/* Full-screen Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            {deals.length > 0 ? (
              deals.map((deal, idx) => (
                <div
                  key={deal.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    idx === heroIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    fill
                    className="scale-105 hover:scale-110 transition-transform duration-1000"
                    alt={getLocalized(deal, "title", language)}
                    src={deal.coverImage || deal.images[0] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1920"}
                    sizes="100vw"
                    priority={idx === 0}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ))
            ) : (
              <Image
                fill
                className="scale-105"
                alt="Hero background"
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1920"
                sizes="100vw"
                priority
                style={{ objectFit: "cover" }}
              />
            )}
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-32 max-w-7xl mx-auto w-full">
            <div className="reveal-on-scroll active space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/60 font-semibold">
                  {t("hero.featuredDeal")}
                </span>
                {deals.length > 1 && (
                  <div className="flex gap-1.5">
                    {deals.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeroIndex(idx)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === heroIndex ? "bg-primary w-4" : "bg-white/40 hover:bg-white/60"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white max-w-4xl tracking-tight leading-none">
                {deals.length > 0 ? getLocalized(deals[heroIndex], "title", language) : t("hero.title")}
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-2xl">
                {deals.length > 0 ? getLocalized(deals[heroIndex], "description", language) : t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link
                  href={deals.length > 0 ? `/deals/${deals[heroIndex].slug}` : "/projects"}
                  className="bg-primary text-on-primary px-10 py-4 text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg rounded"
                >
                  {deals.length > 0 ? t("hero.viewDeal") : t("hero.explore")}
                </Link>
                <a
                  href="#concierge"
                  className="border border-white/40 text-white px-10 py-4 text-xs font-semibold uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm rounded"
                >
                  {t("hero.book")}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Dual Category Split */}
        <section className="px-6 md:px-16 max-w-7xl mx-auto pt-32 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:h-[700px]">
            {/* Interior Design */}
            <Link href="/projects" className="group relative overflow-hidden h-[500px] md:h-full rounded-lg border border-outline-variant/30 reveal-on-scroll">
  <Image
    fill
    className="transition-transform duration-1000 group-hover:scale-110"
    alt="Minimalist luxury kitchen and dining interior design"
    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcT32eIqldwdS9JKEWnTT29cCnfwx9YU570iBeElcepVtY0e0aSiC56EXnD5Y5_wT6itTcLsNd5Qvw_sToZXZOitPQZpQFY7n0kwdJ3g_IUksZnPMy_Lr4MqcG6yfdXYPu29R6gxoObpmhb5at6MGMfoOii4vcNdCV7rIUhAPsMREEws8sa8aKaQL35z6aHF49kHNvj_51CSAXvB0EZC-jPq-pj20COSgziRwmX3onMUDrK4ME2Il6STvuSMfPzZJTlWo2byYVWGzX"
    sizes="(max-width: 768px) 100vw, 50vw"
    style={{ objectFit: "cover" }}
  />
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:bg-black/60 transition-all duration-500 flex flex-col justify-end p-12">
    <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">
      {t("nav.projects")}
    </h2>
    <p className="text-sm md:text-base text-white/70 max-w-sm mb-8">
      {t("home.interiorDescription")}
    </p>
    <span className="w-fit text-xs font-semibold text-primary border-b border-primary pb-2 hover:opacity-70 transition-opacity uppercase tracking-widest">
      {t("home.exploreServices")}
    </span>
  </div>
</Link>
            

            {/* Furniture Design */}
            <Link href="/collections" className="group relative overflow-hidden h-[500px] md:h-full rounded-lg border border-outline-variant/30 reveal-on-scroll">
              <Image
                fill
                className="transition-transform duration-1000 group-hover:scale-110"
                alt="Bespoke furniture crafted as sculptural objects"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKfiav6kLsRC6faFNyR4P803O6AbAYV9OKvG1cMAOeIoUSqmmBM5CeSceQ3uGlepLCrZ-uNb1WZpIiKkk7Bqf26QrZBZp54N5ZqKesa12aVOdqD9JZmdfSWKehOBozox7b54hFvW4V2nd-LJB8WVd0Zg-tWTXifak4GpIHvIWReF9DZmzPX9dr4dD6uVEp2KwYmAVPwxS3XA7dxsa8TH-E8n0prw6k_-nc5Kh142iXsdlDEuo4K7BWjgB-j3NDyHvr9vPiCt1Ifl6r"
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:bg-black/60 transition-all duration-500 flex flex-col justify-end p-12">
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">{t("nav.collections")}</h2>
                <p className="text-sm md:text-base text-white/70 max-w-sm mb-8">{t("home.furnitureDescription")}</p>
                <span className="w-fit text-xs font-semibold text-primary border-b border-primary pb-2 hover:opacity-70 transition-opacity uppercase tracking-widest">{t("home.exploreCollections")}</span>
              </div>
            </Link>
          </div>
        </section>

        {/* Endless Scrolling Wheel (Featured Projects) */}
        {marqueeItems.length > 0 && (
          <section className="py-24 overflow-hidden reveal-on-scroll">
            <div className="px-6 md:px-16 max-w-7xl mx-auto flex justify-between items-end mb-16">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold block mb-2">
                  {t("home.portfolioLabel")}
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-primary font-bold">
                  {t("filters.featured")}
                </h2>
              </div>
              <Link 
                href="/projects" 
                className="text-xs font-semibold text-primary hover:underline transition-all uppercase tracking-widest"
              >
                {t("home.viewAllWorks")}
              </Link>
            </div>

            <div className="marquee relative w-full overflow-hidden">
              <div className="marquee-content flex gap-8">
                {marqueeItems.map((project, idx) => (
                  <Link
                    key={`${project.id}-${idx}`}
                    href={`/projects/${project.slug}`}
                    className="w-[300px] md:w-[350px] flex-shrink-0 group cursor-pointer"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden mb-6 border border-outline-variant/30 rounded-lg">
                      <Image
                        src={project.images?.[0] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"}
                        alt={getLocalized(project, "title", language)}
                        fill
                        className="transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <p className="text-[10px] text-on-surface-variant mb-1 uppercase tracking-widest">
                      {getLocalized(project, "location", language)} • {project.year || "2024"}
                    </p>
                    <h4 className="text-xl md:text-2xl text-on-surface mb-2 font-serif group-hover:text-primary transition-colors">
                      {getLocalized(project, "title", language)}
                    </h4>
                    <div className="horizontal-line group-hover:bg-primary transition-colors"></div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonial Carousel */}
        {testimonials.length > 0 && (
          <section
            className="py-32 bg-surface-container border-y border-outline-variant/30 reveal-on-scroll"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="max-w-7xl mx-auto px-6 text-center">
              <span className="font-serif text-5xl text-primary mb-8 block select-none">“</span>
              <blockquote className="font-serif text-2xl md:text-4xl text-on-surface max-w-4xl mx-auto italic mb-10 leading-relaxed min-h-[1.4em] transition-opacity duration-500">
                &ldquo;{getLocalized(testimonials[activeTestimonial], "quote", language)}&rdquo;
              </blockquote>
              <div className="flex justify-center items-center space-x-1 text-gold mb-6">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={20}
                    fill={idx < (testimonials[activeTestimonial].rating || 5) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <div className="text-xs font-semibold text-on-surface-variant tracking-[0.3em] uppercase mb-8">
                {testimonials[activeTestimonial].author} • {getLocalized(testimonials[activeTestimonial], "role", language)}
              </div>
              {testimonials.length > 1 && (
                <div className="flex justify-center items-center gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTestimonial(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        idx === activeTestimonial
                          ? "bg-primary w-6"
                          : "bg-on-surface-variant/30 hover:bg-on-surface-variant/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Experience Concierge CTA & Interactive Form */}
        <section id="concierge" className="py-24 px-6 max-w-7xl mx-auto w-full reveal-on-scroll">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Informational CTA Column */}
            <div className="lg:col-span-5 flex flex-col space-y-6">
              <span className="text-xs uppercase tracking-[0.3em] text-primary font-semibold">
                THE CONCIERGE ATELIER
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-on-surface font-bold leading-tight">
                {t("concierge.title")}
              </h2>
              <p className="text-on-surface-variant text-base leading-relaxed font-light">
                {t("concierge.subtitle")}
              </p>

              <div className="pt-8 flex flex-col space-y-4 border-t border-outline-variant/30">
                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Mail size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 block">Email Us</span>
                    <a href={`mailto:${settings?.contactEmail || "concierge@aura-interiors.com"}`} className="text-on-surface font-medium hover:text-primary transition-colors">
                      {settings?.contactEmail || "concierge@aura-interiors.com"}
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 block">Call Us</span>
                    <a href={`tel:${settings?.whatsappNumber ? `+${settings.whatsappNumber}` : "+905551234567"}`} className="text-on-surface font-medium hover:text-primary transition-colors">
                      {settings?.contactPhone || "+90 (555) 123 45 67"}
                    </a>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Inquiry */}
              <button
                onClick={handleWhatsAppRedirect}
                className="mt-6 inline-flex items-center justify-center space-x-2 rtl:space-x-reverse bg-emerald-600/90 hover:bg-emerald-600 text-white py-4 px-8 rounded text-xs uppercase tracking-widest font-semibold transition-colors w-fit cursor-pointer shadow-md"
              >
                <MessageSquare size={16} />
                <span>{t("concierge.types.whatsapp")}</span>
              </button>
            </div>

            {/* Interactive Request Form Column */}
            <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-lg border border-outline-variant/30 shadow-xl">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                {successMsg && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-sm">
                    {successMsg}
                  </div>
                )}
                {errorMsg && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">
                      {t("concierge.name")}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-background/40 border border-outline-variant/40 rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">
                      {t("concierge.email")}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-background/40 border border-outline-variant/40 rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">
                      {t("concierge.phone")}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="bg-background/40 border border-outline-variant/40 rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">
                      {t("concierge.type")}
                    </label>
                    <select
                      value={inquiryType}
                      onChange={(e) => setInquiryType(e.target.value)}
                      className="bg-background/90 border border-outline-variant/40 rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                    >
                      <option value="Contact">{t("concierge.types.contact")}</option>
                      <option value="Appointment">{t("concierge.types.appointment")}</option>
                      <option value="Catalog">{t("concierge.types.catalog")}</option>
                    </select>
                  </div>
                </div>

                {/* Appointment Date */}
                {inquiryType === "Appointment" && (
                  <div className="flex flex-col space-y-2 animate-fade-in-up">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium flex items-center space-x-2">
                      <Calendar size={14} className="text-primary" />
                      <span>{t("concierge.preferredDate")}</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="bg-background/40 border border-outline-variant/40 rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary transition-all"
                    />
                  </div>
                )}

                {/* Message */}
                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">
                    {t("concierge.message")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-background/40 border border-outline-variant/40 rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-primary transition-all resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-primary text-on-primary py-4 px-6 rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-lg hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  <Send size={14} />
                  <span>{loading ? t("concierge.submitting") : t("concierge.submit")}</span>
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
