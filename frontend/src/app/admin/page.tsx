"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { apiProjects, apiTestimonials, apiInquiries, apiAuth, apiCollections } from "@/utils/api";
import { Plus, Edit, Trash2, SlidersHorizontal, MessageSquare, BookOpen, Star, FileText, FolderOpen } from "lucide-react";

export default function AdminPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"projects" | "collections" | "inquiries" | "testimonials">("projects");

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Data lists
  const [projects, setProjects] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Form states (Projects)
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Interior");
  const [subCategory, setSubCategory] = useState("");
  const [roomType, setRoomType] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [price, setPrice] = useState("");
  const [budget, setBudget] = useState("Premium");
  const [images, setImages] = useState("");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [featured, setFeatured] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [titleTr, setTitleTr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [descTr, setDescTr] = useState("");
  const [locEn, setLocEn] = useState("");
  const [locAr, setLocAr] = useState("");
  const [locTr, setLocTr] = useState("");
  const [matEn, setMatEn] = useState("");
  const [matAr, setMatAr] = useState("");
  const [matTr, setMatTr] = useState("");
  const [styleEn, setStyleEn] = useState("");
  const [styleAr, setStyleAr] = useState("");
  const [styleTr, setStyleTr] = useState("");
  const [specsText, setSpecsText] = useState("");
  const [projectCollectionId, setProjectCollectionId] = useState("");

  // Form states (Collections)
  const [collectionFormOpen, setCollectionFormOpen] = useState(false);
  const [editingCollectionId, setEditingCollectionId] = useState<number | null>(null);
  const [collectionNameEn, setCollectionNameEn] = useState("");
  const [collectionNameAr, setCollectionNameAr] = useState("");
  const [collectionNameTr, setCollectionNameTr] = useState("");

  // Form states (Testimonials)
  const [testimonialFormOpen, setTestimonialFormOpen] = useState(false);
  const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);
  const [author, setAuthor] = useState("");
  const [testimonialCategory, setTestimonialCategory] = useState("General");
  const [rating, setRating] = useState<number>(5);
  const [quoteEn, setQuoteEn] = useState("");
  const [quoteAr, setQuoteAr] = useState("");
  const [quoteTr, setQuoteTr] = useState("");
  const [roleEn, setRoleEn] = useState("");
  const [roleAr, setRoleAr] = useState("");
  const [roleTr, setRoleTr] = useState("");

  // Load all dashboard records
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const projs = await apiProjects.getAll();
      setProjects(projs);
      const cols = await apiCollections.getAll();
      setCollections(cols);
      const inqs = await apiInquiries.getAll();
      setInquiries(inqs);
      const tests = await apiTestimonials.getAll();
      setTestimonials(tests);
    } catch (err) {
      console.error("Error loading dashboard content:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await apiAuth.isLoggedIn();
      setIsLoggedIn(loggedIn);
      setCheckingAuth(false);
      if (loggedIn) {
        loadDashboardData();
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSubmittingAuth(true);
    try {
      await apiAuth.login(emailInput, passwordInput);
      setIsLoggedIn(true);
      loadDashboardData();
    } catch (err: any) {
      setAuthError(err.message || "Failed to sign in. Please check credentials.");
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    await apiAuth.logout();
    setIsLoggedIn(false);
    setProjects([]);
    setInquiries([]);
    setTestimonials([]);
  };

  // Project Submit Handler
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let parsedSpecs = {};
    try {
      if (specsText.trim()) {
        parsedSpecs = JSON.parse(specsText);
      }
    } catch (err) {
      alert("Invalid JSON format in Specs field. E.g. {\"Area\": \"1200 sq ft\"}");
      return;
    }

    const payload = {
      slug,
      category,
      subCategory: subCategory || null,
      roomType: roomType || null,
      year: parseInt(year),
      price: price ? parseFloat(price) : null,
      budget,
      images: images.split(",").map((img) => img.trim()).filter(Boolean),
      beforeImage: beforeImage || null,
      afterImage: afterImage || null,
      featured,
      titleEn,
      titleAr,
      titleTr,
      descriptionEn: descEn,
      descriptionAr: descAr,
      descriptionTr: descTr,
      locationEn: locEn,
      locationAr: locAr,
      locationTr: locTr,
      materialEn: matEn || null,
      materialAr: matAr || null,
      materialTr: matTr || null,
      styleEn: styleEn || null,
      styleAr: styleAr || null,
      styleTr: styleTr || null,
      specs: parsedSpecs,
      collectionId: projectCollectionId ? parseInt(projectCollectionId) : null,
    };

    if (!projectCollectionId) {
      const confirmProceed = confirm(
        language === "ar"
          ? "يفضل تحديد مجموعة للمشروع. هل تريد الاستمرار بدون مجموعة؟"
          : language === "tr"
          ? "Projeyi bir koleksiyona atamanız önerilir. Koleksiyon olmadan devam etmek istiyor musunuz?"
          : "Assigning a collection to the project is preferred. Do you want to proceed without one?"
      );
      if (!confirmProceed) return;
    }

    try {
      if (editingProjectId) {
        await apiProjects.update(editingProjectId, payload);
      } else {
        await apiProjects.create(payload);
      }
      setProjectFormOpen(false);
      resetProjectForm();
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to submit project.");
    }
  };

  const handleEditProject = (p: any) => {
    setEditingProjectId(p.id);
    setSlug(p.slug);
    setCategory(p.category);
    setSubCategory(p.subCategory || "");
    setRoomType(p.roomType || "");
    setYear(p.year.toString());
    setPrice(p.price ? p.price.toString() : "");
    setBudget(p.budget || "Premium");
    setImages(p.images ? p.images.join(", ") : "");
    setBeforeImage(p.beforeImage || "");
    setAfterImage(p.afterImage || "");
    setFeatured(p.featured);
    setTitleEn(p.titleEn);
    setTitleAr(p.titleAr);
    setTitleTr(p.titleTr);
    setDescEn(p.descriptionEn);
    setDescAr(p.descriptionAr);
    setDescTr(p.descriptionTr);
    setLocEn(p.locationEn);
    setLocAr(p.locationAr);
    setLocTr(p.locationTr);
    setMatEn(p.materialEn || "");
    setMatAr(p.materialAr || "");
    setMatTr(p.materialTr || "");
    setStyleEn(p.styleEn || "");
    setStyleAr(p.styleAr || "");
    setStyleTr(p.styleTr || "");
    setSpecsText(p.specs ? JSON.stringify(p.specs, null, 2) : "");
    setProjectCollectionId(p.collectionId ? p.collectionId.toString() : "");
    setProjectFormOpen(true);
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await apiProjects.delete(id);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setSlug("");
    setCategory("Interior");
    setSubCategory("");
    setRoomType("");
    setYear(new Date().getFullYear().toString());
    setPrice("");
    setBudget("Premium");
    setImages("");
    setBeforeImage("");
    setAfterImage("");
    setFeatured(false);
    setTitleEn("");
    setTitleAr("");
    setTitleTr("");
    setDescEn("");
    setDescAr("");
    setDescTr("");
    setLocEn("");
    setLocAr("");
    setLocTr("");
    setMatEn("");
    setMatAr("");
    setMatTr("");
    setStyleEn("");
    setStyleAr("");
    setStyleTr("");
    setSpecsText("");
    setProjectCollectionId("");
  };

  // Testimonial Submit Handler
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      author,
      category: testimonialCategory,
      rating,
      quoteEn,
      quoteAr,
      quoteTr,
      roleEn,
      roleAr,
      roleTr,
    };

    try {
      if (editingTestimonialId) {
        await apiTestimonials.update(editingTestimonialId, payload);
      } else {
        await apiTestimonials.create(payload);
      }
      setTestimonialFormOpen(false);
      resetTestimonialForm();
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to submit testimonial.");
    }
  };

  const handleEditTestimonial = (t: any) => {
    setEditingTestimonialId(t.id);
    setAuthor(t.author);
    setTestimonialCategory(t.category);
    setRating(t.rating || 5);
    setQuoteEn(t.quoteEn);
    setQuoteAr(t.quoteAr);
    setQuoteTr(t.quoteTr);
    setRoleEn(t.roleEn);
    setRoleAr(t.roleAr);
    setRoleTr(t.roleTr);
    setTestimonialFormOpen(true);
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await apiTestimonials.delete(id);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to delete testimonial");
    }
  };

  const resetTestimonialForm = () => {
    setEditingTestimonialId(null);
    setAuthor("");
    setTestimonialCategory("General");
    setRating(5);
    setQuoteEn("");
    setQuoteAr("");
    setQuoteTr("");
    setRoleEn("");
    setRoleAr("");
    setRoleTr("");
  };

  // Collection CRUD Handlers
  const handleCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nameEn: collectionNameEn,
      nameAr: collectionNameAr,
      nameTr: collectionNameTr,
    };

    try {
      if (editingCollectionId) {
        await apiCollections.update(editingCollectionId, payload);
      } else {
        await apiCollections.create(payload);
      }
      setCollectionFormOpen(false);
      resetCollectionForm();
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to submit collection.");
    }
  };

  const handleEditCollection = (c: any) => {
    setEditingCollectionId(c.id);
    setCollectionNameEn(c.nameEn);
    setCollectionNameAr(c.nameAr);
    setCollectionNameTr(c.nameTr);
    setCollectionFormOpen(true);
  };

  const handleDeleteCollection = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await apiCollections.delete(id);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to delete collection");
    }
  };

  const resetCollectionForm = () => {
    setEditingCollectionId(null);
    setCollectionNameEn("");
    setCollectionNameAr("");
    setCollectionNameTr("");
  };

  // Inquiry Handler
  const handleDeleteInquiry = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await apiInquiries.delete(id);
      loadDashboardData();
    } catch (err: any) {
      alert(err.message || "Failed to delete inquiry");
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-ink-black text-silver justify-center items-center">
        <span className="text-xs uppercase tracking-[0.3em] text-gold animate-pulse">
          Authenticating Curator Session...
        </span>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-32 pb-24 px-6">
          <div className="glass-panel p-8 md:p-12 rounded-lg border border-gold/15 shadow-2xl max-w-md w-full animate-fade-in-up">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold block mb-2">
                SECURE ARCHIVE
              </span>
              <h1 className="font-serif text-3xl text-on-surface font-bold">
                Curator Login
              </h1>
              <p className="text-on-surface/50 text-xs mt-2">
                Authorized design personnel access only.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {authError && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-xs">
                  {authError}
                </div>
              )}
              
              <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-on-surface/70 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-gold transition-all"
                  placeholder="admin@aura.com"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-xs uppercase tracking-widest text-on-surface/70 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-gold transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-on-primary py-4 px-6 rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-lg disabled:opacity-50 cursor-pointer"
              >
                <span>{submittingAuth ? "Verifying..." : "Enter Atelier"}</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-ink-black text-silver">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">
              CURATION STUDIO
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-champagne font-bold">
              {t("admin.title")}
            </h1>
            <p className="text-silver/60 text-sm mt-2">{t("admin.subtitle")}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-fit border border-silver/20 hover:border-red-400 hover:text-red-400 text-silver/60 px-5 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
          >
            Log Out
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-silver/10 mb-8 space-x-8 rtl:space-x-reverse">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center space-x-2 rtl:space-x-reverse pb-4 text-sm uppercase tracking-widest font-semibold transition-colors ${
              activeTab === "projects" ? "text-gold border-b-2 border-gold" : "text-silver/50 hover:text-gold"
            }`}
          >
            <SlidersHorizontal size={16} />
            <span>{t("admin.projectsTab")}</span>
          </button>

          <button
            onClick={() => setActiveTab("collections")}
            className={`flex items-center space-x-2 rtl:space-x-reverse pb-4 text-sm uppercase tracking-widest font-semibold transition-colors ${
              activeTab === "collections" ? "text-gold border-b-2 border-gold" : "text-silver/50 hover:text-gold"
            }`}
          >
            <FolderOpen size={16} />
            <span>{t("admin.collectionsTab")}</span>
          </button>

          <button
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center space-x-2 rtl:space-x-reverse pb-4 text-sm uppercase tracking-widest font-semibold transition-colors ${
              activeTab === "inquiries" ? "text-gold border-b-2 border-gold" : "text-silver/50 hover:text-gold"
            }`}
          >
            <MessageSquare size={16} />
            <span>{t("admin.inquiriesTab")}</span>
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center space-x-2 rtl:space-x-reverse pb-4 text-sm uppercase tracking-widest font-semibold transition-colors ${
              activeTab === "testimonials" ? "text-gold border-b-2 border-gold" : "text-silver/50 hover:text-gold"
            }`}
          >
            <Star size={16} />
            <span>{t("admin.testimonialsTab")}</span>
          </button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center">
            <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
              Syncing digital archives...
            </span>
          </div>
        ) : (
          <>
            {/* PROJECTS TAB */}
            {activeTab === "projects" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-serif text-silver/60">
                    {projects.length} Total Masterpieces
                  </span>
                  <button
                    onClick={() => {
                      resetProjectForm();
                      setProjectFormOpen(true);
                    }}
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gold hover:bg-gold/90 text-ink-black px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                  >
                    <Plus size={14} />
                    <span>{t("admin.addProject")}</span>
                  </button>
                </div>

                {projectFormOpen && (
                  <div className="glass-panel p-8 rounded-lg border border-gold/15 mb-8 animate-fade-in-up">
                    <h2 className="font-serif text-2xl text-champagne mb-6">
                      {editingProjectId ? t("admin.editProject") : t("admin.addProject")}
                    </h2>
                    <form onSubmit={handleProjectSubmit} className="space-y-6">
                      {/* First row */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.slug")}</label>
                          <input
                            type="text"
                            required
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="e.g. onyx-sanctuary"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.category")}</label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          >
                            <option value="Interior" className="bg-deep-charcoal text-silver">Interior Design</option>
                            <option value="Furniture" className="bg-deep-charcoal text-silver">Furniture Collection</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.subCategory")}</label>
                          <input
                            type="text"
                            value={subCategory}
                            onChange={(e) => setSubCategory(e.target.value)}
                            placeholder="e.g. Residential, Table"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.collection")}</label>
                          <select
                            value={projectCollectionId}
                            onChange={(e) => setProjectCollectionId(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          >
                            <option value="" className="bg-deep-charcoal text-silver">-- None --</option>
                            {collections.map((col) => (
                              <option key={col.id} value={col.id} className="bg-deep-charcoal text-silver">
                                {col.nameEn} ({col.nameAr})
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Second row */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.roomType")}</label>
                          <input
                            type="text"
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            placeholder="e.g. Living Room (optional)"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.year")}</label>
                          <input
                            type="number"
                            required
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.price")}</label>
                          <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="USD (optional)"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.budget")}</label>
                          <input
                            type="text"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="e.g. Ultra-Luxury"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      {/* Image fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.images")}</label>
                          <input
                            type="text"
                            required
                            value={images}
                            onChange={(e) => setImages(e.target.value)}
                            placeholder="url1, url2"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.beforeImage")}</label>
                          <input
                            type="text"
                            value={beforeImage}
                            onChange={(e) => setBeforeImage(e.target.value)}
                            placeholder="Before image url"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.afterImage")}</label>
                          <input
                            type="text"
                            value={afterImage}
                            onChange={(e) => setAfterImage(e.target.value)}
                            placeholder="After image url"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      {/* Toggles */}
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <input
                          type="checkbox"
                          id="featuredCheckbox"
                          checked={featured}
                          onChange={(e) => setFeatured(e.target.checked)}
                          className="w-4 h-4 accent-gold"
                        />
                        <label htmlFor="featuredCheckbox" className="text-xs uppercase tracking-widest text-silver select-none">
                          {t("admin.form.featured")}
                        </label>
                      </div>

                      {/* Title rows */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.titleEn")}</label>
                          <input
                            type="text"
                            required
                            value={titleEn}
                            onChange={(e) => setTitleEn(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.titleAr")}</label>
                          <input
                            type="text"
                            required
                            value={titleAr}
                            onChange={(e) => setTitleAr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.titleTr")}</label>
                          <input
                            type="text"
                            required
                            value={titleTr}
                            onChange={(e) => setTitleTr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      {/* Locations & Materials */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.locEn")}</label>
                          <input
                            type="text"
                            required
                            value={locEn}
                            onChange={(e) => setLocEn(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.locAr")}</label>
                          <input
                            type="text"
                            required
                            value={locAr}
                            onChange={(e) => setLocAr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.locTr")}</label>
                          <input
                            type="text"
                            required
                            value={locTr}
                            onChange={(e) => setLocTr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      {/* Materials */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.matEn")}</label>
                          <input
                            type="text"
                            value={matEn}
                            onChange={(e) => setMatEn(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.matAr")}</label>
                          <input
                            type="text"
                            value={matAr}
                            onChange={(e) => setMatAr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.matTr")}</label>
                          <input
                            type="text"
                            value={matTr}
                            onChange={(e) => setMatTr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      {/* Styles */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.styleEn")}</label>
                          <input
                            type="text"
                            value={styleEn}
                            onChange={(e) => setStyleEn(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.styleAr")}</label>
                          <input
                            type="text"
                            value={styleAr}
                            onChange={(e) => setStyleAr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.styleTr")}</label>
                          <input
                            type="text"
                            value={styleTr}
                            onChange={(e) => setStyleTr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      {/* Descriptions */}
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.descEn")}</label>
                          <textarea
                            required
                            rows={3}
                            value={descEn}
                            onChange={(e) => setDescEn(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold resize-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.descAr")}</label>
                          <textarea
                            required
                            rows={3}
                            value={descAr}
                            onChange={(e) => setDescAr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold resize-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.descTr")}</label>
                          <textarea
                            required
                            rows={3}
                            value={descTr}
                            onChange={(e) => setDescTr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold resize-none"
                          />
                        </div>
                      </div>

                      {/* Custom Specs text area */}
                      <div className="flex flex-col space-y-2">
                        <label className="text-xs text-silver/70">Specifications JSON (optional)</label>
                        <textarea
                          rows={3}
                          value={specsText}
                          onChange={(e) => setSpecsText(e.target.value)}
                          placeholder='e.g. { "Area": "18,000 sq ft", "Bedrooms": "6" }'
                          className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver font-mono text-xs focus:outline-none focus:border-gold resize-none"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                        <button
                          type="submit"
                          className="bg-gold hover:bg-gold/90 text-ink-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                        >
                          {t("admin.form.save")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProjectFormOpen(false);
                            resetProjectForm();
                          }}
                          className="border border-silver/20 hover:border-silver text-silver px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                        >
                          {t("admin.form.cancel")}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Projects Table */}
                <div className="glass-panel rounded-lg overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-ink-black/40 border-b border-silver/10 text-xs uppercase tracking-wider text-silver/40">
                      <tr>
                        <th className="px-6 py-4 text-start">{t("admin.table.title")}</th>
                        <th className="px-6 py-4 text-start">{t("admin.table.category")}</th>
                        <th className="px-6 py-4 text-start">{t("admin.form.collection")}</th>
                        <th className="px-6 py-4 text-start">Year</th>
                        <th className="px-6 py-4 text-start">Price / Budget</th>
                        <th className="px-6 py-4 text-end">{t("admin.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-silver/5">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-deep-charcoal/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-champagne whitespace-nowrap">{p.titleEn}</td>
                          <td className="px-6 py-4 text-silver/65">{p.category}</td>
                          <td className="px-6 py-4 text-silver/65 font-serif italic text-gold/90">
                            {p.collection ? (language === "ar" ? p.collection.nameAr : language === "tr" ? p.collection.nameTr : p.collection.nameEn) : "--"}
                          </td>
                          <td className="px-6 py-4 text-silver/65">{p.year}</td>
                          <td className="px-6 py-4 text-gold/80 font-medium">
                            {p.price ? `$${parseFloat(p.price).toLocaleString()}` : p.budget || "Bespoke"}
                          </td>
                          <td className="px-6 py-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => handleEditProject(p)}
                              className="text-silver/60 hover:text-gold transition-colors p-1"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(p.id)}
                              className="text-silver/60 hover:text-red-400 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* COLLECTIONS TAB */}
            {activeTab === "collections" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-serif text-silver/60">
                    {collections.length} Total Collections
                  </span>
                  <button
                    onClick={() => {
                      resetCollectionForm();
                      setCollectionFormOpen(true);
                    }}
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gold hover:bg-gold/90 text-ink-black px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                  >
                    <Plus size={14} />
                    <span>{t("admin.addCollection")}</span>
                  </button>
                </div>

                {collectionFormOpen && (
                  <div className="glass-panel p-8 rounded-lg border border-gold/15 mb-8 animate-fade-in-up">
                    <h2 className="font-serif text-2xl text-champagne mb-6">
                      {editingCollectionId ? t("admin.editCollection") : t("admin.addCollection")}
                    </h2>
                    <form onSubmit={handleCollectionSubmit} className="space-y-6">
                      {/* Translation rows */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.nameEn")}</label>
                          <input
                            type="text"
                            required
                            value={collectionNameEn}
                            onChange={(e) => setCollectionNameEn(e.target.value)}
                            placeholder="e.g. Obsidian Gold Series"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.nameAr")}</label>
                          <input
                            type="text"
                            required
                            value={collectionNameAr}
                            onChange={(e) => setCollectionNameAr(e.target.value)}
                            placeholder="مثال: سلسلة الذهب البركاني"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.nameTr")}</label>
                          <input
                            type="text"
                            required
                            value={collectionNameTr}
                            onChange={(e) => setCollectionNameTr(e.target.value)}
                            placeholder="Örn: Obsidyen Altın Serisi"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                        <button
                          type="submit"
                          className="bg-gold hover:bg-gold/90 text-ink-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                        >
                          {t("admin.form.save")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCollectionFormOpen(false);
                            resetCollectionForm();
                          }}
                          className="border border-silver/20 hover:border-silver text-silver px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                        >
                          {t("admin.form.cancel")}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="glass-panel rounded-lg overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-ink-black/40 border-b border-silver/10 text-xs uppercase tracking-wider text-silver/40">
                      <tr>
                        <th className="px-6 py-4 text-start">{t("admin.table.name")} (En)</th>
                        <th className="px-6 py-4 text-start">{t("admin.table.name")} (Ar)</th>
                        <th className="px-6 py-4 text-start">{t("admin.table.name")} (Tr)</th>
                        <th className="px-6 py-4 text-start">Linked Projects</th>
                        <th className="px-6 py-4 text-end">{t("admin.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-silver/5">
                      {collections.map((col) => (
                        <tr key={col.id} className="hover:bg-deep-charcoal/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-champagne whitespace-nowrap">{col.nameEn}</td>
                          <td className="px-6 py-4 text-silver/65">{col.nameAr}</td>
                          <td className="px-6 py-4 text-silver/65">{col.nameTr}</td>
                          <td className="px-6 py-4 text-silver/65">{(col.projects || []).length} items</td>
                          <td className="px-6 py-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => handleEditCollection(col)}
                              className="text-silver/60 hover:text-gold transition-colors p-1"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCollection(col.id)}
                              className="text-silver/60 hover:text-red-400 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* INQUIRIES TAB */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <span className="text-sm font-serif text-silver/60">
                  {inquiries.length} Client Messages Received
                </span>

                <div className="glass-panel rounded-lg overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-ink-black/40 border-b border-silver/10 text-xs uppercase tracking-wider text-silver/40">
                      <tr>
                        <th className="px-6 py-4 text-start">{t("admin.table.sender")}</th>
                        <th className="px-6 py-4 text-start">Contact</th>
                        <th className="px-6 py-4 text-start">{t("admin.table.type")}</th>
                        <th className="px-6 py-4 text-start">{t("admin.table.message")}</th>
                        <th className="px-6 py-4 text-start">{t("admin.table.date")}</th>
                        <th className="px-6 py-4 text-end">{t("admin.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-silver/5">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-deep-charcoal/30 transition-colors align-top">
                          <td className="px-6 py-4 font-semibold text-champagne whitespace-nowrap">{inq.name}</td>
                          <td className="px-6 py-4 text-xs text-silver/70 space-y-1">
                            <p>{inq.email}</p>
                            {inq.phone && <p className="text-silver/40">{inq.phone}</p>}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="bg-gold/10 border border-gold/20 text-gold text-[10px] tracking-wider px-2 py-0.5 rounded uppercase font-semibold">
                              {inq.type}
                            </span>
                            {inq.details?.preferredDate && (
                              <p className="text-[10px] text-silver/40 mt-1">Date: {inq.details.preferredDate}</p>
                            )}
                            {inq.details?.projectName && (
                              <p className="text-[10px] text-silver/40 mt-1 truncate max-w-[120px]">Item: {inq.details.projectName}</p>
                            )}
                          </td>
                          <td className="px-6 py-4 text-silver/70 max-w-sm whitespace-normal text-xs leading-relaxed">
                            {inq.message}
                          </td>
                          <td className="px-6 py-4 text-xs text-silver/40 whitespace-nowrap">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-end whitespace-nowrap">
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="text-silver/60 hover:text-red-400 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TESTIMONIALS TAB */}
            {activeTab === "testimonials" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-serif text-silver/60">
                    {testimonials.length} Client Testimonials
                  </span>
                  <button
                    onClick={() => {
                      resetTestimonialForm();
                      setTestimonialFormOpen(true);
                    }}
                    className="inline-flex items-center space-x-2 rtl:space-x-reverse bg-gold hover:bg-gold/90 text-ink-black px-4 py-2 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                  >
                    <Plus size={14} />
                    <span>{t("admin.addTestimonial")}</span>
                  </button>
                </div>

                {testimonialFormOpen && (
                  <div className="glass-panel p-8 rounded-lg border border-gold/15 mb-8 animate-fade-in-up">
                    <h2 className="font-serif text-2xl text-champagne mb-6">
                      {editingTestimonialId ? t("admin.editTestimonial") : t("admin.addTestimonial")}
                    </h2>
                    <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.author")}</label>
                          <input
                            type="text"
                            required
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            placeholder="e.g. Sarah Jenkins"
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">Category</label>
                          <select
                            value={testimonialCategory}
                            onChange={(e) => setTestimonialCategory(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          >
                            <option value="General" className="bg-deep-charcoal text-silver">General</option>
                            <option value="Interior" className="bg-deep-charcoal text-silver">Interior Design</option>
                            <option value="Furniture" className="bg-deep-charcoal text-silver">Furniture</option>
                          </select>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.rating")}</label>
                          <div className="flex items-center space-x-1 py-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                className="text-gold focus:outline-none"
                              >
                                <Star
                                  size={20}
                                  fill={star <= rating ? "currentColor" : "none"}
                                  className="transition-colors hover:scale-110"
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Quotes */}
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.quoteEn")}</label>
                          <textarea
                            required
                            rows={3}
                            value={quoteEn}
                            onChange={(e) => setQuoteEn(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold resize-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.quoteAr")}</label>
                          <textarea
                            required
                            rows={3}
                            value={quoteAr}
                            onChange={(e) => setQuoteAr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold resize-none"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.quoteTr")}</label>
                          <textarea
                            required
                            rows={3}
                            value={quoteTr}
                            onChange={(e) => setQuoteTr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold resize-none"
                          />
                        </div>
                      </div>

                      {/* Roles */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.roleEn")}</label>
                          <input
                            type="text"
                            required
                            value={roleEn}
                            onChange={(e) => setRoleEn(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.roleAr")}</label>
                          <input
                            type="text"
                            required
                            value={roleAr}
                            onChange={(e) => setRoleAr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                        <div className="flex flex-col space-y-2">
                          <label className="text-xs text-silver/70">{t("admin.form.roleTr")}</label>
                          <input
                            type="text"
                            required
                            value={roleTr}
                            onChange={(e) => setRoleTr(e.target.value)}
                            className="bg-ink-black/40 border border-silver/10 rounded px-4 py-2 text-silver text-sm focus:outline-none focus:border-gold"
                          />
                        </div>
                      </div>

                      <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                        <button
                          type="submit"
                          className="bg-gold hover:bg-gold/90 text-ink-black px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                        >
                          {t("admin.form.save")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTestimonialFormOpen(false);
                            resetTestimonialForm();
                          }}
                          className="border border-silver/20 hover:border-silver text-silver px-6 py-2.5 text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                        >
                          {t("admin.form.cancel")}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="glass-panel rounded-lg overflow-x-auto">
                  <table className="w-full text-sm text-start">
                    <thead className="bg-ink-black/40 border-b border-silver/10 text-xs uppercase tracking-wider text-silver/40">
                      <tr>
                        <th className="px-6 py-4 text-start">{t("admin.table.author")}</th>
                        <th className="px-6 py-4 text-start">Role</th>
                        <th className="px-6 py-4 text-start">{t("admin.table.rating")}</th>
                        <th className="px-6 py-4 text-start">Quote (En)</th>
                        <th className="px-6 py-4 text-end">{t("admin.table.actions")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-silver/5">
                      {testimonials.map((test) => (
                        <tr key={test.id} className="hover:bg-deep-charcoal/30 transition-colors">
                          <td className="px-6 py-4 font-semibold text-champagne whitespace-nowrap">{test.author}</td>
                          <td className="px-6 py-4 text-silver/65">{test.roleEn}</td>
                          <td className="px-6 py-4 text-silver/65">
                            <div className="flex items-center space-x-0.5 text-gold">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <Star
                                  key={idx}
                                  size={14}
                                  fill={idx < (test.rating || 5) ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-silver/65 max-w-xs truncate">{test.quoteEn}</td>
                          <td className="px-6 py-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                            <button
                              onClick={() => handleEditTestimonial(test)}
                              className="text-silver/60 hover:text-gold transition-colors p-1"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteTestimonial(test.id)}
                              className="text-silver/60 hover:text-red-400 transition-colors p-1"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
