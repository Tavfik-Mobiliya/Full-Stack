import {
  AuthResponse,
  AuthSession,
  Collection,
  CollectionPayload,
  Inquiry,
  InquiryPayload,
  Project,
  ProjectFilters,
  ProjectPayload,
  Testimonial,
  TestimonialPayload,
} from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
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
    const response = await fetch(url, config);
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

// Projects APIs
export const apiProjects = {
  getAll: (filters: ProjectFilters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.append(key, String(val));
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI<Project[]>(`/projects${queryString}`, { cache: "no-store" }).then((data) => data ?? []);
  },

  getBySlug: (slug: string) => {
    return fetchAPI<Project>(`/projects/${slug}`, { cache: "no-store" });
  },

  create: (data: ProjectPayload) => {
    return fetchAPI<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: ProjectPayload) => {
    return fetchAPI<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    return fetchAPI<{ message: string }>(`/projects/${id}`, {
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
      const response = await fetchAPI<AuthSession>("/auth/session", {
        method: "GET",
      });
      return Boolean(response?.authenticated);
    } catch {
      return false;
    }
  }
};
