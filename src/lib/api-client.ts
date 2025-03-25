
import { ICategory } from "@/models/Category";




export type CategoryoFormData = Omit<ICategory, "_id">;

type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
};

class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`http://localhost:3000/api${endpoint}`, {
    // const response = await fetch(`https://landig-store.vercel.app/api${endpoint}`, {

      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }



async getCategories() {
    return this.fetch<ICategory[]>("/categories");
}
  // async getVideo(id: string) {
  //   return this.fetch<IVideo>(`/videos/${id}`);
  // }

  
async createCategory(categoryData: CategoryoFormData) {
    return this.fetch<ICategory>("/category", {
      method: "POST",
      body: categoryData,
    });
}

}

export const apiClient = new ApiClient();
