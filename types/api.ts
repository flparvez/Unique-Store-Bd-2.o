import { ICategory } from '@/models/Category';
import { CloudinaryUploadResult } from '@/lib/cloudinary';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export type CategoryResponse = ApiResponse<ICategory | ICategory[]>;
export type UploadResponse = ApiResponse<CloudinaryUploadResult[]>;