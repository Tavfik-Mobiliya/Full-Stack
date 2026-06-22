import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (order respects FK constraints)
  await prisma.companySettings.deleteMany({});
  await prisma.dealProduct.deleteMany({});
  await prisma.deal.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.inquiry.deleteMany({});
  await prisma.testimonial.deleteMany({});

  console.log("Seeding Database...");

  // ── Company Settings ──
  await prisma.companySettings.create({
    data: {
      whatsappNumber: "905551234567",
      contactPhone: "+90 (555) 123 45 67",
      contactEmail: "concierge@aura-interiors.com",
      instagramUrl: "https://instagram.com/tevfikmobilya",
      twitterUrl: "https://x.com/tevfikmobilya",
    },
  });

  // ── Testimonials ──
  await prisma.testimonial.createMany({
    data: [
      {
        author: "ELIF & KEREM AL-SAYED",
        category: "Interior",
        rating: 5,
        quoteEn: "Tevfik Mobilya didn't just design a house; they curated a sanctuary that perfectly reflects our heritage and our modern life. Every detail is a testament to their architectural excellence.",
        quoteAr: "لم تقم Tevfik Mobilya بمجرد تصميم منزل؛ بل قاموا برعاية ملاذ يعكس تراثنا وحياتنا الحديثة تمامًا. كل التفاصيل هي شهادة على تميزهم المعماري.",
        quoteTr: "Tevfik Mobilya sadece bir ev tasarlamadı; mirasımızı ve modern yaşamımızı mükemmel bir şekilde yansıtan bir sığınak yarattı. Her detay mimari mükemmelliklerinin bir kanıtı.",
        roleEn: "PRIVATE ESTATE OWNERS",
        roleAr: "أصحاب عقارات خاصة",
        roleTr: "ÖZEL MÜLK SAHİPLERİ",
      },
      {
        author: "Sarah Jenkins",
        category: "Furniture",
        rating: 5,
        quoteEn: "The Obsidian dining table is a sculpture. The craftsmanship is breathtaking. It is the centerpiece of our home and garners compliments from every guest.",
        quoteAr: "طاولة طعام أوبسيديان هي عبارة عن تحفة منحوتة. الحرفية تحبس الأنفاس. إنها القطعة المركزية في منزلنا وتنال إعجاب كل ضيف.",
        quoteTr: "Obsidian yemek masası adeta bir heykel. İşçilik nefes kesici. Evimizin baş köşesinde yer alıyor ve her misafirden övgü alıyor.",
        roleEn: "Art Collector",
        roleAr: "جامعة تحف فنية",
        roleTr: "Sanat Koleksiyoneri",
      },
    ],
  });

  // ── Collections ──
  await prisma.collection.createMany({
    data: [
      { nameEn: "Obsidian", nameAr: "أوبسيديان", nameTr: "Obsidyen" },
      { nameEn: "Nocturne", nameAr: "نوكتورن", nameTr: "Nocturne" },
      { nameEn: "Pavilion", nameAr: "جناح", nameTr: "Pavyon" },
    ],
  });

  const collections = await prisma.collection.findMany();

  // ── Products (Interior & Furniture) ──
  const productsData = [
    {
      slug: "belvedere-residence",
      category: "Interior",
      subCategory: "Residential",
      roomType: "Living Room",
      year: 2023,
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuBWTf_0MVr4A6vKurPw_f0jfRLbaYlRclNTxTf6Db5Fc43izsK8Ldmm_ov0lupc3DA0Q7nmnYvAlTouQir8Z6UwH42q4LaytR2WvT7PaRlsmuRP_CabTwgR5LXnsGYKlqxmYGe7X5QKsKa5iNOVEzwU8Gh2jpPjpXEECnZ3wfdlQeLDKfHRwYGtP6WE6qNvFrnDrxiza5_D8jyoiFzbCUpUqTUItaC4SHdtw1TucNnC2mQit6WxmAk04GbylW435xIoawClpr7APnz5",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&q=80&w=1600"],
      beforeImage: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://images.unsplash.com/photo-1600566753086-00f18f5e7f2f?auto=format&fit=crop&q=80&w=1600",
      featured: true,
      budget: "Ultra-Luxury",
      locationEn: "LONDON",
      locationAr: "لندن",
      locationTr: "LONDRA",
      titleEn: "The Belvedere Residence",
      titleAr: "سكن بلفيدير",
      titleTr: "Belvedere Rezidansı",
      descriptionEn: "A masterful composition of monolithic minimalism and nocturnal luxury overlooking the London skyline.",
      descriptionAr: "مزيج رائع من البساطة العملاقة والفخامة الليلية المطلة على أفق لندن.",
      descriptionTr: "Londra silüetine bakan anıtsal minimalist ve gece lüksünün ustaca bir kompozisyonu.",
      materialEn: "Polished Concrete, Dark Oak, Bronze",
      materialAr: "الخرسانة المصقولة، البلوط الداكن، البرونز",
      materialTr: "Cilalı Beton, Koyu Meşe, Bronz",
      styleEn: "Monolithic Minimalist",
      styleAr: "بسيط أحادي الهيكل",
      styleTr: "Monolitik Minimalist",
      specs: { Area: "12,000 sq ft", Bedrooms: "5", Bathrooms: "6" }
    },
    {
      slug: "emerald-hills",
      category: "Interior",
      subCategory: "Villa",
      roomType: "Living Room",
      year: 2024,
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuDCWTzGauxDjD56yHXnX8ouetGrIcCALpB_0jkkzFINKXlEvfDodIbiaalsEeN7jad60xkQ4S1ZmdRUmDEfUVPctRfTJwpthuB1ycgR5wDisQiIOmRU6tcMdChws4eREGz0dd1OGRqfm2fYn7UpxTbtPtQx4EKuILlJfK1R8hKUUWdbne2CRa7PK3MD7XDr6HJkXY42Gje2TUB8HMKTY3n-ZzIzQjOagsfRpYkS2OY95pf9MVOoRdOgY9Jj4JKbmsTL8UMl-ZB79w1j",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600"],
      beforeImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1600",
      afterImage: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600",
      featured: true,
      budget: "Bespoke",
      locationEn: "DUBAI",
      locationAr: "دبي",
      locationTr: "DUBAİ",
      titleEn: "Emerald Hills Villa",
      titleAr: "فيلا تلال الزمرد",
      titleTr: "Zümrüt Tepeler Villası",
      descriptionEn: "Coastal minimalism meets contemporary luxury in this Dubai masterpiece.",
      descriptionAr: "البساطة الساحلية تلتقي بالفخامة المعاصرة في هذه التحفة الفنية في دبي.",
      descriptionTr: "Bu Dubai şaheserinde kıyı minimalizmi çağdaş lüksle buluşuyor.",
      materialEn: "Travertine, Glass, White Oak",
      materialAr: "الحجر الجيري، الزجاج، البلوط الأبيض",
      materialTr: "Traverten, Cam, Beyaz Meşe",
      styleEn: "Coastal Minimalism",
      styleAr: "بساطة ساحلية",
      styleTr: "Kıyı Minimalizmi",
      specs: { Area: "15,000 sq ft", Bedrooms: "6", Bathrooms: "7" }
    },
    {
      slug: "bosphorus-penthouse",
      category: "Interior",
      subCategory: "Penthouse",
      roomType: "Living Room",
      year: 2023,
      images: ["https://lh3.googleusercontent.com/aida-public/AB6AXuB0rYtNJ5OC741aRcVw-FPniveLENKDmtmuzf6AMnucFd6ZV_mCOa0CQhcBIjHibA5PJ8PdQ7juDM3Ec9a7nRk5Qv6YjatCWmSbGcmEzaLek0M8VW6RO4Abk_T2-ksra-d8wP-Nq4PH4hfNA9Yrcag1_oG02AZvV0RizG9x1lCX6EdKsICC1riKWiXo5riCYWRWHj6jrlbIV0ksGBIPZhlaqYhqJqdOKRsjtcl33_lCatBKAqvK3AuW1Lyzu8IKWpukD-wS8E-a-9IN",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=1600"],
      featured: true,
      budget: "Premium",
      locationEn: "ISTANBUL",
      locationAr: "إسطنبول",
      locationTr: "İSTANBUL",
      titleEn: "Bosphorus Penthouse",
      titleAr: "بنتهاوس البوسفور",
      titleTr: "Boğaziçi Penthouse",
      descriptionEn: "An exquisite penthouse blending Ottoman heritage with modernist design.",
      descriptionAr: "بنتهاوس رائع يمزج التراث العثماني مع التصميم الحديث.",
      descriptionTr: "Osmanlı mirasını modernist tasarımla harmanlayan zarif bir penthouse.",
      materialEn: "Marble, Brass, Walnut",
      materialAr: "الرخام، النحاس، الجوز",
      materialTr: "Mermer, Pirinç, Ceviz",
      styleEn: "Contemporary Monolithic",
      styleAr: "أحادي الهيكل المعاصر",
      styleTr: "Modern Monolitik",
      specs: { Area: "8,000 sq ft", Bedrooms: "4", Bathrooms: "5" }
    },
    {
      slug: "the-onyx-sanctuary",
      category: "Interior",
      subCategory: "Residential",
      roomType: "Living Room",
      year: 2024,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDE2cq6YrbqjfNcUlykUwI2wx1sbzL-19MVNdtaTFBxpUFyLUR4k0RRi-27fSmrxRvO6w6LcDZEQwilcff-J7t1Zcry5d5nUOsjENgWDcFv-IA1Mc1JcTexVu1PGJzSuW52u16vXyrNob2Zjo-fdRXATCvH0cIJba_HjbN4zKMspQWncBIBYuXVpOLam6V5fNvi66MDAwWTt3isyKUsztGkwySYSAvLbgMoIxqHc0f7KBvXx_d6BuOW21PP9JR_B258_bWMbgAWlpUI",
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDg-70ZBH9uChm-Q7hg84E5AtIta9Ku1C_Q6oD0QsvSBHaIFAwtG7RBkbLHMZ5tPXIoD3nH_ntNJ6tli560FWFoIO9SNW2zkcmfN37YhB__WfSFMrkMZWHj0UoUyS9spuQRRsnQcsPoDN-_dHkZC9DuJn9F-SgWjr60WrAtydVzg8Mz6kYrYiXS-FLD8yZo6-DTwrU_xzuE8uUjQpZ13o_XCTAcF9fJ4XlbA68-d9U_aWtintSc634CA_4_HAWwyzKnhQuyW955Lgd5",
      ],
      beforeImage: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&q=80&w=800",
      afterImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDE2cq6YrbqjfNcUlykUwI2wx1sbzL-19MVNdtaTFBxpUFyLUR4k0RRi-27fSmrxRvO6w6LcDZEQwilcff-J7t1Zcry5d5nUOsjENgWDcFv-IA1Mc1JcTexVu1PGJzSuW52u16vXyrNob2Zjo-fdRXATCvH0cIJba_HjbN4zKMspQWncBIBYuXVpOLam6V5fNvi66MDAwWTt3isyKUsztGkwySYSAvLbgMoIxqHc0f7KBvXx_d6BuOW21PP9JR_B258_bWMbgAWlpUI",
      featured: true,
      budget: "Ultra-Luxury",
      collectionId: collections[1]?.id ?? null,
      locationEn: "Malibu, USA",
      locationAr: "ماليبو، الولايات المتحدة الأمريكية",
      locationTr: "Malibu, ABD",
      titleEn: "The Onyx Sanctuary",
      titleAr: "ملاذ الأونيكس",
      titleTr: "Onyx Sığınağı",
      descriptionEn: "An 18,000 sq ft coastal estate redefining the boundary between architecture and nature. Featuring dark teal pools, slate decks, and seamless transitions.",
      descriptionAr: "عقار ساحلي بمساحة 18,000 قدم مربع يعيد تعريف الحدود بين العمارة والطبيعة. يتميز بأحواض سباحة بلون البط البري الداكن وأسطح من الأردواز وتناغم سلس.",
      descriptionTr: "Mimari ve doğa arasındaki sınırı yeniden tanımlayan 18.000 metrekarelik sahil mülkü. Koyu deniz mavisi havuzlar, arduvaz teraslar ve kesintisiz geçişler barındırır.",
      materialEn: "Slate, Basalt, Glass",
      materialAr: "الأردواز، البازلت، الزجاج",
      materialTr: "Arduvaz, Bazalt, Cam",
      styleEn: "Monolithic Minimalist",
      styleAr: "بسيط أحادي الهيكل",
      styleTr: "Monolitik Minimalist",
      specs: { Area: "18,000 sq ft", Bedrooms: "6", Bathrooms: "8", "Pool Type": "Infinity Glass-Enclosed" },
    },
    {
      slug: "obsidian-loft",
      category: "Interior",
      subCategory: "Residential",
      roomType: "Living Room",
      year: 2024,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCyivt5rwgPfHb4_7iVjREEvM5t9NQBnuWk2Zp53c3NIqkXjERfSH-PMqpCo9JU3AtSYNZ79ytEa5i-vP1uVIKuueXwAt0cYbYRS9UBZqVmHLRmLrjra_5ZNGwIbSbeKQ_9lr1oCAo7-zIB1mOt2SB_vqUgdC5HNePZBgVLRxLeIDib5DE9gsAM3VfsNKTs7I7sg_TN2t4eBbMOc05crCv26IqdDNUSE7l-3_Wyq4Z_nl3mPk46JDERyTmzxnyVcKR7E_o2E7l845UL",
        "https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=1600",
      ],
      featured: true,
      budget: "Premium",
      collectionId: collections[0]?.id ?? null,
      locationEn: "Reykjavík, Iceland",
      locationAr: "ريكيافيك، أيسلندا",
      locationTr: "Reykjavik, İzlanda",
      titleEn: "Obsidian Loft",
      titleAr: "لوفت أوبسيديان",
      titleTr: "Obsidian Çatı Katı",
      descriptionEn: "A cinematic, low-angle shot of a monolithic modern penthouse living room at dusk. The space features floor-to-ceiling glass walls reflecting a moody city skyline.",
      descriptionAr: "لقطة سينمائية بزاوية منخفضة لغرفة معيشة في بنتهاوس عصري متكامل عند الغسق. يتميز الفضاء بجدران زجاجية ممتدة من الأرض إلى السقف تعكس أفق المدينة المزاجي.",
      descriptionTr: "Alacakaranlıkta monolitik modern bir çatı katı oturma odasının sinematik, düşük açılı çekimi. Mekan, kasvetli bir şehir manzarasını yansıtan tavandan tabana cam duvarlara sahip.",
      materialEn: "Velvet, Silk, Obsidian",
      materialAr: "المخمل، الحرير، السبج",
      materialTr: "Kadife, İpek, Obsidyen",
      styleEn: "Nocturnal Luxury",
      styleAr: "فخامة ليلية",
      styleTr: "Gece Lüksü",
      specs: { "Ceiling Height": "Double height", "Rug Material": "100% Silk", Lighting: "Golden Recessed Wood Strip" },
    },
    {
      slug: "the-pavilion-house",
      category: "Interior",
      subCategory: "Residential",
      roomType: "Living Room",
      year: 2024,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCz_4i9gKKu6qSVqpBKYSCP30ymTkbnBSmAF1C6PjFyyWgPMFf0vBbdJ4eoQx2fr1izO2JkqjIBYCeKBEaJapKnh6Gm0KZz-isF3zAQ2Qw0iUlXRmk9c0jGylzO449pHrT0ZRWQvjtWhgxUV7kZRaah5YaB6ikM_oL2-iCvotsF0wOGuwprGu0rUYgbR7U2TroWwj1jNUQYCoAL565ZHNyIRMNYAjGqwLvXP81hqvWnWP0K-zK4E6LC-TSRVFdXdLqW41RXfBbhXjcV",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600",
      ],
      featured: true,
      budget: "Premium",
      collectionId: collections[2]?.id ?? null,
      locationEn: "Monaco",
      locationAr: "موناكو",
      locationTr: "Monako",
      titleEn: "The Pavilion House",
      titleAr: "بيت الجناح",
      titleTr: "Pavyon Evi",
      descriptionEn: "A sanctuary of light and glass. This project redefines coastal luxury through a dialogue of raw concrete and refined oak, creating a seamless transition to the landscape.",
      descriptionAr: "ملاذ من الضوء والزجاج. يعيد هذا المشروع تعريف الفخامة الساحلية من خلال حوار بين الخرسانة الخام والبلوط المصقول، مما يخلق انتقالًا سلسًا إلى المناظر الطبيعية.",
      descriptionTr: "Işık ve camın sığınağı. Bu proje, ham beton ve işlenmiş meşenin diyalogu yoluyla kıyı lüksünü yeniden tanımlayarak peyzaja kesintisiz bir geçiş yaratıyor.",
      materialEn: "Raw Concrete, Refined Oak",
      materialAr: "الخرسانة الخام، البلوط المصقول",
      materialTr: "Ham Beton, Rafine Meşe",
      styleEn: "Coastal Minimalism",
      styleAr: "بساطة ساحلية",
      styleTr: "Kıyı Minimalizmi",
      specs: { Location: "French Riviera", Flooring: "Refined Oak Plank", Windows: "Double Glazed Minimal Framing" },
    },
    {
      slug: "monolith-kitchen",
      category: "Interior",
      subCategory: "Culinary",
      roomType: "Kitchen",
      year: 2023,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC8qwXP8rA4eDj_4xFm2Tr4B61qXLTTjq0QSsQTq7sZKIwBRURaqznFpYECLDbeG88EAzutlepDLI3zclalXBFUSfZZY4nlPc4EONMlxE3eudaPSaoVqr3BwuyQMEW0HYXAZeqF3WA1Lx7AW6uu6NDUnucw6xROWzhRFyOQNWFWP8h08t8d0O4FDVRM7SJVJm8BSeNsmWwCUG83PPR2PyQscjvEJhdNoYgueCqM_QPS8aYITRsWR1U2NsGjv6VrdmaODnlJRhLZX9ij",
        "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
      ],
      featured: false,
      budget: "Premium",
      locationEn: "Milan, Italy",
      locationAr: "ميلانو، إيطاليا",
      locationTr: "Milano, İtalya",
      titleEn: "Monolith Kitchen",
      titleAr: "مطبخ المونوليث",
      titleTr: "Monolit Mutfak",
      descriptionEn: "A minimalist marble kitchen island in a dark-themed interior. The island is made of heavily veined black Calacatta marble, with brushed brass details.",
      descriptionAr: "جزيرة مطبخ رخامية بسيطة في تصميم داخلي بطابع داكن. الجزيرة مصنوعة من رخام كالاكاتا الأسود المعرق بكثافة، مع تفاصيل نحاسية مصقولة.",
      descriptionTr: "Koyu temalı bir iç mekanda minimalist bir mermer mutfak adası. Ada, fırçalanmış pirinç detaylara sahip, yoğun damarlı siyah Calacatta mermerinden yapılmıştır.",
      materialEn: "Black Calacatta Marble, Brass",
      materialAr: "رخام كالاكاتا الأسود، النحاس",
      materialTr: "Siyah Calacatta Mermeri, Pirinç",
      styleEn: "Contemporary Monolithic",
      styleAr: "أحادي الهيكل المعاصر",
      styleTr: "Modern Monolitik",
      specs: { "Stone Type": "Calacatta Black Marble", Faucets: "Brushed Brass", Cabinetry: "Matte Lacquer" },
    },
    {
      slug: "the-obsidian-series",
      category: "Furniture",
      subCategory: "Table",
      roomType: "Dining Room",
      year: 2024,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBmSWaExIzPm9rNYSDlatknR01l07FK_janypjSr5MPy58ufOQLMEEPMDr67b0hj2EAToJETtJL2ADhFNHWesKZM85GcfRkGOrV0rQbTAQOtCk4qVsBRt9Ada26kmpRSKThFo34TUVnV_-WNO6rhgaxbCq0QIL5aVjr2xhkrrH5JNYHIx-JC4R3hhLKTfV8MS06jym14HY_gnf07d_fj8ApcsqLHB2eymBmY8DXepDeDwGuuMKMPfq_ihz2takHUBoV9hd9oaHTGXCq",
        "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
      ],
      price: 12500,
      featured: true,
      budget: "Bespoke",
      collectionId: collections[0]?.id ?? null,
      locationEn: "Milan Workshop",
      locationAr: "ورشة ميلان",
      locationTr: "Milano Atölyesi",
      titleEn: "The Obsidian Series",
      titleAr: "سلسلة أوبسيديان",
      titleTr: "Obsidian Serisi",
      descriptionEn: "A sculptural, minimalist black marble dining table centerpiece. Exudes luxury and architectural precision, featuring a palette of deep obsidian.",
      descriptionAr: "طاولة طعام منحوتة وبسيطة من الرخام الأسود. تشع بالفخامة والدقة المعمارية، وتتميز بلوحة ألوان من السبج العميق.",
      descriptionTr: "Heykelsi, minimalist siyah mermer yemek masası parçası. Derin obsidyen renk paleti ile lüks ve mimari hassasiyet sunar.",
      materialEn: "Black Marquina Marble",
      materialAr: "رخام ماركينا الأسود",
      materialTr: "Siyah Marquina Mermeri",
      styleEn: "Sculptural Minimalism",
      styleAr: "بساطة منحوتة",
      styleTr: "Heykelsi Minimalizm",
      specs: { Dimensions: "240cm x 110cm x 75cm", Weight: "320 kg", Finish: "Honed Matte" },
    },
    {
      slug: "ethereal-lounge",
      category: "Furniture",
      subCategory: "Chair",
      roomType: "Living Room",
      year: 2024,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBViH6-QQGnf5wCvDYdjBnzAqeYO7JntCIURtvzNLaesMPGazczNRELx6M62vfun61S9p0AXYeXaqhOhT5AKODB4tYaFO6qOMoW32vUYwaBMc8_ugysRGrENF_shhCgCiTzQc2WziAyhIockcgqk6KbQ6McEJQUu3yG-LBNBu5gjs640I_qZ8MReFwbhwb42Zc-npQQitvACMG3VOov9o7RHh7IF-koTZvib2DLfyYJlpdm3He0MCxe3cGzG2Yo99HmG5HRH3pX81dJ",
        "https://images.unsplash.com/photo-1600585154363-67eb9e2e2099?auto=format&fit=crop&q=80&w=1600",
      ],
      price: 4800,
      featured: true,
      budget: "Premium",
      collectionId: collections[0]?.id ?? null,
      locationEn: "Istanbul Atelier",
      locationAr: "مشغل اسطنبول",
      locationTr: "İstanbul Atölyesi",
      titleEn: "Ethereal Lounge Chair",
      titleAr: "كرسي صالة إيثريال",
      titleTr: "Ethereal Dinlenme Koltuğu",
      descriptionEn: "A curated arrangement of ethereal, cream-colored velvet lounge chairs. Soft and ambient design highlighting the rich textures against solid backdrops.",
      descriptionAr: "مجموعة منسقة من كراسي الاسترخاء المخملية بلون كريمي أثيري. تصميم ناعم ومحيط يسلط الضوء على القوام الغني مقابل الخلفيات الصلبة.",
      descriptionTr: "Krem rengi kadife dinlenme koltuklarının küratörlüğünde bir aranjman. Sert arka planlar üzerinde zengin dokuları vurgulayan yumuşak ve ortam odaklı tasarım.",
      materialEn: "Premium Bouclé Velvet, Brushed Steel",
      materialAr: "مخمل بوكليه فاخر، فولاذ مصقول",
      materialTr: "Birinci Sınıf Buklet Kadife, Fırçalanmış Çelik",
      styleEn: "Contemporary Brutalism",
      styleAr: "وحشية معاصرة",
      styleTr: "Modern Brutalizm",
      specs: { Upholstery: "High-pile Belgian Velvet", Base: "Solid Stainless Steel Frame", "Color Options": "Alabaster, Charcoal, Sage" },
    },
    {
      slug: "nocturne-storage",
      category: "Furniture",
      subCategory: "Cabinet",
      roomType: "Dining Room",
      year: 2023,
      images: [
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDiz7uWOmkDxObsXHhACwsA2mNaexpyLzo2_LP3AK3XNcuUlCLyifgj_1eyxT2VnuqQ9T6u3cfF01Z9U0QDehELRNG3HmI50LlIBi_yrDqcvrLjrOvDu3IS8a0uE1cxHjDG30dLzb94QoOwkqalglh0mo_FHt8XFEGCoAe6-91CoQxGRvpOz1HTJN9dSo2iFpn2mfZ8cmJeALyPXm0Jy8rkBpYadP8mae1Kffef0MilBjJYFYsjBa5rmelCsnpp4pr-k-Vkp4TGa13w",
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1600",
      ],
      price: 8900,
      featured: false,
      budget: "Ultra-Luxury",
      collectionId: collections[1]?.id ?? null,
      locationEn: "Turkish Woods",
      locationAr: "أخشاب تركية",
      locationTr: "Türk Ormanları",
      titleEn: "Nocturne Credenza",
      titleAr: "خزانة نوكتورن",
      titleTr: "Nocturne Konsol",
      descriptionEn: "An exquisite walnut wood cabinet with intricate brass inlays, standing against a dark charcoal wall. Redefines mid-century modern influences.",
      descriptionAr: "خزانة رائعة من خشب الجوز مع تطعيمات نحاسية معقدة، تقف على جدار فحم داكن. تعيد تعريف تأثيرات منتصف القرن الحديث.",
      descriptionTr: "Koyu kömür grisi bir duvarın önünde duran, karmaşık pirinç kakmalara sahip seçkin bir ceviz ahşap dolap. Yüzyıl ortası modern etkilerini yeniden tanımlar.",
      materialEn: "Turkish Walnut, Solid Brass",
      materialAr: "الجوز التركي، النحاس الصلب",
      materialTr: "Türk Cevizi, Masif Pirinç",
      styleEn: "Mid-Century Modern Redefined",
      styleAr: "تحديث طراز منتصف القرن",
      styleTr: "Yeniden Tanımlanmış Yüzyıl Ortası",
      specs: { "Cabinet Wood": "Solid Turkish Walnut", Hardware: "Custom Cast Brass Inlays", Dimensions: "200cm x 50cm x 80cm" },
    },
  ];

  const createdProducts = [];
  for (const prod of productsData) {
    const created = await prisma.product.create({ data: prod });
    createdProducts.push(created);
  }

  // ── Deals (big projects bundling multiple products) ──
  const dealsData = [
    {
      slug: "bosphorus-prime-residence",
      clientName: "Al Shoumari Group",
      coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1600",
      images: [
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=1600",
      ],
      year: 2024,
      status: "Completed",
      featured: true,
      titleEn: "Bosphorus Prime Residence",
      titleAr: "مقر إقامة البوسفور الفاخر",
      titleTr: "Boğaziçi Başlıca Konutu",
      descriptionEn: "A comprehensive turnkey project encompassing full interior design and custom furniture for a 25,000 sq ft waterfront estate on the Bosphorus. Delivered as a unified vision blending Ottoman heritage with contemporary monolithic aesthetics.",
      descriptionAr: "مشروع تسليم مفتاح شامل يشمل التصميم الداخلي الكامل والأثاث المخصص لعقار مطّل على البوسفور بمساحة 25,000 قدم مربع. تم تسليمه كرؤية موحدة تمزج التراث العثماني مع الجماليات الأحادية المعاصرة.",
      descriptionTr: "Boğaz'da 25.000 metrekarelik bir sahil mülkü için kapsamlı bir anahtar teslim proje. Osmanlı mirasını çağdaş monolitik estetikle harmanlayan birleşik bir vizyon olarak teslim edildi.",
      productSlugs: ["the-onyx-sanctuary", "obsidian-loft", "the-obsidian-series", "ethereal-lounge"],
    },
    {
      slug: "monaco-coastal-collection",
      clientName: "LVMH Hospitality",
      coverImage: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1600",
      images: [
        "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&q=80&w=1600",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600",
      ],
      year: 2024,
      status: "Completed",
      featured: true,
      titleEn: "Monaco Coastal Collection",
      titleAr: "مجموعة موناكو الساحلية",
      titleTr: "Monako Kıyı Koleksiyonu",
      descriptionEn: "An exclusive hospitality project delivering the complete interior and furniture package for a private luxury villa compound on the French Riviera. Included custom dining, lounge, and cabinetry across six pavilions.",
      descriptionAr: "مشروع ضيافة حصري يقدم حزمة التصميم الداخلي والأثاث الكاملة لمجمع فيلات فاخرة خاصة على الريفييرا الفرنسية. شملت طاولات طعام مخصصة وغرف جلوس وخزائن عبر ستة أجنحة.",
      descriptionTr: "Fransız Rivierası'nda özel bir lüks villa kompleksi için komple iç mekan ve mobilya paketi sunan özel bir konaklama projesi. Altı pavyonda özel yemek, lounge ve dolap işçiliği dahildir.",
      productSlugs: ["the-pavilion-house", "the-obsidian-series", "ethereal-lounge", "monolith-kitchen"],
    },
    {
      slug: "istanbul-design-atelier",
      clientName: "Kıraça Holding",
      coverImage: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1600",
      images: [
        "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&q=80&w=1600",
      ],
      year: 2025,
      status: "In Progress",
      featured: false,
      titleEn: "Istanbul Design Atelier",
      titleAr: "أتيليه التصميم في اسطنبول",
      titleTr: "İstanbul Tasarım Atölyesi",
      descriptionEn: "A flagship showroom and design studio project in Levent, Istanbul. Combining workspace interior design with a curated collection of furniture pieces for client-facing areas. Currently in the installation phase.",
      descriptionAr: "مشروع صالة عرض رئيسية واستوديو تصميم في ليفنت، اسطنبول. يجمع بين التصميم الداخلي لمساحة العمل ومجموعة مختارة من قطع الأثاث لمناطق استقبال العملاء. حاليًا في مرحلة التركيب.",
      descriptionTr: "Levent, İstanbul'da bir amiral gemisi showroom ve tasarım stüdyosu projesi. Müşteri alanları için ofis iç mekan tasarımı ile seçkin mobilya parçalarını birleştiriyor. Şu anda kurulum aşamasında.",
      productSlugs: ["nocturne-storage", "ethereal-lounge"],
    },
  ];

  for (const deal of dealsData) {
    const { productSlugs, ...dealData } = deal;
    const linkedProducts = createdProducts.filter((p) => productSlugs.includes(p.slug));
    await prisma.deal.create({
      data: {
        ...dealData,
        products: {
          create: linkedProducts.map((p) => ({ productId: p.id })),
        },
      },
    });
  }

  console.log("Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
