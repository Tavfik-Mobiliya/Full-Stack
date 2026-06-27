"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { apiProducts, apiTestimonials, apiInquiries, apiAuth, apiCollections, apiDeals } from "@/utils/api";
import { Collection, CollectionPayload, Deal, DealPayload, Inquiry, Product, ProductPayload, Testimonial, TestimonialPayload } from "@/types/api";
import { Plus, Edit, Trash2, SlidersHorizontal, MessageSquare, Star, FolderOpen, Briefcase, LogOut, Menu, X, ArrowLeft, Sun, Moon, Upload } from "lucide-react";

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
}

function getDetailString(details: Record<string, unknown> | null | undefined, key: string): string {
  const value = details?.[key];
  return typeof value === "string" ? value : "";
}

export default function AdminPage() {
  const { language, t, theme, setTheme } = useLanguage();
  const [activeTab, setActiveTab] = useState<"projects" | "deals" | "collections" | "inquiries" | "testimonials">("projects");

  // Auth states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Data lists
  const [projects, setProjects] = useState<Product[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Form states (Projects)
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Interior");
  const [roomType, setRoomType] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [price, setPrice] = useState("");
  const [budget, setBudget] = useState("Premium");
  const [images, setImages] = useState("");
  const [beforeImage, setBeforeImage] = useState("");
  const [afterImage, setAfterImage] = useState("");
  const [uploadingField, setUploadingField] = useState<"main" | "before" | "after" | null>(null);
  const [dealUploadingField, setDealUploadingField] = useState<"cover" | "images" | null>(null);
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

  // Form states (Deals)
  const [dealFormOpen, setDealFormOpen] = useState(false);
  const [editingDealId, setEditingDealId] = useState<number | null>(null);
  const [dealSlug, setDealSlug] = useState("");
  const [dealClientName, setDealClientName] = useState("");
  const [dealCoverImage, setDealCoverImage] = useState("");
  const [dealImages, setDealImages] = useState("");
  const [dealYear, setDealYear] = useState(new Date().getFullYear().toString());
  const [dealStatus, setDealStatus] = useState("Completed");
  const [dealFeatured, setDealFeatured] = useState(false);
  const [dealTitleEn, setDealTitleEn] = useState("");
  const [dealTitleAr, setDealTitleAr] = useState("");
  const [dealTitleTr, setDealTitleTr] = useState("");
  const [dealDescEn, setDealDescEn] = useState("");
  const [dealDescAr, setDealDescAr] = useState("");
  const [dealDescTr, setDealDescTr] = useState("");
  const [dealProductIds, setDealProductIds] = useState<number[]>([]);

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
      const projs = await apiProducts.getAll();
      setProjects(projs);
      const dl = await apiDeals.getAll();
      setDeals(dl);
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
    } catch (err: unknown) {
      setAuthError(getErrorMessage(err, "Failed to sign in. Please check credentials."));
    } finally {
      setSubmittingAuth(false);
    }
  };

  const handleLogout = async () => {
    await apiAuth.logout();
    setIsLoggedIn(false);
    setProjects([]);
    setDeals([]);
    setInquiries([]);
    setTestimonials([]);
  };

  // Project Submit Handler
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Explicit JS validation (replaces silent browser native required) ---
    const missing: string[] = [];
    if (!slug.trim())      missing.push("Slug");
    if (!images.trim())    missing.push("Images (at least one URL)");
    if (!titleEn.trim())   missing.push("Title (English)");
    if (!titleAr.trim())   missing.push("Title (Arabic)");
    if (!titleTr.trim())   missing.push("Title (Turkish)");
    if (!descEn.trim())    missing.push("Description (English)");
    if (!descAr.trim())    missing.push("Description (Arabic)");
    if (!descTr.trim())    missing.push("Description (Turkish)");
    if (!locEn.trim())     missing.push("Location (English)");
    if (!locAr.trim())     missing.push("Location (Arabic)");
    if (!locTr.trim())     missing.push("Location (Turkish)");
    if (!year || isNaN(parseInt(year))) missing.push("Year");
    if (missing.length > 0) {
      alert(`Please fill in the following required fields before saving:\n\n• ${missing.join("\n• ")}`);
      return;
    }

    // --- Parse optional JSON specs ---
    let parsedSpecs: Record<string, unknown> = {};
    try {
      if (specsText.trim()) {
        parsedSpecs = JSON.parse(specsText);
      }
    } catch {
      alert("Invalid JSON format in Specs field. E.g. {\"Area\": \"1200 sq ft\"}");
      return;
    }

    const isFurniture = category === "Furniture";
    const payload: ProductPayload = {
      slug,
      category,
      roomType: roomType || null,
      year: parseInt(year),
      price: isFurniture ? (price ? parseFloat(price) : null) : null,
      budget: isFurniture ? null : (budget || null),
      images: images.split(",").map((img) => img.trim()).filter(Boolean),
      beforeImage: isFurniture ? null : (beforeImage || null),
      afterImage: isFurniture ? null : (afterImage || null),
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
        await apiProducts.update(editingProjectId, payload);
      } else {
        await apiProducts.create(payload);
      }
      setProjectFormOpen(false);
      resetProjectForm();
      loadDashboardData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to submit project."));
    }
  };

  const handleEditProject = (p: Product) => {
    setEditingProjectId(p.id);
    setSlug(p.slug);
    setCategory(p.category);
    setRoomType(p.roomType || "");
    setYear(p.year.toString());
    setPrice(p.price ? p.price.toString() : "");
    setBudget(p.budget || "Premium");
    setImages(p.images ? p.images.join(", ") : "");
    setBeforeImage(p.beforeImage || "");
    setAfterImage(p.afterImage || "");
    setFeatured(Boolean(p.featured));
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
      await apiProducts.delete(id);
      loadDashboardData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to delete project"));
    }
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "Failed to upload image");
    }

    const data = await res.json();
    return data.url;
  };

  const handleMainImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingField("main");
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await handleFileUpload(files[i]);
        uploadedUrls.push(url);
      }
      
      const currentImages = images.trim();
      if (currentImages) {
        setImages(currentImages + ", " + uploadedUrls.join(", "));
      } else {
        setImages(uploadedUrls.join(", "));
      }
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to upload images."));
    } finally {
      setUploadingField(null);
    }
  };

  const handleBeforeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField("before");
    try {
      const url = await handleFileUpload(file);
      setBeforeImage(url);
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to upload before image."));
    } finally {
      setUploadingField(null);
    }
  };

  const handleDealCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDealUploadingField("cover");
    try {
      const url = await handleFileUpload(file);
      setDealCoverImage(url);
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to upload cover image."));
    } finally {
      setDealUploadingField(null);
    }
  };

  const handleDealImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setDealUploadingField("images");
    try {
      const uploadedUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await handleFileUpload(files[i]);
        uploadedUrls.push(url);
      }

      const currentImages = dealImages.trim();
      if (currentImages) {
        setDealImages(currentImages + ", " + uploadedUrls.join(", "));
      } else {
        setDealImages(uploadedUrls.join(", "));
      }
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to upload images."));
    } finally {
      setDealUploadingField(null);
    }
  };

  const handleAfterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField("after");
    try {
      const url = await handleFileUpload(file);
      setAfterImage(url);
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to upload after image."));
    } finally {
      setUploadingField(null);
    }
  };

  const resetProjectForm = () => {
    setEditingProjectId(null);
    setSlug("");
    setCategory("Interior");
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
    const payload: TestimonialPayload = {
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
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to submit testimonial."));
    }
  };

  const handleEditTestimonial = (tObj: Testimonial) => {
    setEditingTestimonialId(tObj.id);
    setAuthor(tObj.author);
    setTestimonialCategory(tObj.category || "General");
    setRating(tObj.rating || 5);
    setQuoteEn(tObj.quoteEn);
    setQuoteAr(tObj.quoteAr);
    setQuoteTr(tObj.quoteTr);
    setRoleEn(tObj.roleEn);
    setRoleAr(tObj.roleAr);
    setRoleTr(tObj.roleTr);
    setTestimonialFormOpen(true);
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await apiTestimonials.delete(id);
      loadDashboardData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to delete testimonial"));
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
    const payload: CollectionPayload = {
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
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to submit collection."));
    }
  };

  const handleEditCollection = (c: Collection) => {
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
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to delete collection"));
    }
  };

  const resetCollectionForm = () => {
    setEditingCollectionId(null);
    setCollectionNameEn("");
    setCollectionNameAr("");
    setCollectionNameTr("");
  };

  // Deal CRUD Handlers
  const handleDealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missing: string[] = [];
    if (!dealSlug.trim()) missing.push("Slug");
    if (!dealTitleEn.trim()) missing.push("Title (English)");
    if (!dealTitleAr.trim()) missing.push("Title (Arabic)");
    if (!dealTitleTr.trim()) missing.push("Title (Turkish)");
    if (!dealDescEn.trim()) missing.push("Description (English)");
    if (!dealDescAr.trim()) missing.push("Description (Arabic)");
    if (!dealDescTr.trim()) missing.push("Description (Turkish)");
    if (!dealYear || isNaN(parseInt(dealYear))) missing.push("Year");
    if (missing.length > 0) {
      alert(`Please fill in the following required fields:\n\n• ${missing.join("\n• ")}`);
      return;
    }

    const payload: DealPayload = {
      slug: dealSlug,
      clientName: dealClientName || null,
      coverImage: dealCoverImage || null,
      images: dealImages.split(",").map((img) => img.trim()).filter(Boolean),
      year: parseInt(dealYear),
      status: dealStatus,
      featured: dealFeatured,
      titleEn: dealTitleEn,
      titleAr: dealTitleAr,
      titleTr: dealTitleTr,
      descriptionEn: dealDescEn,
      descriptionAr: dealDescAr,
      descriptionTr: dealDescTr,
      productIds: dealProductIds,
    };

    try {
      if (editingDealId) {
        await apiDeals.update(editingDealId, payload);
      } else {
        await apiDeals.create(payload);
      }
      setDealFormOpen(false);
      resetDealForm();
      loadDashboardData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to submit deal project."));
    }
  };

  const handleEditDeal = (d: Deal) => {
    setEditingDealId(d.id);
    setDealSlug(d.slug);
    setDealClientName(d.clientName || "");
    setDealCoverImage(d.coverImage || "");
    setDealImages(d.images ? d.images.join(", ") : "");
    setDealYear(d.year.toString());
    setDealStatus(d.status);
    setDealFeatured(Boolean(d.featured));
    setDealTitleEn(d.titleEn);
    setDealTitleAr(d.titleAr);
    setDealTitleTr(d.titleTr);
    setDealDescEn(d.descriptionEn);
    setDealDescAr(d.descriptionAr);
    setDealDescTr(d.descriptionTr);
    setDealProductIds(d.products?.map((p) => p.product.id) || []);
    setDealFormOpen(true);
  };

  const handleDeleteDeal = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await apiDeals.delete(id);
      loadDashboardData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to delete deal project"));
    }
  };

  const resetDealForm = () => {
    setEditingDealId(null);
    setDealSlug("");
    setDealClientName("");
    setDealCoverImage("");
    setDealImages("");
    setDealUploadingField(null);
    setDealYear(new Date().getFullYear().toString());
    setDealStatus("Completed");
    setDealFeatured(false);
    setDealTitleEn("");
    setDealTitleAr("");
    setDealTitleTr("");
    setDealDescEn("");
    setDealDescAr("");
    setDealDescTr("");
    setDealProductIds([]);
  };

  // Inquiry Handler
  const handleDeleteInquiry = async (id: number) => {
    if (!confirm(t("admin.deleteConfirm"))) return;
    try {
      await apiInquiries.delete(id);
      loadDashboardData();
    } catch (err: unknown) {
      alert(getErrorMessage(err, "Failed to delete inquiry"));
    }
  };

  // 1. Loading Screen
  if (checkingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-background justify-center items-center">
        <span className="font-serif text-sm uppercase tracking-[0.3em] text-gold animate-pulse">
          Authenticating Curator Session...
        </span>
      </div>
    );
  }

  // 2. Login Screen
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-background">
        <header className="px-8 py-6 border-b border-outline-variant/30 flex justify-between items-center">
          <h1 className="font-serif text-lg uppercase tracking-widest text-primary">Tevfik Mobilya</h1>
          <div className="flex items-center gap-4">
            {/* Theme Toggler */}
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 text-on-surface-variant hover:text-gold transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link href="/" className="font-sans text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all flex items-center gap-1">
              <ArrowLeft size={14} /> Back to Showroom
            </Link>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-24 px-6">
          <div className="bg-surface-container-lowest p-8 md:p-12 border border-outline-variant/30 shadow-sm max-w-md w-full animate-fade-in-up rounded-none">
            <div className="text-center mb-8">
              <span className="text-[10px] uppercase tracking-[0.3em] text-gold font-semibold block mb-2">
                SECURE ARCHIVE
              </span>
              <h2 className="font-serif text-3xl text-on-surface font-bold">
                Curator Login
              </h2>
              <p className="text-on-surface-variant/70 text-xs mt-2">
                Authorized design personnel access only.
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
              {authError && (
                <div className="p-4 bg-error-container/40 border border-error/20 text-error text-xs rounded-none">
                  {authError}
                </div>
              )}
              
              <div className="flex flex-col space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                  placeholder="admin@tevfikmobilya.com"
                />
              </div>

              <div className="flex flex-col space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-on-surface-variant/70 font-semibold">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full inline-flex items-center justify-center bg-primary hover:opacity-90 text-on-primary py-4 px-6 rounded-none text-xs uppercase tracking-widest font-semibold transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span>{submittingAuth ? "Verifying..." : "Enter Atelier"}</span>
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // 3. Admin Main Panel
  return (
    <div className="bg-background text-on-background min-h-screen flex overflow-x-hidden font-sans">
      {/* Mobile Sidebar Toggle Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`w-72 bg-surface-container-lowest border-r border-outline-variant/30 h-screen flex flex-col fixed left-0 top-0 z-40 transition-transform duration-300 transform md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-8 py-10">
          <h1 className="font-serif text-xl uppercase tracking-widest text-primary">Tevfik Mobilya</h1>
          <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant mt-1 opacity-60">Admin Dashboard</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab("projects"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 text-start transition-all duration-300 rounded-none ${
              activeTab === "projects" ? "bg-surface-container border-r-2 border-primary text-primary font-medium" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            <SlidersHorizontal size={18} />
            <span className="text-sm font-semibold tracking-wider uppercase">{t("admin.projectsTab")}</span>
            <span className="ml-auto bg-surface-container-high text-[10px] px-2 py-0.5 font-bold text-on-surface-variant">{projects.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab("deals"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 text-start transition-all duration-300 rounded-none ${
              activeTab === "deals" ? "bg-surface-container border-r-2 border-primary text-primary font-medium" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            <Briefcase size={18} />
            <span className="text-sm font-semibold tracking-wider uppercase">{t("admin.dealsTab")}</span>
            <span className="ml-auto bg-surface-container-high text-[10px] px-2 py-0.5 font-bold text-on-surface-variant">{deals.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab("collections"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 text-start transition-all duration-300 rounded-none ${
              activeTab === "collections" ? "bg-surface-container border-r-2 border-primary text-primary font-medium" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            <FolderOpen size={18} />
            <span className="text-sm font-semibold tracking-wider uppercase">{t("admin.collectionsTab")}</span>
            <span className="ml-auto bg-surface-container-high text-[10px] px-2 py-0.5 font-bold text-on-surface-variant">{collections.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab("inquiries"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 text-start transition-all duration-300 rounded-none ${
              activeTab === "inquiries" ? "bg-surface-container border-r-2 border-primary text-primary font-medium" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            <MessageSquare size={18} />
            <span className="text-sm font-semibold tracking-wider uppercase">{t("admin.inquiriesTab")}</span>
            <span className="ml-auto bg-primary text-on-primary text-[10px] px-2 py-0.5 font-bold">{inquiries.length}</span>
          </button>

          <button
            onClick={() => { setActiveTab("testimonials"); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-4 px-4 py-3 text-start transition-all duration-300 rounded-none ${
              activeTab === "testimonials" ? "bg-surface-container border-r-2 border-primary text-primary font-medium" : "text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
            }`}
          >
            <Star size={18} />
            <span className="text-sm font-semibold tracking-wider uppercase">{t("admin.testimonialsTab")}</span>
            <span className="ml-auto bg-surface-container-high text-[10px] px-2 py-0.5 font-bold text-on-surface-variant">{testimonials.length}</span>
          </button>
        </nav>

        {/* Sidebar Footer Profiles */}
        <div className="p-8 border-t border-outline-variant/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30">
              <span className="font-serif text-sm font-bold text-primary">TM</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">Curator Administrator</p>
              <p className="text-[9px] text-on-surface-variant/60 uppercase tracking-widest">Active Session</p>
            </div>
            <button onClick={handleLogout} className="ml-auto text-on-surface-variant hover:text-primary transition-colors" title="Log Out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 ml-0 md:ml-72 min-h-screen overflow-y-auto flex flex-col bg-background">
        {/* Top Header Bar */}
        <header className="bg-surface-container-lowest/80 backdrop-blur-xl sticky top-0 z-30 w-full border-b border-outline-variant/30 px-8 md:px-12 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-primary" onClick={() => setSidebarOpen(true)}>
              <Menu size={20} />
            </button>
            <h2 className="font-serif text-xl md:text-2xl text-primary capitalize">
              {activeTab === "projects" && "Project Registry"}
              {activeTab === "deals" && "Deal Projects Registry"}
              {activeTab === "collections" && "Collection Registry"}
              {activeTab === "inquiries" && "Client Messages"}
              {activeTab === "testimonials" && "Testimonials Ledger"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Theme Toggler */}
            <button
              type="button"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 text-on-surface-variant hover:text-gold transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <Link href="/" className="hidden lg:inline-block font-sans text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all border-b border-transparent hover:border-primary pb-0.5">
              Showroom Page
            </Link>
            {activeTab !== "inquiries" && (
              <button
                onClick={() => {
                  if (activeTab === "projects") { resetProjectForm(); setProjectFormOpen(true); }
                  else if (activeTab === "deals") { resetDealForm(); setDealFormOpen(true); }
                  else if (activeTab === "collections") { resetCollectionForm(); setCollectionFormOpen(true); }
                  else if (activeTab === "testimonials") { resetTestimonialForm(); setTestimonialFormOpen(true); }
                }}
                className="bg-primary text-on-primary font-sans text-[10px] uppercase tracking-widest px-6 py-3 rounded-none hover:opacity-90 transition-all active:scale-95 flex items-center gap-2 font-semibold"
              >
                <Plus size={14} /> Add New {activeTab.slice(0, -1)}
              </button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 md:p-12 space-y-12 max-w-7xl w-full mx-auto flex-1">
          {/* Analytics Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 hover:border-gold/30 transition-all duration-500 group rounded-none">
              <div className="flex justify-between items-start mb-6">
                <Briefcase className="text-on-surface-variant group-hover:text-gold transition-colors" size={18} />
                <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest">Deals</span>
              </div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-2">Deal Projects</p>
              <h3 className="font-serif text-3xl text-primary">{deals.length}</h3>
            </div>

            <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 hover:border-gold/30 transition-all duration-500 group rounded-none">
              <div className="flex justify-between items-start mb-6">
                <SlidersHorizontal className="text-on-surface-variant group-hover:text-gold transition-colors" size={18} />
                <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest">Atelier</span>
              </div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-2">Total Products</p>
              <h3 className="font-serif text-3xl text-primary">{projects.length}</h3>
            </div>

            <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 hover:border-gold/30 transition-all duration-500 group rounded-none">
              <div className="flex justify-between items-start mb-6">
                <FolderOpen className="text-on-surface-variant group-hover:text-gold transition-colors" size={18} />
                <span className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest">Collections</span>
              </div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-2">Active Collections</p>
              <h3 className="font-serif text-3xl text-primary">{collections.length}</h3>
            </div>

            <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 hover:border-gold/30 transition-all duration-500 group rounded-none">
              <div className="flex justify-between items-start mb-6">
                <MessageSquare className="text-on-surface-variant group-hover:text-gold transition-colors" size={18} />
                <span className="text-[10px] text-gold font-medium uppercase tracking-widest">Inbox</span>
              </div>
              <p className="font-sans text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-2">Client Inquiries</p>
              <h3 className="font-serif text-3xl text-primary">{inquiries.length}</h3>
            </div>
          </section>

          {loading ? (
            <div className="py-24 text-center">
              <span className="text-xs uppercase tracking-[0.3em] text-gold animate-pulse">
                Syncing digital archives...
              </span>
            </div>
          ) : (
            <>
              {/* PROJECTS TAB */}
              {activeTab === "projects" && (
                <div className="space-y-8">
                  {projectFormOpen && (
                    <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 shadow-sm animate-fade-in-up rounded-none space-y-8">
                      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                        <h3 className="font-serif text-2xl text-primary">
                          {editingProjectId ? t("admin.editProject") : t("admin.addProject")}
                        </h3>
                        <button
                          type="button"
                          onClick={() => { setProjectFormOpen(false); resetProjectForm(); }}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleProjectSubmit} noValidate className="space-y-8">
                        {/* Section 1: Spatial Identity */}
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">1. Spatial Identity</span>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.slug")} *</label>
                              <input
                                type="text"
                                required
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="e.g. onyx-sanctuary"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.category")} *</label>
                              <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full cursor-pointer"
                              >
                                <option value="Interior" className="bg-surface-container text-on-surface">Interior Design</option>
                                <option value="Furniture" className="bg-surface-container text-on-surface">Furniture Collection</option>
                              </select>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.collection")}</label>
                              <select
                                value={projectCollectionId}
                                onChange={(e) => setProjectCollectionId(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full cursor-pointer"
                              >
                                <option value="" className="bg-surface-container text-on-surface">-- None --</option>
                                {collections.map((col) => (
                                  <option key={col.id} value={col.id} className="bg-surface-container text-on-surface">
                                    {col.nameEn} ({col.nameAr})
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Section 2: Logistics & Registry */}
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">2. Logistics & Registry</span>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.roomType")}</label>
                              <input
                                type="text"
                                value={roomType}
                                onChange={(e) => setRoomType(e.target.value)}
                                placeholder="e.g. Living Room, Kitchen"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.year")} *</label>
                              <input
                                type="number"
                                required
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            {category === "Furniture" && (
                              <div className="flex flex-col space-y-2">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.price")} ($)</label>
                                <input
                                  type="number"
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                  placeholder="e.g. 15000"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                                />
                              </div>
                            )}
                            {category === "Interior" && (
                              <div className="flex flex-col space-y-2">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.budget")}</label>
                                <input
                                  type="text"
                                  value={budget}
                                  onChange={(e) => setBudget(e.target.value)}
                                  placeholder="e.g. Premium"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                                />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Section 3: Photographic Records */}
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">3. Photographic Records</span>
                          <div className={`grid grid-cols-1 ${category === "Furniture" ? "md:grid-cols-1" : "md:grid-cols-3"} gap-6`}>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.images")} * (comma separated URLs)</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  required
                                  value={images}
                                  onChange={(e) => setImages(e.target.value)}
                                  placeholder="url1, url2"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none flex-1"
                                />
                                <label className="flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-all border border-outline-variant/30 select-none">
                                  <Upload size={14} />
                                  <span>{uploadingField === "main" ? "Uploading..." : "Upload"}</span>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleMainImagesUpload}
                                    className="hidden"
                                    disabled={uploadingField !== null}
                                  />
                                </label>
                              </div>
                            </div>
                            {category === "Interior" && (
                              <>
                                <div className="flex flex-col space-y-2">
                                  <label className="text-xs text-on-surface-variant">{t("admin.form.beforeImage")}</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={beforeImage}
                                      onChange={(e) => setBeforeImage(e.target.value)}
                                      placeholder="Before image URL"
                                      className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none flex-1"
                                    />
                                    <label className="flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-all border border-outline-variant/30 select-none">
                                      <Upload size={14} />
                                      <span>{uploadingField === "before" ? "Uploading..." : "Upload"}</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBeforeImageUpload}
                                        className="hidden"
                                        disabled={uploadingField !== null}
                                      />
                                    </label>
                                  </div>
                                </div>
                                <div className="flex flex-col space-y-2">
                                  <label className="text-xs text-on-surface-variant">{t("admin.form.afterImage")}</label>
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      value={afterImage}
                                      onChange={(e) => setAfterImage(e.target.value)}
                                      placeholder="After image URL"
                                      className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none flex-1"
                                    />
                                    <label className="flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-all border border-outline-variant/30 select-none">
                                      <Upload size={14} />
                                      <span>{uploadingField === "after" ? "Uploading..." : "Upload"}</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleAfterImageUpload}
                                        className="hidden"
                                        disabled={uploadingField !== null}
                                      />
                                    </label>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3 rtl:space-x-reverse select-none">
                            <input
                              type="checkbox"
                              id="featuredCheckbox"
                              checked={featured}
                              onChange={(e) => setFeatured(e.target.checked)}
                              className="w-4 h-4 accent-primary rounded-none"
                            />
                            <label htmlFor="featuredCheckbox" className="text-xs uppercase tracking-widest text-on-surface font-semibold cursor-pointer">
                              {t("admin.form.featured")}
                            </label>
                          </div>
                        </div>

                        {/* Section 4: Narrative Fields (English / Arabic / Turkish) */}
                        <div className="space-y-6 pt-4 border-t border-outline-variant/20">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">4. Narratives & Translations</span>
                          
                          {/* English */}
                          <div className="p-6 bg-surface-container-low/40 space-y-4">
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-primary">English (Global)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex flex-col space-y-2">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.titleEn")} *</label>
                                <input
                                  type="text"
                                  required
                                  value={titleEn}
                                  onChange={(e) => setTitleEn(e.target.value)}
                                  placeholder="e.g. Nocturne Credenza"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                                />
                              </div>
                              <div className="flex flex-col space-y-2">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.locEn")} *</label>
                                <input
                                  type="text"
                                  required
                                  value={locEn}
                                  onChange={(e) => setLocEn(e.target.value)}
                                  placeholder="e.g. Istanbul Atelier"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.descEn")} *</label>
                              <textarea
                                required
                                rows={3}
                                value={descEn}
                                onChange={(e) => setDescEn(e.target.value)}
                                placeholder="e.g. A masterful Walnut credenza with solid brass inlay detailing."
                                className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full"
                              />
                            </div>
                          </div>

                          {/* Arabic */}
                          <div className="p-6 bg-surface-container-low/40 space-y-4" dir="rtl">
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-primary text-start">العربية (Arabic)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex flex-col space-y-2 text-start">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.titleAr")} *</label>
                                <input
                                  type="text"
                                  required
                                  value={titleAr}
                                  onChange={(e) => setTitleAr(e.target.value)}
                                  placeholder="مثال: خزانة نوكتيرن"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full text-start"
                                />
                              </div>
                              <div className="flex flex-col space-y-2 text-start">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.locAr")} *</label>
                                <input
                                  type="text"
                                  required
                                  value={locAr}
                                  onChange={(e) => setLocAr(e.target.value)}
                                  placeholder="مثال: مشغل إسطنبول"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full text-start"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2 text-start">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.descAr")} *</label>
                              <textarea
                                required
                                rows={3}
                                value={descAr}
                                onChange={(e) => setDescAr(e.target.value)}
                                placeholder="مثال: خزانة تحفة فنية مصنوعة من خشب الجوز مع تفاصيل ترصيع من النحاس الصلب."
                                className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full text-start"
                              />
                            </div>
                          </div>

                          {/* Turkish */}
                          <div className="p-6 bg-surface-container-low/40 space-y-4">
                            <h4 className="text-xs uppercase tracking-wider font-semibold text-primary">Türkçe (Turkish)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex flex-col space-y-2">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.titleTr")} *</label>
                                <input
                                  type="text"
                                  required
                                  value={titleTr}
                                  onChange={(e) => setTitleTr(e.target.value)}
                                  placeholder="Örn: Nocturne Konsol"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                                />
                              </div>
                              <div className="flex flex-col space-y-2">
                                <label className="text-xs text-on-surface-variant">{t("admin.form.locTr")} *</label>
                                <input
                                  type="text"
                                  required
                                  value={locTr}
                                  onChange={(e) => setLocTr(e.target.value)}
                                  placeholder="Örn: İstanbul Atölyesi"
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.descTr")} *</label>
                              <textarea
                                required
                                rows={3}
                                value={descTr}
                                onChange={(e) => setDescTr(e.target.value)}
                                placeholder="Örn: Masif pirinç kakma detaylara sahip, ceviz ağacından yapılmış ustalık eseri bir konsol."
                                className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Section 5: Materials, Styles & Specs */}
                        <div className="space-y-4 pt-4 border-t border-outline-variant/20">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">5. Fine Atelier Details</span>
                          
                          {/* Materials En/Ar/Tr */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.matEn")} (En)</label>
                              <input
                                type="text"
                                value={matEn}
                                onChange={(e) => setMatEn(e.target.value)}
                                placeholder="e.g. Walnut & Marble"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.matAr")} (Ar)</label>
                              <input
                                type="text"
                                value={matAr}
                                onChange={(e) => setMatAr(e.target.value)}
                                placeholder="مثال: خشب الجوز والرخام"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.matTr")} (Tr)</label>
                              <input
                                type="text"
                                value={matTr}
                                onChange={(e) => setMatTr(e.target.value)}
                                placeholder="Örn: Ceviz ve Mermer"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                          </div>

                          {/* Styles En/Ar/Tr */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.styleEn")} (En)</label>
                              <input
                                type="text"
                                value={styleEn}
                                onChange={(e) => setStyleEn(e.target.value)}
                                placeholder="e.g. Mid-Century Minimalist"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.styleAr")} (Ar)</label>
                              <input
                                type="text"
                                value={styleAr}
                                onChange={(e) => setStyleAr(e.target.value)}
                                placeholder="مثال: بساطة منتصف القرن"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.styleTr")} (Tr)</label>
                              <input
                                type="text"
                                value={styleTr}
                                onChange={(e) => setStyleTr(e.target.value)}
                                placeholder="Örn: Yüzyıl Ortası Minimalist"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                          </div>

                          {/* Custom Specs JSON */}
                          <div className="flex flex-col space-y-2 pt-2">
                            <label className="text-xs text-on-surface-variant">Specifications JSON (optional)</label>
                            <textarea
                              rows={3}
                              value={specsText}
                              onChange={(e) => setSpecsText(e.target.value)}
                              placeholder='e.g. { "Area": "18,000 sq ft", "Bedrooms": "6" }'
                              className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface font-mono text-xs transition-all rounded-none resize-none w-full"
                            />
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-4 rtl:space-x-reverse pt-6 border-t border-outline-variant/20">
                          <button
                            type="submit"
                            className="bg-primary hover:opacity-90 text-on-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors cursor-pointer"
                          >
                            {t("admin.form.save")}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setProjectFormOpen(false); resetProjectForm(); }}
                            className="border border-outline/30 hover:border-primary text-on-surface-variant hover:text-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors"
                          >
                            {t("admin.form.cancel")}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Editorial Projects Registry Table */}
                  <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-4">
                    <table className="w-full text-start border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Cover</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.title")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.category")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.form.collection")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Year</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Price / Budget</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-end">{t("admin.table.actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {projects.map((p) => (
                          <tr key={p.id} className="group hover:bg-surface-container-lowest transition-all">
                            <td className="py-6 px-4 pr-4">
                              <div className="relative w-16 h-12 bg-surface-container overflow-hidden group-hover:scale-105 transition-transform duration-500 rounded-none border border-outline-variant/30">
                                <Image
                                  fill
                                  sizes="64px"
                                  className=""
                                  src={p.images?.[0]?.trim() || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=400"}
                                  alt={p.titleEn}
                                  style={{ objectFit: "cover" }}
                                />
                              </div>
                            </td>
                            <td className="py-6 px-4">
                              <p className="font-sans text-sm font-semibold text-primary">{p.titleEn}</p>
                              <p className="text-[11px] text-on-surface-variant/60 uppercase tracking-wider">{p.locationEn}</p>
                            </td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{p.category}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm italic font-serif text-gold">
                              {p.collection ? (language === "ar" ? p.collection.nameAr : language === "tr" ? p.collection.nameTr : p.collection.nameEn) : "--"}
                            </td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{p.year}</td>
                            <td className="py-6 px-4 text-sm font-medium">
                              {p.price ? `$${parseFloat(String(p.price)).toLocaleString()}` : p.budget || "Bespoke"}
                            </td>
                            <td className="py-6 px-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => handleEditProject(p)}
                                className="text-on-surface-variant hover:text-primary transition-colors p-1"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="text-on-surface-variant hover:text-error transition-colors p-1"
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

              {/* DEALS TAB */}
              {activeTab === "deals" && (
                <div className="space-y-8">
                  {dealFormOpen && (
                    <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 shadow-sm animate-fade-in-up rounded-none space-y-8">
                      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                        <h3 className="font-serif text-2xl text-primary">
                          {editingDealId ? t("admin.editDeal") : t("admin.addDeal")}
                        </h3>
                        <button
                          type="button"
                          onClick={() => { setDealFormOpen(false); resetDealForm(); }}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleDealSubmit} noValidate className="space-y-8">
                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">1. Project Identity</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.slug")} *</label>
                              <input
                                type="text"
                                required
                                value={dealSlug}
                                onChange={(e) => setDealSlug(e.target.value)}
                                placeholder="e.g. grand-bosphorus-residence"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.clientName")}</label>
                              <input
                                type="text"
                                value={dealClientName}
                                onChange={(e) => setDealClientName(e.target.value)}
                                placeholder="e.g. Al Shoumari Group"
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.year")} *</label>
                              <input
                                type="number"
                                required
                                value={dealYear}
                                onChange={(e) => setDealYear(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">2. Media & Status</span>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.coverImage")}</label>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={dealCoverImage}
                                  onChange={(e) => setDealCoverImage(e.target.value)}
                                  placeholder="https://..."
                                  className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none flex-1"
                                />
                                <label className="flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-all border border-outline-variant/30 select-none shrink-0">
                                  <Upload size={14} />
                                  <span>{dealUploadingField === "cover" ? "Uploading..." : "Upload"}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleDealCoverUpload}
                                    className="hidden"
                                    disabled={dealUploadingField !== null}
                                  />
                                </label>
                              </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.dealStatus")} *</label>
                              <select
                                value={dealStatus}
                                onChange={(e) => setDealStatus(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full cursor-pointer"
                              >
                                <option value="Completed" className="bg-surface-container text-on-surface">Completed</option>
                                <option value="In Progress" className="bg-surface-container text-on-surface">In Progress</option>
                                <option value="Upcoming" className="bg-surface-container text-on-surface">Upcoming</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.dealImages")}</label>
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={dealImages}
                                onChange={(e) => setDealImages(e.target.value)}
                                placeholder="https://..., https://..."
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none flex-1"
                              />
                              <label className="flex items-center gap-1 px-3 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold cursor-pointer transition-all border border-outline-variant/30 select-none shrink-0">
                                <Upload size={14} />
                                <span>{dealUploadingField === "images" ? "Uploading..." : "Upload"}</span>
                                <input
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  onChange={handleDealImagesUpload}
                                  className="hidden"
                                  disabled={dealUploadingField !== null}
                                />
                              </label>
                            </div>
                          </div>
                          <label className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer">
                            <input
                              type="checkbox"
                              checked={dealFeatured}
                              onChange={(e) => setDealFeatured(e.target.checked)}
                              className="accent-gold"
                            />
                            <span className="text-xs text-on-surface-variant">{t("admin.form.featured")}</span>
                          </label>
                        </div>

                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">3. Narratives & Translations</span>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.titleEn")} *</label>
                              <input
                                type="text"
                                required
                                value={dealTitleEn}
                                onChange={(e) => setDealTitleEn(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2" dir="rtl">
                              <label className="text-xs text-on-surface-variant text-start">{t("admin.form.titleAr")} *</label>
                              <input
                                type="text"
                                required
                                value={dealTitleAr}
                                onChange={(e) => setDealTitleAr(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full text-start"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.titleTr")} *</label>
                              <input
                                type="text"
                                required
                                value={dealTitleTr}
                                onChange={(e) => setDealTitleTr(e.target.value)}
                                className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.descEn")} *</label>
                              <textarea
                                required
                                rows={3}
                                value={dealDescEn}
                                onChange={(e) => setDealDescEn(e.target.value)}
                                className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full"
                              />
                            </div>
                            <div className="flex flex-col space-y-2" dir="rtl">
                              <label className="text-xs text-on-surface-variant text-start">{t("admin.form.descAr")} *</label>
                              <textarea
                                required
                                rows={3}
                                value={dealDescAr}
                                onChange={(e) => setDealDescAr(e.target.value)}
                                className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full text-start"
                              />
                            </div>
                            <div className="flex flex-col space-y-2">
                              <label className="text-xs text-on-surface-variant">{t("admin.form.descTr")} *</label>
                              <textarea
                                required
                                rows={3}
                                value={dealDescTr}
                                onChange={(e) => setDealDescTr(e.target.value)}
                                className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <span className="text-[10px] uppercase tracking-[0.25em] text-gold font-bold">4. Product Association</span>
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.selectProducts")}</label>
                            <div className="max-h-48 overflow-y-auto border border-outline-variant/30 p-3 space-y-2">
                              {projects.map((p) => (
                                <label key={p.id} className="flex items-center space-x-3 rtl:space-x-reverse cursor-pointer text-sm">
                                  <input
                                    type="checkbox"
                                    checked={dealProductIds.includes(p.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setDealProductIds([...dealProductIds, p.id]);
                                      } else {
                                        setDealProductIds(dealProductIds.filter((id) => id !== p.id));
                                      }
                                    }}
                                    className="accent-gold"
                                  />
                                  <span className="text-on-surface">{p.titleEn}</span>
                                  <span className="text-[10px] text-on-surface-variant/60 uppercase ml-auto">({p.category})</span>
                                </label>
                              ))}
                              {projects.length === 0 && (
                                <span className="text-xs text-on-surface-variant/50">No products available. Create products first.</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                          <button
                            type="submit"
                            className="bg-primary hover:opacity-90 text-on-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors cursor-pointer"
                          >
                            {t("admin.form.save")}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setDealFormOpen(false); resetDealForm(); }}
                            className="border border-outline/30 hover:border-primary text-on-surface-variant hover:text-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors"
                          >
                            {t("admin.form.cancel")}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Deals Table */}
                  <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-4">
                    <table className="w-full text-start border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Cover</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.title")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Client</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Year</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Status</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Products</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-end">{t("admin.table.actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {deals.map((deal) => (
                          <tr key={deal.id} className="group hover:bg-surface-container-lowest transition-all">
                            <td className="py-6 px-4">
                              <Image
                                src={deal.coverImage || deal.images[0] || "/placeholder.jpg"}
                                alt={deal.titleEn}
                                width={64}
                                height={40}
                                className="object-cover rounded"
                              />
                            </td>
                            <td className="py-6 px-4 font-sans text-sm font-semibold text-primary">{deal.titleEn}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{deal.clientName || "-"}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{deal.year}</td>
                            <td className="py-6 px-4">
                              <span className={`text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border ${
                                deal.status === "Completed" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                                deal.status === "In Progress" ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                                "bg-blue-500/10 border-blue-500/20 text-blue-400"
                              }`}>
                                {deal.status}
                              </span>
                            </td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{deal.products?.length || 0}</td>
                            <td className="py-6 px-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => handleEditDeal(deal)}
                                className="text-on-surface-variant hover:text-primary transition-colors p-1"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteDeal(deal.id)}
                                className="text-on-surface-variant hover:text-error transition-colors p-1"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {deals.length === 0 && (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-sm text-on-surface-variant/50">
                              No deal projects yet. Click &ldquo;Add New&rdquo; to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* COLLECTIONS TAB */}
              {activeTab === "collections" && (
                <div className="space-y-8">
                  {collectionFormOpen && (
                    <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 shadow-sm animate-fade-in-up rounded-none space-y-6">
                      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                        <h3 className="font-serif text-2xl text-primary">
                          {editingCollectionId ? t("admin.editCollection") : t("admin.addCollection")}
                        </h3>
                        <button
                          type="button"
                          onClick={() => { setCollectionFormOpen(false); resetCollectionForm(); }}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleCollectionSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.nameEn")} *</label>
                            <input
                              type="text"
                              required
                              value={collectionNameEn}
                              onChange={(e) => setCollectionNameEn(e.target.value)}
                              placeholder="e.g. Classic Luxury Series"
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                            />
                          </div>
                          <div className="flex flex-col space-y-2" dir="rtl">
                            <label className="text-xs text-on-surface-variant text-start">{t("admin.form.nameAr")} *</label>
                            <input
                              type="text"
                              required
                              value={collectionNameAr}
                              onChange={(e) => setCollectionNameAr(e.target.value)}
                              placeholder="مثال: سلسلة الفخامة الكلاسيكية"
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full text-start"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.nameTr")} *</label>
                            <input
                              type="text"
                              required
                              value={collectionNameTr}
                              onChange={(e) => setCollectionNameTr(e.target.value)}
                              placeholder="Örn: Klasik Lüks Serisi"
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                          <button
                            type="submit"
                            className="bg-primary hover:opacity-90 text-on-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors cursor-pointer"
                          >
                            {t("admin.form.save")}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setCollectionFormOpen(false); resetCollectionForm(); }}
                            className="border border-outline/30 hover:border-primary text-on-surface-variant hover:text-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors"
                          >
                            {t("admin.form.cancel")}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Collections Table */}
                  <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-4">
                    <table className="w-full text-start border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.name")} (En)</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.name")} (Ar)</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.name")} (Tr)</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Linked projects</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-end">{t("admin.table.actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {collections.map((col) => (
                          <tr key={col.id} className="group hover:bg-surface-container-lowest transition-all">
                            <td className="py-6 px-4 font-sans text-sm font-semibold text-primary">{col.nameEn}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{col.nameAr}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{col.nameTr}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm font-serif italic text-gold">{(col.products || []).length} items</td>
                            <td className="py-6 px-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => handleEditCollection(col)}
                                className="text-on-surface-variant hover:text-primary transition-colors p-1"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteCollection(col.id)}
                                className="text-on-surface-variant hover:text-error transition-colors p-1"
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
                <div className="space-y-8">
                  {/* Client Messages Table */}
                  <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-4">
                    <table className="w-full text-start border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.sender")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Contact info</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.type")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.message")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.date")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-end">{t("admin.table.actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {inquiries.map((inq) => (
                          <tr key={inq.id} className="group hover:bg-surface-container-lowest transition-all align-top">
                            <td className="py-6 px-4 font-sans text-sm font-semibold text-primary">{inq.name}</td>
                            <td className="py-6 px-4 text-xs text-on-surface-variant space-y-1">
                              <p className="font-semibold">{inq.email}</p>
                              {inq.phone && <p className="opacity-75">{inq.phone}</p>}
                            </td>
                            <td className="py-6 px-4 whitespace-nowrap">
                              {(() => {
                                const preferredDate = getDetailString(inq.details, "preferredDate");
                                const projectName = getDetailString(inq.details, "projectName");
                                return (
                                  <div className="space-y-1">
                                    <span className="inline-block bg-gold/10 border border-gold/20 text-gold text-[9px] tracking-widest px-2 py-0.5 rounded-none uppercase font-semibold">
                                      {inq.type}
                                    </span>
                                    {preferredDate && (
                                      <p className="text-[10px] text-on-surface-variant/50">Date: {preferredDate}</p>
                                    )}
                                    {projectName && (
                                      <p className="text-[10px] text-on-surface-variant/50 truncate max-w-[140px]">Project: {projectName}</p>
                                    )}
                                  </div>
                                );
                              })()}
                            </td>
                            <td className="py-6 px-4 text-on-surface-variant max-w-sm whitespace-normal text-xs leading-relaxed">
                              {inq.message}
                            </td>
                            <td className="py-6 px-4 text-xs text-on-surface-variant/60 whitespace-nowrap">
                              {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : "-"}
                            </td>
                            <td className="py-6 px-4 text-end whitespace-nowrap">
                              <button
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="text-on-surface-variant hover:text-error transition-colors p-1"
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
                <div className="space-y-8">
                  {testimonialFormOpen && (
                    <div className="bg-surface-container-lowest p-8 border border-outline-variant/30 shadow-sm animate-fade-in-up rounded-none space-y-6">
                      <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                        <h3 className="font-serif text-2xl text-primary">
                          {editingTestimonialId ? t("admin.editTestimonial") : t("admin.addTestimonial")}
                        </h3>
                        <button
                          type="button"
                          onClick={() => { setTestimonialFormOpen(false); resetTestimonialForm(); }}
                          className="text-on-surface-variant hover:text-primary transition-colors"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <form onSubmit={handleTestimonialSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.author")} *</label>
                            <input
                              type="text"
                              required
                              value={author}
                              onChange={(e) => setAuthor(e.target.value)}
                              placeholder="e.g. Sarah Jenkins"
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">Category</label>
                            <select
                              value={testimonialCategory}
                              onChange={(e) => setTestimonialCategory(e.target.value)}
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full cursor-pointer"
                            >
                              <option value="General" className="bg-surface-container text-on-surface">General</option>
                              <option value="Interior" className="bg-surface-container text-on-surface">Interior Design</option>
                              <option value="Furniture" className="bg-surface-container text-on-surface">Furniture</option>
                            </select>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.rating")} *</label>
                            <div className="flex items-center space-x-1 py-1">
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
                            <label className="text-xs text-on-surface-variant">{t("admin.form.quoteEn")} *</label>
                            <textarea
                              required
                              rows={2}
                              value={quoteEn}
                              onChange={(e) => setQuoteEn(e.target.value)}
                              className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full"
                            />
                          </div>
                          <div className="flex flex-col space-y-2" dir="rtl">
                            <label className="text-xs text-on-surface-variant text-start">{t("admin.form.quoteAr")} *</label>
                            <textarea
                              required
                              rows={2}
                              value={quoteAr}
                              onChange={(e) => setQuoteAr(e.target.value)}
                              className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full text-start"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.quoteTr")} *</label>
                            <textarea
                              required
                              rows={2}
                              value={quoteTr}
                              onChange={(e) => setQuoteTr(e.target.value)}
                              className="bg-transparent border border-outline-variant/40 focus:border-gold outline-none p-3 text-on-surface text-sm transition-all rounded-none resize-none w-full"
                            />
                          </div>
                        </div>

                        {/* Roles */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.roleEn")} *</label>
                            <input
                              type="text"
                              required
                              value={roleEn}
                              onChange={(e) => setRoleEn(e.target.value)}
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                            />
                          </div>
                          <div className="flex flex-col space-y-2" dir="rtl">
                            <label className="text-xs text-on-surface-variant text-start">{t("admin.form.roleAr")} *</label>
                            <input
                              type="text"
                              required
                              value={roleAr}
                              onChange={(e) => setRoleAr(e.target.value)}
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full text-start"
                            />
                          </div>
                          <div className="flex flex-col space-y-2">
                            <label className="text-xs text-on-surface-variant">{t("admin.form.roleTr")} *</label>
                            <input
                              type="text"
                              required
                              value={roleTr}
                              onChange={(e) => setRoleTr(e.target.value)}
                              className="bg-transparent border-b border-outline-variant/40 focus:border-gold outline-none py-2 px-1 text-on-surface text-sm transition-all rounded-none w-full"
                            />
                          </div>
                        </div>

                        <div className="flex space-x-4 rtl:space-x-reverse pt-4">
                          <button
                            type="submit"
                            className="bg-primary hover:opacity-90 text-on-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors cursor-pointer"
                          >
                            {t("admin.form.save")}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setTestimonialFormOpen(false); resetTestimonialForm(); }}
                            className="border border-outline/30 hover:border-primary text-on-surface-variant hover:text-primary px-8 py-3 text-xs uppercase tracking-widest font-semibold rounded-none transition-colors"
                          >
                            {t("admin.form.cancel")}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Testimonials Ledger Table */}
                  <div className="overflow-x-auto bg-surface-container-lowest border border-outline-variant/30 shadow-sm p-4">
                    <table className="w-full text-start border-collapse">
                      <thead>
                        <tr className="border-b border-outline-variant/30">
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.author")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Role</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">{t("admin.table.rating")}</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-start">Quote (En)</th>
                          <th className="pb-6 px-4 font-sans text-xs uppercase tracking-widest text-on-surface-variant/60 font-semibold text-end">{t("admin.table.actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {testimonials.map((test) => (
                          <tr key={test.id} className="group hover:bg-surface-container-lowest transition-all">
                            <td className="py-6 px-4 font-sans text-sm font-semibold text-primary">{test.author}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">{test.roleEn}</td>
                            <td className="py-6 px-4 text-on-surface-variant text-sm">
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
                            <td className="py-6 px-4 text-on-surface-variant text-xs max-w-xs truncate leading-relaxed">{test.quoteEn}</td>
                            <td className="py-6 px-4 text-end whitespace-nowrap space-x-2 rtl:space-x-reverse">
                              <button
                                onClick={() => handleEditTestimonial(test)}
                                className="text-on-surface-variant hover:text-primary transition-colors p-1"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(test.id)}
                                className="text-on-surface-variant hover:text-error transition-colors p-1"
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
        </div>

        {/* Footer */}
        <footer className="bg-surface-container-lowest border-t border-outline-variant/30 mt-12 py-10 px-12">
          <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6">
            <span className="text-xs text-on-surface-variant/60 font-sans tracking-widest uppercase">
              © {new Date().getFullYear()} TEVFIK MOBILYA. ALL RIGHTS RESERVED.
            </span>
            <div className="flex gap-8 text-[11px] font-sans uppercase tracking-widest font-semibold text-on-surface-variant/70">
              <a href="#" className="hover:text-primary transition-colors">Press Room</a>
              <a href="#" className="hover:text-primary transition-colors">Atelier Support</a>
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
