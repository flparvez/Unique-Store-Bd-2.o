import { ICategory } from "@/models/Category";
import { IProduct } from "@/models/Product";
import { IReview } from "@/models/Review";
import { ApiResponse, ApiResponseP } from "@/types/product";

export type CategoryFormData = Omit<ICategory, "_id">;
export type ProductFormData = Omit<IProduct, "_id" | "createdAt" | "updatedAt" | "reviews">;
export type ReviewFormData = Omit<IReview, "_id" | "createdAt" | "updatedAt">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
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
    // Use relative path for client-side and SSR
    if (typeof window !== "undefined") {
      return "/api";
    }

    // Handle production environment
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/api`;
    }

    // Default to localhost in development
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
        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      if (response.status === 204) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      console.error(`API Error - ${method} ${endpoint}:`, error);
      throw error instanceof ApiError ? error : new ApiError("Network error", 500);
    }
  }

  // Category Methods
  async getCategories() {
    return this.fetch<ICategory[]>("/categories");
  }

  async getCategory(id: string) {
    return this.fetch<ICategory>(`/categories/${id}`);
  }

  async createCategory(categoryData: CategoryFormData) {
    return this.fetch<ICategory>("/categories", {
      method: "POST",
      body: categoryData,
    });
  }

  async updateCategory(id: string, categoryData: Partial<CategoryFormData>) {
    return this.fetch<ICategory>(`/categories/${id}`, {
      method: "PATCH",
      body: categoryData,
    });
  }

  async deleteCategory(id: string) {
    return this.fetch<void>(`/categories/${id}`, {
      method: "DELETE",
    });
  }

  // Product Methods
  async getProducts(query?: Record<string, string>) {
    const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
    return this.fetch<ApiResponse>(`/products${queryString}`);
  }

  async getProduct(id: string) {
    return this.fetch<ApiResponseP>(`/products/id/${id}`);
  }

  async getProductBySlug(slug: string) {
    return this.fetch<ApiResponseP>(`/products/${slug}`);
  }

  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }

  async updateProduct(id: string, productData: Partial<ProductFormData>) {
    return this.fetch<IProduct>(`/products/${id}`, {
      method: "PATCH",
      body: productData,
    });
  }

  async deleteProduct(id: string) {
    return this.fetch<void>(`/products/${id}`, {
      method: "DELETE",
    });
  }

  // Review Methods
  async getProductReviews(productId: string) {
    return this.fetch<IReview[]>(`/products/${productId}/reviews`);
  }

  async createReview(productId: string, reviewData: ReviewFormData) {
    return this.fetch<IReview>(`/products/${productId}/reviews`, {
      method: "POST",
      body: reviewData,
    });
  }

  async updateReview(reviewId: string, reviewData: Partial<ReviewFormData>) {
    return this.fetch<IReview>(`/reviews/${reviewId}`, {
      method: "PATCH",
      body: reviewData,
    });
  }

  async deleteReview(reviewId: string) {
    return this.fetch<void>(`/reviews/${reviewId}`, {
      method: "DELETE",
    });
  }
}

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const apiClient = new ApiClient();