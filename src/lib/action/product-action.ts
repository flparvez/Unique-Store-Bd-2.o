"use server"
import { Product } from '@/models/Product';
import { connectToDb } from '@/lib/db';
import mongoose from 'mongoose';
import {  IProduct } from '@/types/product';
import Category, { ICategory } from '@/models/Category';
import { Order } from '@/models/Order';
import User from '@/models/User';

const PAGE_SIZE = 10;
const MAX_PRICE = 10000000;

// Interfaces
interface FetchProductsParams {
  query?: string;
  category?: string;
  tag?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
}

interface ProductsResponse {
  success: boolean;
  products: IProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface RelatedProductsParams {
  category: string;
  productId: string;
  limit?: number;
  page?: number;
}

// Helper: Determine sort order
function getSortOrder(sort: string): Record<string, 1 | -1> {
  switch (sort) {
    case 'best-selling': return { numSales: -1 };
    case 'price-low-to-high': return { price: 1 };
    case 'price-high-to-low': return { price: -1 };
    case 'top-rated': return { avgRating: -1 };
    case 'newest': return { createdAt: -1 };
    case 'popular': return { popularityScore: -1 };
    default: return { createdAt: -1 };
  }
}

// Main Fetch Functions
export async function fetchProducts(params: FetchProductsParams = {}): Promise<ProductsResponse> {
  await connectToDb();

  const {
    query = '',
    category = '',
    tag = '',
    minPrice = 0,
    maxPrice = MAX_PRICE,
    rating = 0,
    sort = 'newest',
    page = 1,
    limit = PAGE_SIZE,
    featured = false,
  } = params;

  try {
    const filters = {
      ...(query && { name: { $regex: query, $options: 'i' } }),
      ...(category && mongoose.Types.ObjectId.isValid(category) && { category: new mongoose.Types.ObjectId(category) }),
      ...(tag && { tags: tag }),
      price: { $gte: minPrice, $lte: maxPrice },
      ...(rating && { avgRating: { $gte: rating } }),
      ...(featured && { isFeatured: true }),
    };

    const [products, total] = await Promise.all([
      Product.find(filters)
        .sort(getSortOrder(sort)) // ✅ sort logic applied here
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category')
        .lean(),

      Product.countDocuments(filters),
    ]);

    return {
      success: true,
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw new Error('Failed to fetch products');
  }
}
export async function fetchProductById(id: string): Promise<IProduct> {
  await connectToDb();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    }

    const product = await Product.findById(id)
      .populate('category')
      .lean();

    if (!product) {
      throw new Error('Product not found');
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    throw new Error('Failed to fetch product');
  }
}

export async function fetchProductBySlug(slug: string): Promise<IProduct> {
  await connectToDb();

  try {
 

    const product = await Product.findOne({ slug })
      .populate('category')
      .lean();

    if (!product) {
      throw new Error('Product not found');
    }

    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to fetch product by ID:', error);
    throw new Error('Failed to fetch product');
  }
}

export async function fetchRelatedProducts(params: RelatedProductsParams): Promise<ProductsResponse> {
  await connectToDb();
  const { category, productId, limit = 4, page = 1 } = params;
  await Category.find()
  try {
    const filters = {
      isPublished: true,
      category: new mongoose.Types.ObjectId(category),
      _id: { $ne: new mongoose.Types.ObjectId(productId) },
    };

    const [products, total] = await Promise.all([
      Product.find(filters)
        .sort({ numSales: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments(filters),
    ]);

    return {
      success: true,
      products: JSON.parse(JSON.stringify(products)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Failed to fetch related products:', error);
    throw new Error('Failed to fetch related products');
  }
}

export async function fetchFeaturedProducts(limit = 5): Promise<IProduct[]> {
  await connectToDb();
  await Category.find()
  try {
    const products = await Product.find({  isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    throw new Error('Failed to fetch featured products');
  }
}



export async function getAllCategory():Promise<ICategory[]> {
  await connectToDb()

  try {
    const category = await Category.find()
    
    return JSON.parse(JSON.stringify(category));
  } catch (error) {
    console.error('Failed to fetch all Category:', error);
    throw new Error('Failed to fetch all category');
  }
 
}

export async function getAllOrders() {
  await connectToDb()

  try {
    const order = await Order.find()
    
    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error('Failed to fetch all Category:', error);
    throw new Error('Failed to fetch all category');
  }
 
}

export async function getAllUsers() {
  await connectToDb()

  try {
    const user = await User.find()
    
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error('Failed to fetch all Category:', error);
    throw new Error('Failed to fetch all category');
  }
 
}


// delete product
export async function deleteProduct(id: string) {
  await connectToDb();

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Invalid product ID');
    } 
    const product = await Product.findByIdAndDelete(id)
    if (!product) {
      throw new Error('Product not found');
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Failed to delete product:', error);
    throw new Error('Failed to delete product');
  }
}

export async function getAllProducts(): Promise<IProduct[]> {
  await connectToDb();
 await Category.find()
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error('Failed to fetch all products:', error);
    throw new Error('Failed to fetch all products');
  }
}
