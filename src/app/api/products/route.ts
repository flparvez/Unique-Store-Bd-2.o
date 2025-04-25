import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db';
import mongoose from 'mongoose';
import slugify from 'slugify';
import Category from '@/models/Category';
export const dynamic = 'force-dynamic';

// Connect to DB once when the module loads


interface ProductQuery {
  price: { $gte: number; $lte: number };
  category?: mongoose.Types.ObjectId;
  isFeatured?: boolean;
  $text?: { $search: string };
}

const DEFAULT_LIMIT = 10;
const DEFAULT_PAGE = 1;
const MAX_PRICE = 10000000;

export async function GET(request: NextRequest) {

  connectToDb()
  try {

    await Category.find();
    const { searchParams } = new URL(request.url);
    
    // Parse query params with defaults
    const page = parseInt(searchParams.get('page') || `${DEFAULT_PAGE}`);
    const limit = parseInt(searchParams.get('limit') || `${DEFAULT_LIMIT}`);
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || `${MAX_PRICE}`);
    
    // Build query
    const query: ProductQuery = { price: { $gte: minPrice, $lte: maxPrice } };
    
    const category = searchParams.get('category');
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = new mongoose.Types.ObjectId(category);
    }
    
    if (searchParams.get('featured') === 'true') {
      query.isFeatured = true;
    }
    
    const search = searchParams.get('search');
    if (search) {
      query.$text = { $search: search };
    }
    
    // Execute parallel queries for better performance
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ popularityScore: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('category'), // Fixed: lowercase 'category' to match schema
      Product.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('GET /api/products error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'price', 'category'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate category
    if (!mongoose.Types.ObjectId.isValid(body.category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 400 }
      );
    }

    // Create product with defaults
    const product = await Product.create({
      ...body,
      slug: slugify(body.name, { lower: true, strict: true }),
      shortName: body.shortName || body.name.substring(0, 50),
      stock: body.stock || 0,
      sold: body.sold || 0
    });

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('POST /api/products error:', error);
    
    if (error instanceof mongoose.Error.ValidationError) {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}