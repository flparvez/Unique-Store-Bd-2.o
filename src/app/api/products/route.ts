import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db';
import mongoose from 'mongoose';
import slugify from 'slugify';



export async function GET() {
  try {
    // ⏱ Connect to DB first
    await connectToDb();
   const products = await Product.find().populate('category', 'name slug');    
    return NextResponse.json({ success: true,  products }, { status: 200 });
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error while fetching products' },
      { status: 500 }
    );
  }
}
// POST /api/products

export async function POST(request: NextRequest) {
  try {
    // ⏱ Connect to DB first
    await connectToDb();

    const body = await request.json();

    // ✅ Minimal required field check
    const { name, price, category } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: 'Name, price, and category are required' },
        { status: 401 }
      );
    }

    // ✅ Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 402 }
      );
    }

    // ✅ Limit the fields you store to prevent huge payload
    const product = await Product.create({
      name: body.name,
      shortName: body.shortName || body.name.slice(0, 80),
      seo: body.seo || '',
      slug: slugify(body.shortName, { lower: true, strict: true }),
      price: Number(body.price),
      originalPrice: body.originalPrice || null,
      stock: Number(body.stock) || 0,
      video: body.video,
      warranty: body.warranty || '7 day warranty',
      category,
      description: body.description,
      isFeatured: Boolean(body.isFeatured),
      images:body.images || [],
      specifications: Array.isArray(body.specifications)
        ? body.specifications.slice(0, 100) // avoid too large specs
        : [],
      sold: 0,
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    console.log('❌ API Error:', error);

 

    return NextResponse.json(
      { success: false, error: 'Server error while creating product' },
      { status: 500 }
    );
  }
}