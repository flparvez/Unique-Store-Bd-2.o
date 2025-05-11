import { IImage } from "@/models/Category";
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
      slug: string
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
    isActive: boolean;
    status: string;
    createdAt?: Date;
    updatedAt?: Date;
    lastUpdatedIndex? : number
    advanced? : number
  }
  export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    tags?: string;
    description?: string;
    images: IImage[];
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
  
  export interface IPagination {
    page: number;
  
    total: number;
    pages: number;
  }

  export interface FilterParams {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
  }
  
  export interface ApiResponse {
    success: boolean;
    products: IProduct[];
    pagination: IPagination;
  }

  
  export interface ApiResponseP {
    success: boolean;
    product: {
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
      isActive: boolean;
      createdAt?: Date;
      updatedAt?: Date;
    };
    
  }

  