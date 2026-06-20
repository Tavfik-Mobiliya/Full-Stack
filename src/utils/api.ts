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
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

async function fetchWithRetry(url: string, config: RequestInit, retries: number): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, config);
      return response;
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = [1000, 2000, 3000, 4000][attempt] ?? 5000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("fetchWithRetry exhausted");
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

  try {
    const response = await fetchWithRetry(url, config, 4);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorData = (await response.json().catch(() => ({}))) as { error?: string };
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]: ${toErrorMessage(error)}`);
    throw error instanceof Error ? error : new Error("Unknown API error");
  }
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
    return fetchAPI<Product[]>(`/products${queryString}`, { cache: "no-store" }).then((data) => data ?? []);
  },

  getBySlug: (slug: string) => {
    return fetchAPI<Product>(`/products/${slug}`, { cache: "no-store" });
  },

  create: (data: ProductPayload) => {
    return fetchAPI<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: ProductPayload) => {
    return fetchAPI<Product>(`/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    return fetchAPI<{ message: string }>(`/products/${id}`, {
      method: "DELETE",
    });
  },
};

// Testimonials APIs
export const apiTestimonials = {
  getAll: (category?: string) => {
    const query = category ? `?category=${category}` : "";
    return fetchAPI<Testimonial[]>(`/testimonials${query}`, { cache: "no-store" }).then((data) => data ?? []);
  },

  create: (data: TestimonialPayload) => {
    return fetchAPI<Testimonial>("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: TestimonialPayload) => {
    return fetchAPI<Testimonial>(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    return fetchAPI<{ message: string }>(`/testimonials/${id}`, {
      method: "DELETE",
    });
  },
};

// Collections APIs
export const apiCollections = {
  getAll: () => {
    return fetchAPI<Collection[]>("/collections", { cache: "no-store" }).then((data) => data ?? []);
  },

  create: (data: CollectionPayload) => {
    return fetchAPI<Collection>("/collections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: CollectionPayload) => {
    return fetchAPI<Collection>(`/collections/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    return fetchAPI<{ success: boolean }>(`/collections/${id}`, {
      method: "DELETE",
    });
  },
};

// Inquiries APIs
export const apiInquiries = {
  getAll: () => {
    return fetchAPI<Inquiry[]>("/inquiries", { cache: "no-store" }).then((data) => data ?? []);
  },

  submit: (data: InquiryPayload) => {
    return fetchAPI<Inquiry>("/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
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
    return fetchAPI<{ data: Deal[]; total: number }>(`/deals${queryString}`, { cache: "no-store" }).then((res) => res?.data ?? []);
  },

  getBySlug: (slug: string) => {
    return fetchAPI<Deal>(`/deals/${slug}`, { cache: "no-store" });
  },

  create: (data: DealPayload) => {
    return fetchAPI<Deal>("/deals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: DealPayload) => {
    return fetchAPI<Deal>(`/deals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
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
