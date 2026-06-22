export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface Product {
  id: number;
  slug: string;
  category: string;
  subCategory?: string | null;
  roomType?: string | null;
  year: number | string;
  images: string[];
  specs?: Record<string, unknown> | null;
  beforeImage?: string | null;
  afterImage?: string | null;
  price?: number | string | null;
  budget?: string | null;
  featured?: boolean;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionTr: string;
  locationEn: string;
  locationAr: string;
  locationTr: string;
  materialEn?: string | null;
  materialAr?: string | null;
  materialTr?: string | null;
  styleEn?: string | null;
  styleAr?: string | null;
  styleTr?: string | null;
  collectionId?: number | null;
  collection?: {
    id: number;
    nameEn: string;
    nameAr: string;
    nameTr: string;
  } | null;
}

export interface Collection {
  id: number;
  nameEn: string;
  nameAr: string;
  nameTr: string;
  createdAt?: string;
  updatedAt?: string;
  products?: Product[];
}

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  type: string;
  details?: Record<string, unknown> | null;
  createdAt?: string;
}

export interface Testimonial {
  id: number;
  author: string;
  category?: string;
  rating?: number;
  quoteEn: string;
  quoteAr: string;
  quoteTr: string;
  roleEn: string;
  roleAr: string;
  roleTr: string;
  createdAt?: string;
}

export interface AuthSession {
  authenticated: boolean;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
}

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  roomType?: string;
  budget?: string;
  featured?: boolean;
  search?: string;
  material?: string;
  style?: string;
  priceMin?: string | number;
  priceMax?: string | number;
  page?: string | number;
  pageSize?: string | number;
}

export interface InquiryPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  type?: string;
  details?: Record<string, unknown>;
}

export interface ProductPayload {
  slug: string;
  category: string;
  subCategory?: string | null;
  roomType?: string | null;
  year: number;
  images: string[];
  specs?: Record<string, unknown>;
  beforeImage?: string | null;
  afterImage?: string | null;
  price?: number | null;
  budget?: string | null;
  featured?: boolean;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionTr: string;
  locationEn: string;
  locationAr: string;
  locationTr: string;
  materialEn?: string | null;
  materialAr?: string | null;
  materialTr?: string | null;
  styleEn?: string | null;
  styleAr?: string | null;
  styleTr?: string | null;
  collectionId?: number | null;
}

export interface CollectionPayload {
  nameEn: string;
  nameAr: string;
  nameTr: string;
}

export interface Deal {
  id: number;
  slug: string;
  clientName?: string | null;
  coverImage?: string | null;
  images: string[];
  year: number;
  status: string;
  featured?: boolean;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionTr: string;
  products?: { product: Product }[];
  createdAt?: string;
}

export interface DealPayload {
  slug: string;
  clientName?: string | null;
  coverImage?: string | null;
  images: string[];
  year: number;
  status?: string;
  featured?: boolean;
  titleEn: string;
  titleAr: string;
  titleTr: string;
  descriptionEn: string;
  descriptionAr: string;
  descriptionTr: string;
  productIds?: number[];
}

export interface TestimonialPayload {
  author: string;
  category?: string;
  rating?: number;
  quoteEn: string;
  quoteAr: string;
  quoteTr: string;
  roleEn: string;
  roleAr: string;
  roleTr: string;
}

export interface CompanySettings {
  id: number;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  instagramUrl?: string;
  twitterUrl?: string;
  updatedAt?: string;
}
