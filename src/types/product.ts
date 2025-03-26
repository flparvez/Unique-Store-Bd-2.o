import { IProductImage } from "@/models/Product";
import mongoose from "mongoose";

// types/product.ts
export interface IProduct {
  _id: string;
    name: string;
    slug: string;
    shortName: string;
    description: string;
    category: {
      _id: string;
      name: string;
    };
    price: number;
    originalPrice?: number;
    discount?: number;
    images: IProductImage[];
    stock: number;
    sold: number;
    popularityScore: number;
    video?: string;
    warranty: string;
    specifications: {
      key: string;
      value: string;
    }[];
    seo: string;
    reviews: mongoose.Types.ObjectId[];
    rating?: number;
    isFeatured: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }
  
  export interface IReview {
    _id: string;
    user: {
      _id: string;
      name: string;
      image?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
  }
  
  export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
  }
  
  export interface ApiResponse {
    success: boolean;
    products: IProduct[];
    pagination: Pagination;
  }