import { ICategory } from "@/models/Category";
import { IProduct } from "@/models/Product";
import { IReview } from "@/models/Review";
import { ApiResponse, ApiResponseP } from "@/types/product";

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
  timeout?: number; // Added timeout option
};

class ApiClient {
  private baseUrl: string;
  private defaultTimeout: number;

  constructor() {
    this.baseUrl = this.getBaseUrl();
    this.defaultTimeout = 10000; // 10 seconds default timeout
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
      next,
      timeout = this.defaultTimeout
    } = options;

    const isFormData = body instanceof FormData;
    const defaultHeaders = isFormData 
      ? headers 
      : { 
          "Content-Type": "application/json",
          ...headers 
        };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const config: RequestInit = {
      method,
      headers: defaultHeaders,
      cache,
      next,
      signal: controller.signal,
      body: isFormData ? body : (body ? JSON.stringify(body) : undefined),
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: `Request failed with status ${response.status}`,
          status: response.status
        }));
        
        throw new ApiError(
          errorData.message || `Request failed with status ${response.status}`,
          response.status,
          errorData
        );
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return undefined as T;
      }

      return response.json() as Promise<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof ApiError) {
        console.error(`API Error - ${method} ${endpoint}:`, error.message, error.details);
        throw error;
      }
      
  

      const message = error instanceof Error ? error.message : 'Unknown API error';
      console.error(`API Connection Error - ${method} ${endpoint}:`, message);
      throw new ApiError(message, 500);
    }
  }

  // Category Methods with improved error handling
  async getCategories(): Promise<ICategory[]> {
    return this.fetch<ICategory[]>("/categories", {
      next: { revalidate: 3600 } // Revalidate every hour
    });
  }

  async getCategory(id: string): Promise<ICategory> {
    if (!id) throw new ApiError("Category ID is required", 400);
    return this.fetch<ICategory>(`/categories/${id}`);
  }

  async createCategory(categoryData: CategoryFormData): Promise<ICategory> {
    if (!categoryData) throw new ApiError("Category data is required", 400);
    return this.fetch<ICategory>("/categories", {
      method: "POST",
      body: categoryData
    });
  }

  // ... (similar improvements for all other methods)
  
  // Product Methods with improved validation
  async getProducts(query?: Record<string, string>): Promise<ApiResponse> {
    const queryString = query ? `?${new URLSearchParams(query).toString()}` : "";
    return this.fetch<ApiResponse>(`/products${queryString}`, {
      next: { tags: ['products'] } // Add cache tag
    });
  }

  async getProduct(id: string): Promise<IProduct> {
    if (!id) throw new ApiError("Product ID is required", 400);
    return this.fetch<IProduct>(`/products/id/${id}`);
  }

  async getProductBySlug(slug: string): Promise<ApiResponseP> {
    if (!slug) throw new ApiError("Product slug is required", 400);
    return this.fetch<ApiResponseP>(`/products/${slug}`);
  }

  // ... (continue with other methods)
}

// Custom Error Class
class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }
}

export const apiClient = new ApiClient();