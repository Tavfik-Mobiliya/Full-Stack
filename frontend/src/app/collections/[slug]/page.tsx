"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { apiProjects, apiInquiries } from "@/utils/api";
import { getLocalized } from "@/utils/localize";
import { Project } from "@/types/api";
import { ArrowLeft, Send, Check, Download, ArrowRight, Sparkles } from "lucide-react";

interface FinishOption {
  name: string;
  desc: string;
}

interface SeriesFragment {
  name: string;
  material: string;
  price: string;
  img: string;
}

// Trilingual static translations for the Obsidian Series details
const obsidianTranslations = {
  en: {
    seriesNo: "Series No. 04",
    discover: "Discover The Origin",
    narrativeTitle: "Eternal Textures, Primal Forms.",
    narrativeP1: "The Obsidian Series emerges from a fascination with the immutable. We sought to capture the frozen energy of volcanic rock—the moment liquid fire meets cold air and turns into eternal architecture.",
    narrativeP2: "Each piece is an invitation to touch the primitive. In an age of ephemeral digital noise, these forms provide a heavy, silent anchor. They do not just occupy space; they define it through sheer presence and the play of light across hand-carved facets.",
    techSpecs: "Technical Specifications",
    elementsTitle: "The Elements",
    elements: ["Volcanic Basalt", "Aged European Oak", "Burnished Brass"],
    artisanryTitle: "Artisanry",
    artisanryDesc: "Every edge is hand-chiseled by master stone masons in our nocturnal atelier. The process takes forty-eight hours of precision work to achieve the 'Shattered Silk' finish unique to this series.",
    finishesTitle: "Finishes",
    finishes: [
      { name: "Matte", desc: "Matte" },
      { name: "Polished", desc: "Polished" },
      { name: "Brushed", desc: "Brushed" }
    ],
    spatialTitle: "Spatial Context",
    caseStudy1: "Case Study 01",
    caseStudy1Title: "The Obsidian Loft, Tokyo",
    caseStudy2: "Case Study 02",
    caseStudy2Title: "Solitude Residence",
    catalogTitle: "The Catalog",
    catalogSubtitle: "Series Fragments",
    pricingGuide: "View Full Pricing Guide",
    fragments: [
      {
        name: "Monolith Console",
        material: "Basalt & Brass",
        price: "From $12,400",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR9g4M2rIHD0i_WtNaNpl2sx2WHKcm__5TMM8vGlr4BeeXgP5Sy4EMPg99n9XwnKcmneJt5ufS654c73AICNMSBK3OvRfYZH-_7uxPdwAYr4uGCWNtYBzMtqqflayGRMOhJcwKvhTvbr1EvrP46sqqeAlCZQ3A034njQI955J5hLSsf2ESeZh0aX7rvMK_oRdFe4i_4TWGW9t8ka2fPypEykTGL7N-8HpTgxiA39Zh5qFkTvYhZEfx2Q1le9GDjcRFEwButRLWNUbd"
      },
      {
        name: "Void Coffee Table",
        material: "Hand-Carved Basalt",
        price: "From $8,800",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM4nFz27wxUUSq_6ysDFp3nACdGwJvwPGWbl6uBhBHQhmDYvaa1wnXixqDo6RYYcJGUnEehaOXjrVpLsg-FAIi4-D4Y5Wxpj8w5HbcRUW87DvHVU-nweZRxZjwHNUbfO4iMQBUdY1UJGyaLiwKLH3W4MAYuu9UI3QXETFTTqkbOg3pCMjl15_YEG3TmpS17_1fPv4qjneW-AL8zemEj4CjhaaWE-3VOqeGU34XNzd8UKKOsli06c-pHgKsDbCOpe1C8TcjS4nkIfFL"
      },
      {
        name: "Nocturne Dining Chair",
        material: "Aged Oak & Basalt",
        price: "From $3,200",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUwc2RIVLbxTI4CC4hcfcB5y2oXzDpbm25tl8pG6fHM6lcTCgjhdBnBCvppYyeGBwN_7oqfJj1tZipxlJc9iS5v4S_Hrm47-vIPDFdNG-q6fCg29gNvco4ZtrxGjEgPblQIGoDA3WmFhgr-MLO2V8h9NLx4_wr5qggk0yhoLcKRhCq8GrAKBB_DWskI1P5jysvyYb9VhaYTlE372KnkjVw6UIHu-xSVKNdm81g4X1Zfns5ClUGErhwUfI5e-6NExKLzcTypfU3_lRT"
      },
      {
        name: "Primal Sconce",
        material: "Obsidian & Gold Leaf",
        price: "From $2,100",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxaOY7V8eQeRHQLsqzrRHuisAWlLSnE9h1WtYie_tY_qJc4Q2iXtkKXV439gnNDPW6RFiZT9jgKhgSW8VVTSLQmP2t0We3L3Sw7xuVGJVJ0JY8sU8Rd737aR5RelM9SketHps8ttPoCGhiiO2Mq2q3SS73m2nlZ15bBPN30Qe0v5bUslVuVPdHkXN7j2iQ76Zbv9Wfi2mJAJqVfF82Ibreeo8Bp0S2RPaxDylLB_fM4wsc4JYT9rx8bxxdGeWI7Gx0dFX6Rrvvd0fo"
      }
    ],
    ctaTitle: "Elevate your sanctuary with the weight of eternity.",
    ctaConsultation: "Request a Consultation",
    ctaDownload: "Download Series PDF",
    inquiryPrompt: "I want to inquire about the Obsidian Series",
    inquirySubprompt: "Connect with our showroom concierges to request physical material samples, customization options, or catalog details."
  },
  ar: {
    seriesNo: "سلسلة رقم 04",
    discover: "اكتشف الأصل",
    narrativeTitle: "قوام أبدي، أشكال بدائية.",
    narrativeP1: "تنبثق سلسلة أوبسيديان من الافتتان بالخلود. لقد سعينا لالتقاط الطاقة المتجمدة للصخور البركانية - تلك اللحظة التي تلتقي فيها النار السائلة بالهواء البارد وتتحول إلى بنية أبدية.",
    narrativeP2: "كل قطعة هي دعوة للمس البدائي. في عصر الضوضاء الرقمية الزائلة، توفر هذه الأشكال مرساة ثقيلة وصامتة. إنها لا تشغل مساحة فحسب؛ بل تحددها من خلال حضورها الخالص ولعبة الضوء عبر الأسطح المنحوتة يدويًا.",
    techSpecs: "المواصفات الفنية",
    elementsTitle: "العناصر",
    elements: ["البازلت البركاني", "البلوط الأوروبي المعتق", "النحاس المصقول"],
    artisanryTitle: "الحرفية الفنية",
    artisanryDesc: "يتم نحت كل حافة يدويًا بواسطة معلمي نحت الحجر في مشغلنا الليلي. تستغرق العملية ثماني وأربعين ساعة من العمل الدقيق لتحقيق تشطيب 'الحرير المحطم' الفريد لهذه السلسلة.",
    finishesTitle: "التشطيبات",
    finishes: [
      { name: "مطفأ", desc: "Matte" },
      { name: "مصقول", desc: "Polished" },
      { name: "مفرش", desc: "Brushed" }
    ],
    spatialTitle: "السياق المكاني",
    caseStudy1: "دراسة حالة 01",
    caseStudy1Title: "لوفت أوبسيديان، طوكيو",
    caseStudy2: "دراسة حالة 02",
    caseStudy2Title: "سكن العزلة",
    catalogTitle: "الكتالوج",
    catalogSubtitle: "شظايا السلسلة",
    pricingGuide: "عرض دليل الأسعار الكامل",
    fragments: [
      {
        name: "طاولة الكونسول الأحادية",
        material: "البازلت والنحاس",
        price: "تبدأ من 12,400$",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR9g4M2rIHD0i_WtNaNpl2sx2WHKcm__5TMM8vGlr4BeeXgP5Sy4EMPg99n9XwnKcmneJt5ufS654c73AICNMSBK3OvRfYZH-_7uxPdwAYr4uGCWNtYBzMtqqflayGRMOhJcwKvhTvbr1EvrP46sqqeAlCZQ3A034njQI955J5hLSsf2ESeZh0aX7rvMK_oRdFe4i_4TWGW9t8ka2fPypEykTGL7N-8HpTgxiA39Zh5qFkTvYhZEfx2Q1le9GDjcRFEwButRLWNUbd"
      },
      {
        name: "طاولة قهوة الفراغ",
        material: "بازلت منحوت يدويًا",
        price: "تبدأ من 8,800$",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM4nFz27wxUUSq_6ysDFp3nACdGwJvwPGWbl6uBhBHQhmDYvaa1wnXixqDo6RYYcJGUnEehaOXjrVpLsg-FAIi4-D4Y5Wxpj8w5HbcRUW87DvHVU-nweZRxZjwHNUbfO4iMQBUdY1UJGyaLiwKLH3W4MAYuu9UI3QXETFTTqkbOg3pCMjl15_YEG3TmpS17_1fPv4qjneW-AL8zemEj4CjhaaWE-3VOqeGU34XNzd8UKKOsli06c-pHgKsDbCOpe1C8TcjS4nkIfFL"
      },
      {
        name: "كرسي طعام نوكتورن",
        material: "البلوط المعتق والبازلت",
        price: "تبدأ من 3,200$",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUwc2RIVLbxTI4CC4hcfcB5y2oXzDpbm25tl8pG6fHM6lcTCgjhdBnBCvppYyeGBwN_7oqfJj1tZipxlJc9iS5v4S_Hrm47-vIPDFdNG-q6fCg29gNvco4ZtrxGjEgPblQIGoDA3WmFhgr-MLO2V8h9NLx4_wr5qggk0yhoLcKRhCq8GrAKBB_DWskI1P5jysvyYb9VhaYTlE372KnkjVw6UIHu-xSVKNdm81g4X1Zfns5ClUGErhwUfI5e-6NExKLzcTypfU3_lRT"
      },
      {
        name: "مصباح الحائط البدائي",
        material: "أوبسيديان وورق الذهب",
        price: "تبدأ من 2,100$",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxaOY7V8eQeRHQLsqzrRHuisAWlLSnE9h1WtYie_tY_qJc4Q2iXtkKXV439gnNDPW6RFiZT9jgKhgSW8VVTSLQmP2t0We3L3Sw7xuVGJVJ0JY8sU8Rd737aR5RelM9SketHps8ttPoCGhiiO2Mq2q3SS73m2nlZ15bBPN30Qe0v5bUslVuVPdHkXN7j2iQ76Zbv9Wfi2mJAJqVfF82Ibreeo8Bp0S2RPaxDylLB_fM4wsc4JYT9rx8bxxdGeWI7Gx0dFX6Rrvvd0fo"
      }
    ],
    ctaTitle: "ارتقِ بملاذك بثقل الأبدية.",
    ctaConsultation: "طلب استشارة",
    ctaDownload: "تحميل ملف PDF للسلسلة",
    inquiryPrompt: "أود الاستفسار عن سلسلة أوبسيديان",
    inquirySubprompt: "تواصل مع موظفي الاستقبال في صالة العرض لدينا لطلب عينات المواد المادية، أو خيارات التخصيص، أو تفاصيل الكتالوج."
  },
  tr: {
    seriesNo: "Seri No. 04",
    discover: "Kökeni Keşfedin",
    narrativeTitle: "Sonsuz Dokular, İlkel Formlar.",
    narrativeP1: "Obsidian Serisi, değişmeze duyulan hayranlıktan doğuyor. Volkanik kayanın donmuş enerjisini - sıvı ateşin soğuk havayla karşılaşıp sonsuz mimariye dönüştüğü anı yakalamaya çalıştık.",
    narrativeP2: "Her parça ilkel olana dokunmak için bir davettir. Geçici dijital gürültü çağında, bu formlar ağır, sessiz bir çıpa sağlar. Sadece mekanı işgal etmezler; saf varoluşları ve el oyması yüzeylerindeki ışık oyunlarıyla onu tanımlarlar.",
    techSpecs: "Teknik Özellikler",
    elementsTitle: "Elementler",
    elements: ["Volkanik Bazalt", "Eskitilmiş Avrupa Meşesi", "Yanık Pirinç"],
    artisanryTitle: "Zanaatkarlık",
    artisanryDesc: "Her kenar, gece atölyemizde usta taş ustaları tarafından elle yontulmuştur. Bu seriye özgü 'Parçalanmış İpek' yüzeyini elde etmek kırk sekiz saatlik hassas bir çalışma gerektirir.",
    finishesTitle: "Yüzeyler",
    finishes: [
      { name: "Mat", desc: "Matte" },
      { name: "Parlak", desc: "Polished" },
      { name: "Fırçalanmış", desc: "Brushed" }
    ],
    spatialTitle: "Mekansal Bağlam",
    caseStudy1: "Örnek Olay 01",
    caseStudy1Title: "Obsidian Çatı Katı, Tokyo",
    caseStudy2: "Örnek Olay 02",
    caseStudy2Title: "Solitude Rezidansı",
    catalogTitle: "Katalog",
    catalogSubtitle: "Seri Parçaları",
    pricingGuide: "Tam Fiyatlandırma Kılavuzunu Görüntüle",
    fragments: [
      {
        name: "Monolith Konsol",
        material: "Bazalt ve Pirinç",
        price: "$12.400'dan başlayan fiyatlarla",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBR9g4M2rIHD0i_WtNaNpl2sx2WHKcm__5TMM8vGlr4BeeXgP5Sy4EMPg99n9XwnKcmneJt5ufS654c73AICNMSBK3OvRfYZH-_7uxPdwAYr4uGCWNtYBzMtqqflayGRMOhJcwKvhTvbr1EvrP46sqqeAlCZQ3A034njQI955J5hLSsf2ESeZh0aX7rvMK_oRdFe4i_4TWGW9t8ka2fPypEykTGL7N-8HpTgxiA39Zh5qFkTvYhZEfx2Q1le9GDjcRFEwButRLWNUbd"
      },
      {
        name: "Void Sehpa",
        material: "El Oyması Bazalt",
        price: "$8.800'dan başlayan fiyatlarla",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM4nFz27wxUUSq_6ysDFp3nACdGwJvwPGWbl6uBhBHQhmDYvaa1wnXixqDo6RYYcJGUnEehaOXjrVpLsg-FAIi4-D4Y5Wxpj8w5HbcRUW87DvHVU-nweZRxZjwHNUbfO4iMQBUdY1UJGyaLiwKLH3W4MAYuu9UI3QXETFTTqkbOg3pCMjl15_YEG3TmpS17_1fPv4qjneW-AL8zemEj4CjhaaWE-3VOqeGU34XNzd8UKKOsli06c-pHgKsDbCOpe1C8TcjS4nkIfFL"
      },
      {
        name: "Nocturne Yemek Sandalyesi",
        material: "Eskitilmiş Meşe ve Bazalt",
        price: "$3.200'dan başlayan fiyatlarla",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUwc2RIVLbxTI4CC4hcfcB5y2oXzDpbm25tl8pG6fHM6lcTCgjhdBnBCvppYyeGBwN_7oqfJj1tZipxlJc9iS5v4S_Hrm47-vIPDFdNG-q6fCg29gNvco4ZtrxGjEgPblQIGoDA3WmFhgr-MLO2V8h9NLx4_wr5qggk0yhoLcKRhCq8GrAKBB_DWskI1P5jysvyYb9VhaYTlE372KnkjVw6UIHu-xSVKNdm81g4X1Zfns5ClUGErhwUfI5e-6NExKLzcTypfU3_lRT"
      },
      {
        name: "Primal Aplik",
        material: "Obsidyen ve Altın Varak",
        price: "$2.100'dan başlayan fiyatlarla",
        img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxaOY7V8eQeRHQLsqzrRHuisAWlLSnE9h1WtYie_tY_qJc4Q2iXtkKXV439gnNDPW6RFiZT9jgKhgSW8VVTSLQmP2t0We3L3Sw7xuVGJVJ0JY8sU8Rd737aR5RelM9SketHps8ttPoCGhiiO2Mq2q3SS73m2nlZ15bBPN30Qe0v5bUslVuVPdHkXN7j2iQ76Zbv9Wfi2mJAJqVfF82Ibreeo8Bp0S2RPaxDylLB_fM4wsc4JYT9rx8bxxdGeWI7Gx0dFX6Rrvvd0fo"
      }
    ],
    ctaTitle: "Tapınağınızı sonsuzluğun ağırlığıyla yüceltin.",
    ctaConsultation: "Danışmanlık Talep Et",
    ctaDownload: "Seri PDF'ini İndir",
    inquiryPrompt: "Obsidian Serisi hakkında bilgi almak istiyorum",
    inquirySubprompt: "Malzeme numuneleri, kişiselleştirme seçenekleri veya katalog detayları talep etmek için showroom danışmanlarımızla iletişime geçin."
  }
};

const generalTranslations = {
  en: {
    techSpecs: "Product Specifications",
    elementsTitle: "Noble Composition",
    artisanryTitle: "Artisanal Journey",
    artisanryDesc: "Each commission is handcrafted in our regional ateliers by skilled craftsmen. We prioritize high structural integrity, preserving the unique character, texture, and soul of every material.",
    finishesTitle: "Aesthetic Finishes",
    finishes: [
      { name: "Refined", desc: "Refined" },
      { name: "Natural", desc: "Natural" },
      { name: "Patinated", desc: "Patinated" }
    ],
    spatialTitle: "Spatial Dialogue",
    catalogSubtitle: "Key Attributes",
    ctaTitle: "Enhance your private environment with timeless design.",
    ctaConsultation: "Consult an Expert",
    ctaDownload: "Download Catalog Sheet",
    inquiryPrompt: "Inquire About This Piece",
    inquirySubprompt: "Our showroom concierges are available to assist with acquisitions, custom dimensions, shipping logistics, and material finishes."
  },
  ar: {
    techSpecs: "مواصفات المنتج",
    elementsTitle: "التركيب النبيل",
    artisanryTitle: "الرحلة الحرفية",
    artisanryDesc: "يتم تصنيع كل طلب يدويًا في ورشنا الإقليمية بواسطة حرفيين مهرة. نحن نعطي الأولوية لسلامة الهيكل العالية، مع الحفاظ على الطابع الفريد والملامس والروح لكل مادة.",
    finishesTitle: "التشطيبات الجمالية",
    finishes: [
      { name: "مصقول", desc: "Refined" },
      { name: "طبيعي", desc: "Natural" },
      { name: "معتق", desc: "Patinated" }
    ],
    spatialTitle: "الحوار المكاني",
    catalogSubtitle: "السمات الرئيسية",
    ctaTitle: "عزز بيئتك الخاصة بتصميم خالد.",
    ctaConsultation: "استشر خبيراً",
    ctaDownload: "تحميل ورقة الكتالوج",
    inquiryPrompt: "الاستفسار عن هذه القطعة",
    inquirySubprompt: "يتواجد موظفو الاستقبال في صالة العرض لدينا لمساعدتك في عمليات الاستحواذ والأبعاد المخصصة والخدمات اللوجستية وتفاصيل المواد."
  },
  tr: {
    techSpecs: "Ürün Özellikleri",
    elementsTitle: "Asil Bileşenler",
    artisanryTitle: "Zanaat Hikayesi",
    artisanryDesc: "Her sipariş, yetenekli zanaatkarlar tarafından bölgesel atölyelerimizde el yapımı olarak üretilir. Her malzemenin benzersiz karakterini, dokusunu ve ruhunu koruyarak yüksek yapısal bütünlüğe öncelik veriyoruz.",
    finishesTitle: "Estetik Yüzeyler",
    finishes: [
      { name: "Rafine", desc: "Refined" },
      { name: "Doğal", desc: "Natural" },
      { name: "Patineli", desc: "Patinated" }
    ],
    spatialTitle: "Mekansal Diyalog",
    catalogSubtitle: "Temel Nitelikler",
    ctaTitle: "Özel yaşam alanınızı zamansız tasarımla zenginleştirin.",
    ctaConsultation: "Uzmana Danışın",
    ctaDownload: "Katalog Sayfasını İndir",
    inquiryPrompt: "Bu Ürün Hakkında Bilgi Alın",
    inquirySubprompt: "Showroom danışmanlarımız; satın alımlar, özel ölçüler, lojistik süreçler ve malzeme yüzeyleri hakkında size yardımcı olmaya hazırdır."
  }
};

export default function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const { language, t, dir, theme } = useLanguage();

  const [collection, setCollection] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [spatialProjects, setSpatialProjects] = useState<Project[]>([]);

  // Interactive UI states
  const [activeFinish, setActiveFinish] = useState(0);

  // Inquiry form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const isObsidian = slug === "the-obsidian-series";

  // Load collection details
  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    apiProjects
      .getBySlug(slug)
      .then((data) => {
        setCollection(data);
      })
      .catch((err) => {
        console.error("Error loading collection details:", err);
      })
      .finally(() => setLoading(false));

    // Fetch interior projects for spatial context (bento grid fallback)
    apiProjects
      .getAll({ category: "Interior" })
      .then((data) => {
        setSpatialProjects(data.slice(0, 2));
      })
      .catch((err) => console.error("Error loading spatial projects:", err));
  }, [slug]);

  // Update default inquiry message when collection details or language changes
  useEffect(() => {
    if (collection) {
      const title = getLocalized(collection, "title", language);
      if (language === "ar") {
        setMessage(`مرحباً أورا، أنا مهتم بالاستفسار عن "${title}". يرجى تزويدي بمزيد من المعلومات.`);
      } else if (language === "tr") {
        setMessage(`Merhaba Aura, "${title}" hakkında bilgi almak istiyorum. Lütfen bana daha fazla bilgi verin.`);
      } else {
        setMessage(`Hello Aura, I am interested in inquiring about "${title}". Please provide me with more information.`);
      }
    }
  }, [collection, language]);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    setError("");

    try {
      await apiInquiries.submit({
        name,
        email,
        phone: phone || undefined,
        message,
        type: "Catalog",
        details: { projectSlug: slug, projectName: collection?.titleEn || slug },
      });
      setSuccess(t("concierge.success"));
      setName("");
      setEmail("");
      setPhone("");
    } catch {
      setError(t("concierge.error"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleFragmentInquire = (fragmentName: string) => {
    const title = getLocalized(collection, "title", language);
    if (language === "ar") {
      setMessage(`مرحباً أورا، أنا مهتم بالاستفسار عن "${title} - ${fragmentName}". يرجى تزويدي بمزيد من التفاصيل والأسعار.`);
    } else if (language === "tr") {
      setMessage(`Merhaba Aura, "${title} - ${fragmentName}" hakkında bilgi ve fiyat almak istiyorum. Lütfen detayları paylaşın.`);
    } else {
      setMessage(`Hello Aura, I am interested in inquiring about "${title} - ${fragmentName}". Please provide me with more details and pricing.`);
    }

    // Scroll to inquiry section smoothly
    const inquirySection = document.getElementById("inquiry-section");
    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <span className="text-xs uppercase tracking-widest text-gold animate-pulse">
            Curating collection showcase...
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="flex flex-col min-h-screen bg-background text-on-surface">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <span className="text-sm uppercase tracking-widest text-on-surface-variant/50">
            Collection not found.
          </span>
          <Link href="/collections" className="text-xs uppercase tracking-widest text-gold border-b border-gold">
            Return to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Localized values
  const title = getLocalized(collection, "title", language);
  const description = getLocalized(collection, "description", language);
  const material = getLocalized(collection, "material", language);
  const location = getLocalized(collection, "location", language);
  const style = getLocalized(collection, "style", language);

  const loc = isObsidian ? obsidianTranslations[language] : generalTranslations[language];

  // Derive elements from material database string
  const elementsList = isObsidian
    ? obsidianTranslations[language].elements
    : (material ? material.split(",").map(m => m.trim()) : [material]);

  // Construct general narrative paragraphs dynamically if not Obsidian
  const generalNarrative = !isObsidian
    ? {
        title: `${style} & ${material}`,
        p1: language === "ar"
          ? `تم تنسيق هذه المجموعة الرائعة في ${location || "مشغلنا"} لتجسيد جوهر ${style || "الفخامة المعاصرة"}.`
          : language === "tr"
          ? `${location || "Atölyemizde"} küratörlüğü yapılan bu özel koleksiyon, ${style || "çağdaş lüksün"} özünü yansıtıyor.`
          : `Curated at our ${location || "atelier"}, this exquisite collection embodies the very essence of ${style || "contemporary luxury"}.`,
        p2: language === "ar"
          ? `باستخدام مواد نبيلة مثل ${material || "الخامات الفاخرة"}، يبرز هذا التصميم دقة معمارية فائقة تضفي شعوراً بالتميز والوقار والاتصال بالخامات الطبيعية.`
          : language === "tr"
          ? `${material || "soylu malzemelerin"} kullanımıyla üretilen bu tasarım, modern yaşam alanlarına mimari hassasiyet ve güçlü bir duruş kazandırıyor.`
          : `Utilizing noble materials such as ${material || "fine textures"}, this design introduces architectural presence and a commanding presence to modern sanctuaries.`
      }
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="pt-20 overflow-x-hidden">
        {/* Back navigation link */}
        <div className="max-w-7xl mx-auto px-6 pt-12">
          <Link
            href="/collections"
            className="inline-flex items-center space-x-2 rtl:space-x-reverse text-xs uppercase tracking-widest text-on-surface-variant/60 hover:text-gold transition-colors"
          >
            <ArrowLeft size={14} className="rtl:rotate-180" />
            <span>{language === "ar" ? "العودة إلى المجموعات" : language === "tr" ? "Koleksiyonlara Geri Dön" : "Back to collections"}</span>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="relative h-[85vh] md:h-[90vh] flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/25 to-background z-10"></div>
            <img
              className="w-full h-full object-cover grayscale transition-all duration-500 dark:brightness-75 brightness-110 dark:opacity-100 opacity-90"
              src={collection.images[0] || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200"}
              alt={title}
            />
          </div>
          <div className="relative z-20 text-center max-w-3xl animate-fade-in-up mt-12">
            <span className="font-sans text-xs md:text-sm font-semibold text-primary tracking-[0.4em] uppercase block mb-6 animate-pulse">
              {isObsidian ? obsidianTranslations[language].seriesNo : `${collection.subCategory || "Showroom"} • ${collection.year}`}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-8 tracking-tight text-on-surface leading-tight">
              {title}
            </h1>
            <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed font-light">
              {description}
            </p>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary z-20 cursor-pointer" onClick={() => {
            const nextSec = document.getElementById("narrative-section");
            if (nextSec) nextSec.scrollIntoView({ behavior: "smooth" });
          }}>
            <span className="font-sans text-[10px] uppercase tracking-widest">{isObsidian ? obsidianTranslations[language].discover : (language === "ar" ? "اكتشف المزيد" : language === "tr" ? "Keşfet" : "Discover More")}</span>
            <div className="w-[1px] h-8 bg-primary animate-bounce mt-1"></div>
          </div>
        </section>

        {/* Architectural Narrative (Materiality & Craft) */}
        <section id="narrative-section" className="py-24 md:py-32 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center border-t border-outline-variant/20">
          <div className="md:col-span-5 space-y-6">
            <span className="font-sans text-xs font-bold text-primary tracking-widest uppercase block">
              {language === "ar" ? "الفلسفة والتصميم" : language === "tr" ? "FELSEFE VE TASARIM" : "PHILOSOPHY & DESIGN"}
            </span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl leading-tight text-on-surface font-semibold">
              {isObsidian ? obsidianTranslations[language].narrativeTitle : generalNarrative?.title}
            </h2>
            <div className="space-y-6 font-sans text-sm md:text-base text-on-surface-variant leading-relaxed font-light italic">
              <p>{isObsidian ? obsidianTranslations[language].narrativeP1 : generalNarrative?.p1}</p>
              <p>{isObsidian ? obsidianTranslations[language].narrativeP2 : generalNarrative?.p2}</p>
            </div>
          </div>
          <div className="md:col-span-7 relative">
            <div className="aspect-[4/5] glass-panel p-4 rotate-1 translate-x-3 md:translate-x-4 shadow-xl">
              <img
                className="w-full h-full object-cover grayscale brightness-95"
                src={isObsidian ? "https://lh3.googleusercontent.com/aida-public/AB6AXuAYImyQ90ZolSeHqu8ZHNbHYgeH3niyCKi_UTouYrgl77TNBsXkXmQJHXEtLO02TrR7SmnWn-CLzukJXueUBG5WbSNb2lovX-x4-1n9tGMXRvU9xfLBhautyWb22pz3Gi8rbu-xbrB6auVNp1G2oczt6ASaVgoucjiceRl-cJIbmP4RFCzYVUJk0AdW9YNuZfD-lP0klnmOzYxGQkOBObkzS3yVoZPXHTeAi32YNVKCLGGOPxWiNN8YvOC8MHFRign32zoHCpAyebKb" : (collection.images[1] || collection.images[0])}
                alt={`${title} Detail`}
              />
            </div>
            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 w-48 h-48 md:w-64 md:h-64 border border-primary/20 -z-10"></div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="py-24 bg-surface-container-low border-y dark:border-outline/10 border-on-surface/5">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-serif text-2xl md:text-3xl text-on-surface font-semibold mb-12 border-b border-outline-variant/30 pb-4">
              {loc.techSpecs}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Elements Column */}
              <div className="space-y-6">
                <h3 className="font-sans text-xs font-bold text-primary tracking-widest uppercase">
                  {loc.elementsTitle}
                </h3>
                <ul className="space-y-4 font-serif text-xl md:text-2xl text-on-surface font-medium">
                  {elementsList.map((element: string, idx: number) => (
                    <li key={idx} className="flex items-center space-x-3 rtl:space-x-reverse">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      <span>{element}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Artisanry Column */}
              <div className="space-y-6">
                <h3 className="font-sans text-xs font-bold text-primary tracking-widest uppercase">
                  {loc.artisanryTitle}
                </h3>
                <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed font-light">
                  {loc.artisanryDesc}
                </p>
              </div>

              {/* Finishes Column */}
              <div className="space-y-6">
                <h3 className="font-sans text-xs font-bold text-primary tracking-widest uppercase">
                  {loc.finishesTitle}
                </h3>
                <div className="flex gap-6 mt-4">
                  {(loc.finishes as FinishOption[]).map((finish, index: number) => {
                    const finishColors = ["#0A0A0A", "#1A1A1A", "#2C2C2C"];
                    const isSelected = activeFinish === index;
                    return (
                      <div
                        key={index}
                        className="group cursor-pointer flex flex-col items-center"
                        onClick={() => setActiveFinish(index)}
                      >
                        <div
                          className={`w-12 h-12 rounded-full border transition-all duration-300 relative flex items-center justify-center ${
                            isSelected
                              ? "border-primary scale-110 shadow-[0_0_15px_rgba(242,202,80,0.4)]"
                              : "border-outline-variant/60 hover:border-primary"
                          }`}
                          style={{ backgroundColor: finishColors[index % finishColors.length] }}
                        >
                          {isSelected && <Check size={14} className="text-gold" />}
                        </div>
                        <span className={`text-[10px] uppercase tracking-wider mt-3 block text-center font-medium transition-colors ${
                          isSelected ? "text-primary font-bold" : "text-on-surface-variant/60"
                        }`}>
                          {finish.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spatial Context (Bento Layout) */}
        <section className="py-24 md:py-32 px-6 max-w-7xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-center mb-16 font-semibold">
            {loc.spatialTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px] lg:h-[700px]">
            {isObsidian ? (
              <>
                {/* Case Study 1 */}
                <div className="md:col-span-8 group relative overflow-hidden rounded-lg shadow-lg">
                  <div className="absolute inset-0 transition-colors duration-300 dark:bg-background/40 bg-black/20 dark:group-hover:bg-background/10 group-hover:bg-black/5 z-10"></div>
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGgpKyZMz0ioybp2dalGUDsNK6wYw_-Cb3Zz1hVXdWiINZnB7Hc7sr-xVjGjilOxrrToSMfNtENXI_WuS0_D4TB75UkshbwQXw-Mtf8uOXOP-GDrNocmOEj7hpIzNTGVZSgvgro2CFwQGgPJ3as-uhb6SIhMdUnnIIygkO2VdMqrPsraoMlzS27gPYg4zeCvtmiLYAoJTmnqE72iaGAHsLuwqQJ7P_lC6Ml9T5vBNCNYC80ueqtxGekCCnU6zBHEyFi7gNkWdCfEB"
                    alt={obsidianTranslations[language].caseStudy1Title}
                  />
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="font-sans text-[10px] md:text-xs text-primary uppercase tracking-widest font-bold block mb-1 drop-shadow-md">
                      {obsidianTranslations[language].caseStudy1}
                    </span>
                    <h4 className="font-serif text-xl md:text-2xl lg:text-3xl text-white drop-shadow-lg font-medium">
                      {obsidianTranslations[language].caseStudy1Title}
                    </h4>
                  </div>
                </div>
                {/* Case Study 2 */}
                <div className="md:col-span-4 group relative overflow-hidden rounded-lg shadow-lg">
                  <div className="absolute inset-0 transition-colors duration-300 dark:bg-background/40 bg-black/20 dark:group-hover:bg-background/10 group-hover:bg-black/5 z-10"></div>
                  <img
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCy-dceJ8sFt9Gaz0fXgxxsOoYo-yUhhrf4g5x_4TyHl3VX9kjo4HQScHhBNeEC5IwCXP0bB7IIeFUHFCZjEWT5H_AXK7Xm8mMng2NGZi7LW2R1uvwhJfRcnMiRP9odit_irlKAJBz-aGZerwMjYaIEFHuHyUP0L-fO8m0y1LJht2wui7-yTfsYHxvcLgn99nOOyANy2R9gwFeUJxhYn8-2jWHyfQ5DhyqK9yvpRT7L0k-E0HiEokk-ODgh3Fq341bCOAPvKiJKgje"
                    alt={obsidianTranslations[language].caseStudy2Title}
                  />
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="font-sans text-[10px] md:text-xs text-primary uppercase tracking-widest font-bold block mb-1 drop-shadow-md">
                      {obsidianTranslations[language].caseStudy2}
                    </span>
                    <h4 className="font-serif text-xl md:text-2xl lg:text-3xl text-white drop-shadow-lg font-medium">
                      {obsidianTranslations[language].caseStudy2Title}
                    </h4>
                  </div>
                </div>
              </>
            ) : (
              <>
                {spatialProjects.length > 0 ? (
                  spatialProjects.map((p, index) => {
                    const colSpan = index === 0 ? "md:col-span-8" : "md:col-span-4";
                    return (
                      <div key={p.id} className={`${colSpan} group relative overflow-hidden rounded-lg shadow-lg`}>
                        <div className="absolute inset-0 transition-colors duration-300 dark:bg-background/40 bg-black/20 dark:group-hover:bg-background/10 group-hover:bg-black/5 z-10"></div>
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.5s]"
                          src={p.images[0] || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"}
                          alt={getLocalized(p, "title", language)}
                        />
                        <div className="absolute bottom-8 left-8 z-20">
                          <span className="font-sans text-[10px] md:text-xs text-primary uppercase tracking-widest font-bold block mb-1 drop-shadow-md">
                            {language === "ar" ? `معرض داخلي ${index + 1}` : language === "tr" ? `İç Mekan Galeri ${index + 1}` : `Interior Gallery ${index + 1}`}
                          </span>
                          <h4 className="font-serif text-xl md:text-2xl lg:text-3xl text-white drop-shadow-lg font-medium">
                            {getLocalized(p, "title", language)}
                          </h4>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="md:col-span-12 flex items-center justify-center glass-panel rounded-lg">
                    <span className="text-xs uppercase tracking-widest text-on-surface-variant/40">Integrating Spatial Galleries...</span>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* Collection Catalog Gallery (Series Fragments) */}
        <section className="py-24 md:py-32 bg-surface border-t border-outline-variant/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <span className="font-sans text-xs md:text-sm font-bold text-primary uppercase tracking-widest block mb-2">
                  {loc.catalogSubtitle}
                </span>
                <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-semibold">
                  {isObsidian ? loc.catalogSubtitle : (language === "ar" ? "المعرض التفصيلي" : language === "tr" ? "Detaylı Galeri" : "Detailed Catalog")}
                </h2>
              </div>
              <button
                onClick={() => {
                  const inquirySection = document.getElementById("inquiry-section");
                  if (inquirySection) inquirySection.scrollIntoView({ behavior: "smooth" });
                }}
                className="font-sans text-xs font-semibold border-b border-primary text-primary pb-1 hover:text-gold hover:border-gold transition-colors uppercase tracking-widest"
              >
                {isObsidian ? obsidianTranslations[language].pricingGuide : (language === "ar" ? "عرض دليل الأسعار" : language === "tr" ? "Fiyat Kılavuzunu Görüntüle" : "View Pricing Guide")}
              </button>
            </div>

            {isObsidian ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {(obsidianTranslations[language].fragments as SeriesFragment[]).map((frag, idx: number) => (
                  <div key={idx} className="flex flex-col group">
                    <div className="aspect-square bg-surface-container-low mb-6 overflow-hidden rounded border dark:border-outline-variant/30 border-on-surface/5 relative">
                      <img
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        src={frag.img}
                        alt={frag.name}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-15">
                        <button
                          onClick={() => handleFragmentInquire(frag.name)}
                          className="bg-primary text-on-primary text-[10px] uppercase font-bold tracking-widest px-4 py-2 hover:bg-gold transition-colors rounded shadow-lg"
                        >
                          {language === "ar" ? "استفسر الآن" : language === "tr" ? "Bilgi Al" : "Inquire Now"}
                        </button>
                      </div>
                    </div>
                    <h5 className="font-serif text-lg md:text-xl mb-1 text-on-surface font-semibold group-hover:text-gold transition-colors">
                      {frag.name}
                    </h5>
                    <p className="font-sans text-xs text-on-surface-variant uppercase tracking-wider mb-4">
                      {frag.material}
                    </p>
                    <p className="font-sans text-sm text-primary font-bold mt-auto">
                      {frag.price}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="relative aspect-square w-full rounded overflow-hidden border dark:border-outline-variant/30 border-on-surface/5 shadow-md">
                    <img
                      src={collection.images[0]}
                      alt={title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="font-serif text-2xl md:text-3xl text-on-surface font-semibold">{title}</h4>
                  <p className="text-on-surface-variant text-sm md:text-base leading-relaxed font-light">{description}</p>

                  <div className="border-t border-outline-variant/30 pt-6 space-y-4">
                    {collection.price && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant/60">{language === "ar" ? "السعر المقدر" : language === "tr" ? "Tahmini Fiyat" : "Estimated Value"}</span>
                        <span className="text-gold font-serif text-2xl font-bold">${parseFloat(collection.price).toLocaleString()}</span>
                      </div>
                    )}
                    {style && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant/60">{language === "ar" ? "النمط" : language === "tr" ? "Stil" : "Aesthetic Style"}</span>
                        <span className="text-on-surface font-medium text-sm">{style}</span>
                      </div>
                    )}
                    {collection.year && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs uppercase tracking-wider text-on-surface-variant/60">{language === "ar" ? "سنة الصنع" : language === "tr" ? "Yapım Yılı" : "Year of Creation"}</span>
                        <span className="text-on-surface font-medium text-sm">{collection.year}</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleFragmentInquire("")}
                    className="w-full inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 text-on-primary py-4 px-6 rounded text-xs uppercase tracking-widest font-semibold transition-colors shadow-lg mt-4"
                  >
                    <span>{language === "ar" ? "استفسر عن هذه القطعة" : language === "tr" ? "Bu Ürün İçin İletişime Geçin" : "Inquire About This Piece"}</span>
                    <ArrowRight size={14} className="ml-2 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Final CTA / Consultation Trigger */}
        <section className="py-32 md:py-40 relative flex flex-col items-center justify-center text-center overflow-hidden border-t border-outline-variant/20">
          <div className="absolute inset-0 z-0 opacity-10">
            <img src={collection.images[0]} alt="Background CTA" className="w-full h-full object-cover blur-md" />
          </div>
          <div className="relative z-10 px-6 max-w-4xl">
            <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl mb-12 text-on-surface font-semibold leading-tight">
              {loc.ctaTitle}
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <button
                onClick={() => {
                  const inquirySection = document.getElementById("inquiry-section");
                  if (inquirySection) inquirySection.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary text-on-primary font-sans text-xs md:text-sm font-semibold px-12 py-5 uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-lg"
              >
                {loc.ctaConsultation}
              </button>
              <button
                onClick={() => {
                  alert(language === "ar" ? "بدء تحميل ملف الكتالوج الرقمي..." : language === "tr" ? "Katalog PDF indirme işlemi başlatılıyor..." : "Initiating catalog PDF download...");
                }}
                className="border border-primary text-primary font-sans text-xs md:text-sm font-semibold px-12 py-5 uppercase tracking-widest hover:bg-primary/10 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Download size={14} />
                <span>{loc.ctaDownload}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Inquiries Concierge Form Section */}
        <section id="inquiry-section" className="py-20 border-t border-outline-variant/20 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block flex items-center gap-2">
                <Sparkles size={14} className="text-gold" />
                <span>{language === "ar" ? "الاستحواذ والاستفسارات" : language === "tr" ? "SATIN ALMA VE BİLGİ" : "ACQUISITIONS & INQUIRIES"}</span>
              </span>
              <h2 className="font-serif text-3xl text-on-surface font-bold">
                {loc.inquiryPrompt}
              </h2>
              <p className="text-on-surface-variant/80 text-sm leading-relaxed font-light">
                {loc.inquirySubprompt}
              </p>
            </div>

            <div className="lg:col-span-7 glass-panel p-8 rounded-lg shadow-lg">
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                {success && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded text-sm animate-fade-in-up flex items-center gap-2">
                    <Check size={16} className="text-emerald-400" />
                    <span>{success}</span>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded text-sm animate-fade-in-up">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant/80 font-medium">
                      {t("concierge.name")}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-gold transition-all"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs uppercase tracking-widest text-on-surface-variant/80 font-medium">
                      {t("concierge.email")}
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-gold transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant/80 font-medium">
                    {t("concierge.phone")}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-gold transition-all"
                    placeholder="+90 500 000 00 00"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs uppercase tracking-widest text-on-surface-variant/80 font-medium">
                    {t("concierge.message")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-surface-container-low border border-outline-variant rounded px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-gold transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-on-primary py-4 px-6 rounded text-xs uppercase tracking-widest font-semibold transition-all shadow-lg active:scale-95"
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
