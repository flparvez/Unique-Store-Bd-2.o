import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db';
import { Product } from '@/models/Product';
import Category from '@/models/Category';
import { HydratedDocument } from 'mongoose';
import { IProduct } from '@/types/product'; // 👈 your product interface path

export async function GET(req: NextRequest) {
  try {
    await connectToDb();
     await Category.find();
    const { searchParams } = new URL(req.url);

    const query: string = searchParams.get('query')?.trim() || '';
    const minPrice: number = parseFloat(searchParams.get('minPrice') || '0') || 0;
    const maxPrice: number = parseFloat(searchParams.get('maxPrice') || '1000000') || 1000000;
    const sort: string = searchParams.get('sort') || 'newest';
    const featured: boolean = searchParams.get('featured') === 'true';
    const page: number = parseInt(searchParams.get('page') || '1', 10) || 1;
    const limit: number = parseInt(searchParams.get('limit') || '30', 10) || 20;

    // Define filter object
    const filter: {
      price: { $gte: number; $lte: number };
      $or?: { [key: string]: { $regex: string; $options: string } }[];
      isFeatured?: boolean;
    } = {
      price: { $gte: minPrice, $lte: maxPrice },
    };

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { shortName: { $regex: query, $options: 'i' } },
      ];
    }

    if (featured) {
      filter.isFeatured = true;
    }

    // Define sort options
    const sortOptions: Record<string, Record<string, 1 | -1>> = {
      lowest: { price: 1 },
      highest: { price: -1 },
      toprated: { rating: -1 },
      newest: { createdAt: -1 },
    };

    const sortBy = sortOptions[sort] || sortOptions['newest'];
    const skip = (page - 1) * limit;

    // Fetch products and total count
    const [products, totalCount]: [HydratedDocument<IProduct>[], number] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortBy)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json(
      {
        success: true,
        products,
        pagination: {
          total: totalCount,
          page,
          pages: Math.ceil(totalCount / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error while fetching products' },
      { status: 500 }
    );
  }
}
