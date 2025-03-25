import { ICategory } from "@/models/Category";
import { IProduct } from "@/models/Product";
import { IReview } from "@/models/Review";

export type CategoryFormData = Omit<ICategory, "_id">;
export type ProductFormData = Omit<IProduct, "_id" | "createdAt" | "updatedAt" | "reviews">;
export type ReviewFormData = Omit<IReview, "_id" | "createdAt" | "updatedAt">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: Record<string, unknown> | FormData;
  headers?: Record<string, string>;
  cache?: RequestCache;
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = this.getBaseUrl();
  }

  private getBaseUrl(): string {
    if (typeof window !== "undefined") {
      // Client-side - use relative path
      return "/api";
    }

    // Server-side - use absolute URL based on environment
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api`;
    }

    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";
  }

  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { 
      method = "GET", 
      body, 
      headers = {}, 
      cache = "no-store",
      next
    } = options;

    const isFormData = body instanceof FormData;
    const defaultHeaders = isFormData 
      ? headers 
      : { 
          "Content-Type": "application/json",
          ...headers 
        };

    const config: RequestInit = {
      method,
      headers: defaultHeaders,
      cache,
      next,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error(`API Error - ${method} ${endpoint}:`, error);
      throw error;
    }
  }

  // Category Methods
  async getCategories(): Promise<ICategory[]> {
    return this.fetch<ICategory[]>("/categories", {
      next: { revalidate: 3600 } // Revalidate every hour
    });
  }

  async getCategory(id: string): Promise<ICategory> {
    return this.fetch<ICategory>(`/categories/${id}`);
  }

  async createCategory(categoryData: CategoryFormData): Promise<ICategory> {
    return this.fetch<ICategory>("/categories", {
      method: "POST",
      body: categoryData
    });
  }

  async updateCategory(id: string, categoryData: Partial<CategoryFormData>): Promise<ICategory> {
    return this.fetch<ICategory>(`/categories/${id}`, {
      method: "PATCH",
      body: categoryData
    });
  }

  async deleteCategory(id: string): Promise<void> {
    return this.fetch<void>(`/categories/${id}`, {
      method: "DELETE"
    });
  }

  // Product Methods
  async getProducts(query?: Record<string, string>): Promise<IProduct[]> {
    const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
    return this.fetch<IProduct[]>(`/products${queryString}`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
  }

  async getProduct(id: string): Promise<IProduct> {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  async createProduct(productData: ProductFormData): Promise<IProduct> {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData
    });
  }

  async updateProduct(id: string, productData: Partial<ProductFormData>): Promise<IProduct> {
    return this.fetch<IProduct>(`/products/${id}`, {
      method: "PATCH",
      body: productData
    });
  }

  async deleteProduct(id: string): Promise<void> {
    return this.fetch<void>(`/products/${id}`, {
      method: "DELETE"
    });
  }

  // Review Methods
  async getProductReviews(productId: string): Promise<IReview[]> {
    return this.fetch<IReview[]>(`/products/${productId}/reviews`);
  }

  async createReview(productId: string, reviewData: ReviewFormData): Promise<IReview> {
    return this.fetch<IReview>(`/products/${productId}/reviews`, {
      method: "POST",
      body: reviewData
    });
  }

  async updateReview(reviewId: string, reviewData: Partial<ReviewFormData>): Promise<IReview> {
    return this.fetch<IReview>(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: reviewData
    });
  }

  async deleteReview(reviewId: string): Promise<void> {
    return this.fetch<void>(`/reviews/${reviewId}`, {
      method: "DELETE"
    });
  }
}

export const apiClient = new ApiClient();