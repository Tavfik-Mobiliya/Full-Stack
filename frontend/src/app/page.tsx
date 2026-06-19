"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiProjects, apiTestimonials, apiInquiries } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { 
  ArrowUpRight, 
  Mail, 
  Phone, 
  Send, 
  MessageSquare, 
  BookOpen, 
  Calendar, 
  LayoutGrid,
  Sparkles
} from "lucide-react";

// Mockup-matching fallback projects
const defaultProjects = [
  {
    id: "f1",
    slug: "belvedere-residence",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBWTf_0MVr4A6vKurPw_f0jfRLbaYlRclNTxTf6Db5Fc43izsK8Ldmm_ov0lupc3DA0Q7nmnYvAlTouQir8Z6UwH42q4LaytR2WvT7PaRlsmuRP_CabTwgR5LXnsGYKlqxmYGe7X5QKsKa5iNOVEzwU8Gh2jpPjpXEECnZ3wfdlQeLDKfHRwYGtP6WE6qNvFrnDrxiza5_D8jyoiFzbCUpUqTUItaC4SHdtw1TucNnC2mQit6WxmAk04GbylW435xIoawClpr7APnz5"],
    titleEn: "The Belvedere Residence",
    titleAr: "سكن بلفيدير",
    titleTr: "Belvedere Rezidansı",
    locationEn: "LONDON",
    locationAr: "لندن",
    locationTr: "LONDRA",
    year: "2023",
  },
  {
    id: "f2",
    slug: "emerald-hills",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDCWTzGauxDjD56yHXnX8ouetGrIcCALpB_0jkkzFINKXlEvfDodIbiaalsEeN7jad60xkQ4S1ZmdRUmDEfUVPctRfTJwpthuB1ycgR5wDisQiIOmRU6tcMdChws4eREGz0dd1OGRqfm2fYn7UpxTbtPtQx4EKuILlJfK1R8hKUUWdbne2CRa7PK3MD7XDr6HJkXY42Gje2TUB8HMKTY3n-ZzIzQjOagsfRpYkS2OY95pf9MVOoRdOgY9Jj4JKbmsTL8UMl-ZB79w1j"],
    titleEn: "Emerald Hills Villa",
    titleAr: "فيلا تلال الزمرد",
    titleTr: "Zümrüt Tepeler Villası",
    locationEn: "DUBAI",
    locationAr: "دبي",
    locationTr: "DUBAİ",
    year: "2024",
  },
  {
    id: "f3",
    slug: "bosphorus-penthouse",
    images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuB0rYtNJ5OC741aRcVw-FPniveLENKDmtmuzf6AMnucFd6ZV_mCOa0CQhcBIjHibA5PJ8PdQ7juDM3Ec9a7nRk5Qv6YjatCWmSbGcmEzaLek0M8VW6RO4Abk_T2-ksra-d8wP-Nq4PH4hfNA9Yrcag1_oG02AZvV0RizG9x1lCX6EdKsICC1riKWiXo5riCYWRWHj6jrlbIV0ksGBIPZhlaqYhqJqdOKRsjtcl33_lCatBKAqvK3AuW1Lyzu8IKWpukD-wS8E-a-9IN"],
    titleEn: "Bosphorus Penthouse",
    titleAr: "بنتهاوس البوسفور",
    titleTr: "Boğaziçi Penthouse",
    locationEn: "ISTANBUL",
    locationAr: "إسطنبول",
    locationTr: "İSTANBUL",
    year: "2023",
  }
];

// Fallback signature reviews
const defaultTestimonials = [
  {
    id: "t1",
    quoteEn: "Tevfik Mobilya didn't just design a house; they curated a sanctuary that perfectly reflects our heritage and our modern life. Every detail is a testament to their architectural excellence.",
    quoteAr: "لم تقم Tevfik Mobilya بمجرد تصميم منزل؛ بل قاموا برعاية ملاذ يعكس تراثنا وحياتنا الحديثة تمامًا. كل التفاصيل هي شهادة على تميزهم المعماري.",
    quoteTr: "Tevfik Mobilya sadece bir ev tasarlamadı; mirasımızı ve modern yaşamımızı mükemmel bir şekilde yansıtan bir sığınak yarattı. Her detay mimari mükemmelliklerinin bir kanıtı.",
    author: "ELIF & KEREM AL-SAYED",
    roleEn: "PRIVATE ESTATE OWNERS",
    roleAr: "أصحاب عقارات خاصة",
    roleTr: "ÖZEL MÜLK SAHİPLERİ",
  }
];

export default function HomePage() {
  const { language, t, dir } = useLanguage();
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  
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
    apiProjects
      .getAll({ featured: true })
      .then((data) => {
        if (data && data.length > 0) {
          setFeaturedProjects(data);
        } else {
          setFeaturedProjects(defaultProjects);
        }
      })
      .catch(() => {
        setFeaturedProjects(defaultProjects);
      });

    apiTestimonials
      .getAll()
      .then((data) => {
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials(defaultTestimonials);
        }
      })
      .catch(() => {
        setTestimonials(defaultTestimonials);
      });
  }, []);

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
    } catch (err: any) {
      setErrorMsg(t("concierge.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const text = `Hello Tevfik Mobilya Concierge, I would like to inquire about your luxury design services. Name: ${name || "Client"}. Email: ${email || "Not provided"}.`;
    const encodedText = encodeURIComponent(text);
    const waUrl = `https://wa.me/905551234567?text=${encodedText}`;
    window.open(waUrl, "_blank");
  };

  // Prepares repeating items to cover high-res screen marquees and loop seamlessly
  const prepareMarqueeItems = (items: any[]) => {
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

      {/* Side Concierge Nav Bar */}
      <aside className="fixed right-0 top-1/2 -translate-y-1/2 rounded-l-xl border-l border-y border-outline-variant shadow-2xl bg-surface-container-lowest/95 backdrop-blur-2xl flex flex-col gap-2 p-2 z-40 translate-x-0 hover:-translate-x-1 transition-transform duration-300">
        <div className="flex flex-col items-center gap-1 mb-2 px-2 py-2 border-b border-outline-variant/30">
          <Sparkles size={16} className="text-primary" />
          <span className="text-[8px] uppercase tracking-tighter text-on-surface-variant font-semibold">
            {t("nav.concierge")}
          </span>
        </div>
        
        <button 
          onClick={handleWhatsAppRedirect} 
          className="p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container/50 transition-all rounded-lg group relative cursor-pointer"
        >
          <MessageSquare size={18} />
          <span className="absolute right-full mr-2 px-3 py-1 bg-surface-container-high text-on-surface text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity border border-outline-variant/30">
            {t("concierge.types.whatsapp")}
          </span>
        </button>

        <a 
          href="#concierge" 
          className="p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container/50 transition-all rounded-lg group relative flex items-center justify-center"
        >
          <BookOpen size={18} />
          <span className="absolute right-full mr-2 px-3 py-1 bg-surface-container-high text-on-surface text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity border border-outline-variant/30">
            {t("concierge.types.catalog")}
          </span>
        </a>

        <a 
          href="#concierge" 
          className="p-3 text-on-surface-variant hover:text-primary hover:bg-surface-container/50 transition-all rounded-lg group relative flex items-center justify-center"
        >
          <Calendar size={18} />
          <span className="absolute right-full mr-2 px-3 py-1 bg-surface-container-high text-on-surface text-[10px] rounded opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity border border-outline-variant/30">
            {t("concierge.types.appointment")}
          </span>
        </a>
      </aside>

      <main>
        {/* Full-screen Hero Section */}
        <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              className="w-full h-full object-cover scale-105" 
              alt="A grand, ultra-luxurious living room design showroom"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg-70ZBH9uCh-Q7hg84E5AtIta9Ku1C_Q6oD0QsvSBHaIFAwtG7RBkbLHMZ5tPXIoD3nH_ntNJ6tli560FWFoIO9SNW2zkcmfN37YhB__WfSFMrkMZWHj0UoUyS9spuQRRsnQcsPoDN-_dHkZC9DuJn9F-SgWjr60WrAtydVzg8Mz6kYrYiXS-FLD8yZo6-DTwrU_xzuE8uUjQpZ13o_XCTAcF9fJ4XlbA68-d9U_aWtintSc634CA_4_HAWwyzKnhQuyW955Lgd5"
            />
            <div className="absolute inset-0 hero-gradient"></div>
          </div>
          <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-16 pb-32 max-w-7xl mx-auto w-full">
            <div className="reveal-on-scroll active space-y-6">
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white max-w-4xl tracking-tight leading-none">
                {t("hero.title")}
              </h1>
              <p className="text-white/80 text-lg md:text-xl font-light tracking-wide max-w-2xl">
                {t("hero.subtitle")}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link 
                  href="/projects" 
                  className="bg-primary text-on-primary px-10 py-4 text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-all shadow-lg rounded"
                >
                  {t("hero.explore")}
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
            <div className="group relative overflow-hidden h-[500px] md:h-full rounded-lg border border-outline-variant/30 reveal-on-scroll">
              <img 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="Minimalist luxury kitchen and dining interior design"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcT32eIqldwdS9JKEWnTT29cCnfwx9YU570iBeElcepVtY0e0aSiC56EXnD5Y5_wT6itTcLsNd5Qvw_sToZXZOitPQZpQFY7n0kwdJ3g_IUksZnPMy_Lr4MqcG6yfdXYPu29R6gxoObpmhb5at6MGMfoOii4vcNdCV7rIUhAPsMREEws8sa8aKaQL35z6aHF49kHNvj_51CSAXvB0EZC-jPq-pj20COSgziRwmX3onMUDrK4ME2Il6STvuSMfPzZJTlWo2byYVWGzX"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:bg-black/60 transition-all duration-500 flex flex-col justify-end p-12">
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">
                  {t("nav.projects")}
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-sm mb-8">
                  Bespoke architectural solutions for the modern home.
                </p>
                <Link 
                  href="/projects" 
                  className="w-fit text-xs font-semibold text-primary border-b border-primary pb-2 hover:opacity-70 transition-opacity uppercase tracking-widest"
                >
                  EXPLORE SERVICES
                </Link>
              </div>
            </div>

            {/* Furniture Design */}
            <div className="group relative overflow-hidden h-[500px] md:h-full rounded-lg border border-outline-variant/30 reveal-on-scroll">
              <img 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                alt="Bespoke furniture crafted as sculptural objects" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKfiav6kLsRC6faFNyR4P803O6AbAYV9OKvG1cMAOeIoUSqmmBM5CeSceQ3uGlepLCrZ-uNb1WZpIiKkk7Bqf26QrZBZp54N5ZqKesa12aVOdqD9JZmdfSWKehOBozox7b54hFvW4V2nd-LJB8WVd0Zg-tWTXifak4GpIHvIWReF9DZmzPX9dr4dD6uVEp2KwYmAVPwxS3XA7dxsa8TH-E8n0prw6k_-nc5Kh142iXsdlDEuo4K7BWjgB-j3NDyHvr9vPiCt1Ifl6r"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 group-hover:bg-black/60 transition-all duration-500 flex flex-col justify-end p-12">
                <h2 className="font-serif text-3xl md:text-5xl text-white mb-4">
                  {t("nav.collections")}
                </h2>
                <p className="text-sm md:text-base text-white/70 max-w-sm mb-8">
                  Exclusive furniture crafted with uncompromising detail.
                </p>
                <Link 
                  href="/collections" 
                  className="w-fit text-xs font-semibold text-primary border-b border-primary pb-2 hover:opacity-70 transition-opacity uppercase tracking-widest"
                >
                  EXPLORE COLLECTIONS
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Endless Scrolling Wheel (Featured Projects) */}
        {marqueeItems.length > 0 && (
          <section className="py-24 overflow-hidden reveal-on-scroll">
            <div className="px-6 md:px-16 max-w-7xl mx-auto flex justify-between items-end mb-16">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-semibold block mb-2">
                  PORTFOLIO
                </span>
                <h2 className="font-serif text-3xl md:text-5xl text-primary font-bold">
                  {t("filters.featured")}
                </h2>
              </div>
              <Link 
                href="/projects" 
                className="text-xs font-semibold text-primary hover:underline transition-all uppercase tracking-widest"
              >
                VIEW ALL WORKS
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
                    <div className="aspect-[4/5] overflow-hidden mb-6 border border-outline-variant/30 rounded-lg">
                      <img
                        src={project.images?.[0] || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=800"}
                        alt={getLocalized(project, "title", language)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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

        {/* Testimonial Section */}
        {testimonials.length > 0 && (
          <section className="py-32 bg-surface-container border-y border-outline-variant/30 reveal-on-scroll">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <span className="font-serif text-5xl text-primary mb-8 block select-none">“</span>
              <blockquote className="font-serif text-2xl md:text-4xl text-on-surface max-w-4xl mx-auto italic mb-10 leading-relaxed">
                "{getLocalized(testimonials[0], "quote", language)}"
              </blockquote>
              <div className="text-xs font-semibold text-on-surface-variant tracking-[0.3em] uppercase">
                {testimonials[0].author} • {getLocalized(testimonials[0], "role", language)}
              </div>
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
                    <a href="mailto:[EMAIL_ADDRESS]" className="text-on-surface font-medium hover:text-primary transition-colors">
                      [EMAIL_ADDRESS]
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 rtl:space-x-reverse">
                  <div className="w-10 h-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <Phone size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/50 block">Call Us</span>
                    <a href="tel:+905551234567" className="text-on-surface font-medium hover:text-primary transition-colors">
                      +90 (555) 123 45 67
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
