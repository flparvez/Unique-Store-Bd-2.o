
import { IVideo } from "@/models/Video";

export type VideoFormData = Omit<IVideo, "_id">;

export interface ICategory {
  _id: string;
  name: string;
  description: string;
  image: string;

}
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

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch<IVideo[]>("/videos");
  }


  async getVideo(id: string) {
    return this.fetch<IVideo>(`/videos/${id}`);
  }

  async createVideo(videoData: VideoFormData) {
    return this.fetch<IVideo>("/videos", {
      method: "POST",
      body: videoData,
    });
  }
async createCategory(categoryData: CategoryoFormData) {
    return this.fetch<ICategory>("/category", {
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
