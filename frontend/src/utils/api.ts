const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api";

export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    throw error;
  }
}

// Projects APIs
export const apiProjects = {
  getAll: (filters: Record<string, any> = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        params.append(key, String(val));
      }
    });
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return fetchAPI(`/projects${queryString}`, { cache: "no-store" });
  },

  getBySlug: (slug: string) => {
    return fetchAPI(`/projects/${slug}`, { cache: "no-store" });
  },

  create: (data: any) => {
    return fetchAPI("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: any) => {
    return fetchAPI(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    return fetchAPI(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};

// Testimonials APIs
export const apiTestimonials = {
  getAll: (category?: string) => {
    const query = category ? `?category=${category}` : "";
    return fetchAPI(`/testimonials${query}`, { cache: "no-store" });
  },

  create: (data: any) => {
    return fetchAPI("/testimonials", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: (id: number, data: any) => {
    return fetchAPI(`/testimonials/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    return fetchAPI(`/testimonials/${id}`, {
      method: "DELETE",
    });
  },
};

// Inquiries APIs
export const apiInquiries = {
  getAll: () => {
    return fetchAPI("/inquiries", { cache: "no-store" });
  },

  submit: (data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
    type?: string;
    details?: any;
  }) => {
    return fetchAPI("/inquiries", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  delete: (id: number) => {
    return fetchAPI(`/inquiries/${id}`, {
      method: "DELETE",
    });
  },
};
