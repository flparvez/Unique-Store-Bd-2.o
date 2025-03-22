
import { ICategory } from "@/models/Category";



export interface ICategorys {
  _id: string;
  name: string;
  description: string;
  image: string;

}
export type CategoryoFormData = Omit<ICategorys, "_id">;

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

    const response = await fetch(`/api${endpoint}`, {
    // const response = await fetch(`/api${endpoint}`, {
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
    return this.fetch<ICategory[]>("/category");
}
  // async getVideo(id: string) {
  //   return this.fetch<IVideo>(`/videos/${id}`);
  // }

  
async createCategory(categoryData: CategoryoFormData) {
    return this.fetch<ICategorys>("/category", {
      method: "POST",
      body: categoryData,
    });
}
  // ✅ Add deleteVideo method
  async deleteVideo(id: string) {
    return this.fetch(`/videos?id=${id}`, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
