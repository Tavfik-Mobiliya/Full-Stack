"use client";

import React from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { Sparkles, Award, ShieldCheck } from "lucide-react";

const aboutData = {
  en: {
    subtitle: "Atelier of Space & Form",
    title: "About Tevfik Mobilya",
    storyTitle: "Our Story",
    storyContent1: "Founded at the intersection of architecture, fine art, and luxury craft, Tevfik Mobilya was established as a premier design house. We conceptualize, curate, and handcraft spaces that are not merely lived in, but experienced. Every project is an exploration of noble materials, sculptural weight, and the orchestration of light.",
    storyContent2: "From bespoke private estates in London and Dubai to collectible furniture series, our work is defined by a commitment to minimalist permanence. We strip away the unnecessary, allowing the innate beauty of walnut, marble, and brass to compose quiet, monumental poetry.",
    teamTitle: "The Creative Minds",
    teamSubtitle: "Meet the curators of Tevfik Mobilya's signature aesthetic.",
    team: [
      {
        name: "Alessandra Rossi",
        role: "Principal Architect & Founder",
        bio: "With over 15 years in high-end residential architecture, Alessandra directs the spatial philosophy of all Aura interior projects.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      },
      {
        name: "Marcus Vance",
        role: "Head of Furniture & Collectibles",
        bio: "A master craftsman and sculptor, Marcus leads our collectible design studio, shaping raw wood and marble into functional art.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
      },
      {
        name: "Yasmin Al-Mansoori",
        role: "Director of Curated Spaces",
        bio: "Yasmin ensures the seamless union of global art curation, soft styling, and sensory layout for our elite clientele.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
      }
    ],
    partnersTitle: "Collaborations",
    partnersSubtitle: "We partner with the world's most prestigious material ateliers to ensure absolute quality.",
    values: [
      {
        title: "Bespoke Curation",
        desc: "Tailoring every dimension and material choice to the client's singular vision and lifestyle.",
        icon: Sparkles
      },
      {
        title: "Uncompromising Craft",
        desc: "Collaborating with generational artisans to execute intricate details with precision.",
        icon: Award
      },
      {
        title: "Ethical Sourcing",
        desc: "Choosing only certified noble woods, sustainably quarried stones, and low-impact finishes.",
        icon: ShieldCheck
      }
    ]
  },
  ar: {
    subtitle: "أتيليه المساحة والشكل",
    title: "حول توفيق موبيليا",
    storyTitle: "قصتنا",
    storyContent1: "تأسست شركة توفيق موبيليا عند نقطة التقاء الهندسة المعمارية والفنون الجميلة والحرف اليدوية الفاخرة، لتكون دار التصميم الرائدة. نحن نتصور وننسق ونصنع يدويًا مساحات لا يقتصر العيش فيها فحسب، بل يتم اختبارها وتجربتها. كل مشروع هو استكشاف للمواد النبيلة، والوزن النحتي، وتناغم الضوء.",
    storyContent2: "من العقارات الخاصة المخصصة في لندن ودبي إلى سلاسل الأثاث القابلة للاقتناء، يتم تحديد عملنا من خلال الالتزام بالبساطة الخالدة. نحن نجرد غير الضروري، مما يسمح للجمال الفطري لخشب الجوز والرخام والنحاس بتأليف قصائد معمارية هادئة وهائلة.",
    teamTitle: "العقول الإبداعية",
    teamSubtitle: "تعرف على القيمين على الجمالية المميزة لتوفيق موبيليا.",
    team: [
      {
        name: "أليساندرا روسي",
        role: "المعماري الرئيسي والمؤسس",
        bio: "مع أكثر من 15 عامًا في الهندسة المعمارية السكنية الراقية، توجه أليساندرا الفلسفة المكانية لجميع مشاريع أورا الداخلية.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      },
      {
        name: "ماركوس فانس",
        role: "رئيس الأثاث والمقتنيات",
        bio: "حرفي ونحات رئيسي، يقود ماركوس استوديو التصميم الخاص بنا، حيث يشكل الخشب الخام والرخام في قطع فنية وظيفية.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
      },
      {
        name: "ياسمين المنصوري",
        role: "مديرة تنسيق المساحات",
        bio: "تضمن ياسمين الاتحاد السلس للتنسيق الفني العالمي، والتصميم الناعم، والتخطيط الحسي لعملائنا النخبة.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
      }
    ],
    partnersTitle: "تعاون",
    partnersSubtitle: "نحن نشارك أرقى مصانع المواد في العالم لضمان الجودة المطلقة.",
    values: [
      {
        title: "تقييم مخصص",
        desc: "تخصيص كل بعد وخيار مادي لرؤية العميل الفريدة وأسلوب حياته.",
        icon: Sparkles
      },
      {
        title: "حرفة بلا مساومة",
        desc: "التعاون مع حرفيين متوارثين لتنفيذ التفاصيل المعقدة بدقة بالغة.",
        icon: Award
      },
      {
        title: "مصادر أخلاقية",
        desc: "اختيار الأخشاب النبيلة المعتمدة فقط، والأحجار المستخرجة بشكل مستدام، والتشطيبات منخفضة التأثير.",
        icon: ShieldCheck
      }
    ]
  },
  tr: {
    subtitle: "Boşluk ve Form Atölyesi",
    title: "Tevfik Mobilya Hakkında",
    storyTitle: "Hikayemiz",
    storyContent1: "Mimarlık, güzel sanatlar ve lüks zanaatın kesişiminde kurulan Tevfik Mobilya, seçkin bir tasarım evi olarak hayata geçti. Biz, sadece içinde yaşanılan değil, deneyimlenen mekanları tasarlıyor, küratörlüğünü yapıyor ve el işçiliğiyle üretiyoruz. Her proje, soylu malzemelerin, heykelsi ağırlığın ve ışığın orkestrasyonunun bir keşfidir.",
    storyContent2: "Londra ve Dubai'deki özel malikanelerden koleksiyonluk mobilya serilerine kadar çalışmalarımız, minimalist kalıcılık taahhüdüyle tanımlanır. Gereksiz olanı arındırarak; ceviz, mermer ve pirincin doğuştan gelen güzelliğinin sessiz, anıtsal bir şiir yazmasına izin veriyoruz.",
    teamTitle: "Yaratıcı Zihinler",
    teamSubtitle: "Tevfik Mobilya'nın imza estetiğinin küratörleriyle tanışın.",
    team: [
      {
        name: "Alessandra Rossi",
        role: "Baş Mimar & Kurucu",
        bio: "Üst düzey konut mimarisinde 15 yılı aşkın deneyimiyle Alessandra, tüm Aura iç mekan projelerinin mekansal felsefesini yönetiyor.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      },
      {
        name: "Marcus Vance",
        role: "Mobilya ve Koleksiyon Ürünleri Başkanı",
        bio: "Usta bir zanaatkar ve heykeltıraş olan Marcus, ham ahşap ve mermeri işlevsel sanata dönüştüren koleksiyon tasarım stüdyomuzu yönetiyor.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600",
      },
      {
        name: "Yasmin Al-Mansoori",
        role: "Küratörlü Mekanlar Direktörü",
        bio: "Yasmin, seçkin müşterilerimiz için küresel sanat küratörlüğü, yumuşak stil ve duyusal düzenin kusursuz birleşimini sağlar.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
      }
    ],
    partnersTitle: "Soyluluk Ortaklıkları",
    partnersSubtitle: "Mutlak kaliteyi garantilemek için dünyanın en prestijli malzeme atölyeleriyle ortaklık kuruyoruz.",
    values: [
      {
        title: "Özel Kürasyon",
        desc: "Her boyutu ve malzeme seçimini müşterinin benzersiz vizyonuna ve yaşam tarzına göre uyarlamak.",
        icon: Sparkles
      },
      {
        title: "Ödünsüz Zanaat",
        desc: "Karmaşık detayları hassasiyetle uygulamak için nesiller boyu zanaatkarlık yapan ustalarla işbirliği yapmak.",
        icon: Award
      },
      {
        title: "Etik Tedarik",
        desc: "Sadece sertifikalı asil ahşapları, sürdürülebilir şekilde çıkarılmış taşları ve çevreye duyarlı kaplamaları seçmek.",
        icon: ShieldCheck
      }
    ]
  }
};

export default function AboutPage() {
  const { language } = useLanguage();
  const lang = (language === "ar" || language === "tr") ? language : "en";
  const data = aboutData[lang];

  return (
    <div className="flex flex-col min-h-screen bg-background text-on-surface">
      <Navbar />

      <main className="flex-1 pt-32 pb-24">
        {/* Hero Section */}
        <section className="relative px-6 max-w-7xl mx-auto w-full mb-24">
          <div className="text-center md:text-start max-w-2xl reveal-on-scroll active">
            <span className="text-xs uppercase tracking-[0.3em] text-gold font-semibold block mb-2">
              {data.subtitle}
            </span>
            <h1 className="font-serif text-4xl md:text-6xl text-on-surface font-bold">
              {data.title}
            </h1>
          </div>
        </section>

        {/* Story Section */}
        <section className="relative px-6 max-w-7xl mx-auto w-full mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="font-serif text-3xl text-gold border-b border-outline-variant/30 pb-4">
                {data.storyTitle}
              </h2>
              <p className="text-on-surface-variant/90 text-base leading-relaxed font-light">
                {data.storyContent1}
              </p>
              <p className="text-on-surface-variant/90 text-base leading-relaxed font-light">
                {data.storyContent2}
              </p>
            </div>
            <div className="lg:col-span-6">
              <div className="relative aspect-video rounded-lg overflow-hidden border border-outline-variant/30 shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200"
                  alt="Aura Studio Craftsmanship"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-black/60 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-surface-container-low/20 border-y border-outline-variant/20 py-24 mb-32">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {data.values.map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div key={idx} className="glass-panel p-8 rounded-lg border border-outline-variant/20 flex flex-col items-center text-center space-y-4 hover:border-gold/20 transition-all duration-300">
                    <div className="w-12 h-12 rounded bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                      <IconComponent size={24} />
                    </div>
                    <h3 className="font-serif text-xl text-on-surface font-semibold">{val.title}</h3>
                    <p className="text-on-surface-variant/75 text-sm leading-relaxed font-light">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="px-6 max-w-7xl mx-auto w-full mb-32">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl text-on-surface font-bold mb-4">
              {data.teamTitle}
            </h2>
            <p className="text-on-surface-variant/75 text-sm font-light max-w-md mx-auto">
              {data.teamSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.team.map((member, idx) => (
              <div key={idx} className="group bg-surface-container-low border border-outline-variant/30 rounded-lg overflow-hidden flex flex-col transition-all duration-300 hover:border-gold/15 shadow-md hover:shadow-lg">
                <div className="aspect-[4/5] w-full overflow-hidden relative">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/80 via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <h3 className="font-serif text-lg text-on-surface font-semibold group-hover:text-gold transition-colors">
                    {member.name}
                  </h3>
                  <span className="text-xs text-gold uppercase tracking-wider font-semibold">
                    {member.role}
                  </span>
                  <p className="text-on-surface-variant/75 text-xs leading-relaxed font-light">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners/Collaborations Section */}
        <section className="px-6 max-w-7xl mx-auto w-full">
          <div className="glass-panel p-12 rounded-lg border border-gold/10 text-center space-y-6">
            <h2 className="font-serif text-3xl text-gold">{data.partnersTitle}</h2>
            <p className="text-on-surface-variant/75 text-sm font-light max-w-lg mx-auto leading-relaxed">
              {data.partnersSubtitle}
            </p>
            <div className="pt-8 flex flex-wrap justify-center gap-12 items-center opacity-60">
              <span className="font-serif text-lg tracking-[0.2em] text-on-surface/60 font-semibold">MARMI CARRARA</span>
              <span className="font-serif text-lg tracking-[0.2em] text-on-surface/60 font-semibold">WALNUT ATELIER</span>
              <span className="font-serif text-lg tracking-[0.2em] text-on-surface/60 font-semibold">BRONZO FIRENZE</span>
              <span className="font-serif text-lg tracking-[0.2em] text-on-surface/60 font-semibold">TESSUTO MILANO</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
