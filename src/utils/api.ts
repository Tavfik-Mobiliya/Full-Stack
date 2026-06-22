import {
  AuthResponse,
  AuthSession,
  Collection,
  CollectionPayload,
  Deal,
  DealPayload,
  Inquiry,
  InquiryPayload,
  Product,
  ProductFilters,
  ProductPayload,
  Testimonial,
  TestimonialPayload,
  CompanySettings,
} from "@/types/api";
import { cacheGet, cacheSet, cacheClear } from "./cache";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

async function fetchWithRetry(url: string, config: RequestInit): Promise<Response | null> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, config);
      return response;
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
  throw new Error("fetchWithRetry exhausted");
}

function isGetRequest(options: RequestInit): boolean {
  return !options.method || options.method === "GET";
}

function cacheKey(endpoint: string, options: RequestInit): string {
  return `${options.method || "GET"} ${endpoint}`;
}

function resourcePrefix(endpoint: string): string {
  const parts = endpoint.split(/[\/?]/).filter(Boolean);
  return parts.length > 0 ? `GET /${parts[0]}` : "GET";
}

export async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T | null> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers as Record<string, string>,
  };

  const config = {
    ...options,
    headers,
    credentials: "include" as RequestCredentials,
  };

  const key = cacheKey(endpoint, options);

  if (isGetRequest(options)) {
    const cached = cacheGet<T>(key);
    if (cached !== undefined) return cached;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetchWithRetry(url, { ...config, signal: controller.signal });
    clearTimeout(timeoutId);
    if (!response) return null;
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    const data = (await response.json()) as T;
    if (isGetRequest(options)) {
      const ttl = endpoint.includes("/products/") || endpoint.includes("/deals/") || endpoint.includes("/collections/")
        ? 10 * 60 * 1000
        : 5 * 60 * 1000;
      cacheSet(key, data, ttl);
    }
    return data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API Fetch Error [${endpoint}]: ${toErrorMessage(error)}`);
    return null;
  }
}

function invalidateResource(endpoint: string): void {
  const prefix = resourcePrefix(endpoint);
  cacheClear(prefix);
}

// Products APIs
export const apiProducts = {
  getAll: (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.append(key, String(val));
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI<Product[]>(`/products${queryString}`).then((data) => data ?? []);
  },

  getBySlug: (slug: string) => {
    return fetchAPI<Product>(`/products/${slug}`);
  },

  create: (data: ProductPayload) => {
    invalidateResource("/products");
    return fetchAPI<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: ProductPayload) => {
    invalidateResource("/products");
    return fetchAPI<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    invalidateResource("/products");
    return fetchAPI<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Testimonials APIs
export const apiTestimonials = {
  getAll: (category?: string) => {
    const query = category ? `?category=${category}` : "";
    return fetchAPI<Testimonial[]>(`/testimonials${query}`).then((data) => data ?? []);
  },

  create: (data: TestimonialPayload) => {
    invalidateResource("/testimonials");
    return fetchAPI<Testimonial>("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: TestimonialPayload) => {
    invalidateResource("/testimonials");
    return fetchAPI<Testimonial>(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    invalidateResource("/testimonials");
    return fetchAPI<{ message: string }>(`/testimonials/${id}`, {
      method: "DELETE",
    });
  },
};

// Collections APIs
export const apiCollections = {
  getAll: () => {
    return fetchAPI<Collection[]>("/collections").then((data) => data ?? []);
  },

  create: (data: CollectionPayload) => {
    invalidateResource("/collections");
    return fetchAPI<Collection>("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: CollectionPayload) => {
    invalidateResource("/collections");
    return fetchAPI<Collection>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    invalidateResource("/collections");
    return fetchAPI<{ success: boolean }>(`/collections/${id}`, {
      method: "DELETE",
    });
  },
};

// Inquiries APIs
export const apiInquiries = {
  getAll: () => {
    return fetchAPI<Inquiry[]>("/inquiries").then((data) => data ?? []);
  },

  submit: (data: InquiryPayload) => {
    return fetchAPI<Inquiry>("/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    invalidateResource("/inquiries");
    return fetchAPI<{ message: string }>(`/inquiries/${id}`, {
      method: "DELETE",
    });
  },
};

// Deals APIs
export const apiDeals = {
  getAll: (filters: { featured?: boolean } = {}) => {
    const params = new URLSearchParams();
    if (filters.featured) params.append("featured", "true");
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI<{ data: Deal[]; total: number }>(`/deals${queryString}`).then((res) => res?.data ?? []);
  },

  getBySlug: (slug: string) => {
    return fetchAPI<Deal>(`/deals/${slug}`);
  },

  create: (data: DealPayload) => {
    invalidateResource("/deals");
    return fetchAPI<Deal>("/deals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: DealPayload) => {
    invalidateResource("/deals");
    return fetchAPI<Deal>(`/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    invalidateResource("/deals");
    return fetchAPI<{ success: boolean }>(`/deals/${id}`, {
      method: "DELETE",
    });
  },
};

// Auth APIs
export const apiAuth = {
  login: async (email: string, password: string) => {
    return fetchAPI<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },
  logout: async () => {
    return fetchAPI<AuthResponse>("/auth/logout", {
      method: "POST",
    });
  },
  isLoggedIn: async (): Promise<boolean> => {
    try {
      const url = `${API_BASE_URL}/auth/session`;
      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json() as AuthSession;
        return Boolean(data?.authenticated);
      }
      return false;
    } catch {
      return false;
    }
  }
};

export const apiSettings = {
  get: async (): Promise<CompanySettings | null> => {
    // Cache for 1 hour since settings rarely change
    const cacheKey = "company_settings";
    const cached = cacheGet<CompanySettings>(cacheKey);
    if (cached !== null && cached !== undefined) return cached;

    const data = await fetchAPI<CompanySettings>("/settings");
    if (data) cacheSet(cacheKey, data, 1000 * 60 * 60); // 1 hour
    return data;
  }
};
