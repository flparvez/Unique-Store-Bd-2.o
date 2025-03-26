import { Product } from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
import { connectToDb } from '@/lib/db';
import mongoose, { Types } from 'mongoose';
import slugify from 'slugify';
// Connect to database
connectToDb();


interface ProductQuery {
  price: {
    $gte: number;
    $lte: number;
  };
  category?: Types.ObjectId | string;
  isFeatured?: boolean;
  $text?: {
    $search: string;
  };
}

interface ErrorWithMessage extends Error {
  name: string;
  errors?: Record<string, { message: string }>;
}


export async function GET(request: NextRequest) {
    

  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '10000000');

    const query: ProductQuery = {
      price: { $gte: minPrice, $lte: maxPrice }
    };

    if (category && mongoose.Types.ObjectId.isValid(category)) {
      query.category = new mongoose.Types.ObjectId(category);
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ popularityScore: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('category', 'name slug'),
        // .populate('reviews', 'rating'),
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
    
    console.error(error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}



// export async function POST(request: Request): Promise<NextResponse<ApiResponse<IProduct>>> {
export async function POST(request: NextRequest) {
    


//   const session = await getServerSession(authOptions);
  
//   if (!session) {
//     return NextResponse.json(
//       { success: false, error: 'Unauthorized' },
//       { status: 401 }
//     );
//   }

  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.price || !body.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 401 }
      );
    }

    // Validate category ID if provided
    if (body.category && !mongoose.Types.ObjectId.isValid(body.category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category ID' },
        { status: 402 }
      );
    }

    const product = new Product({
      ...body,
      slug: slugify(body.name),
      shortName: body.shortName || body.name.substring(0, 50),
      stock: body.stock || 0,
      sold: body.sold || 0
    });

    await product.save();

    return NextResponse.json(
      { success: true, data: product },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as ErrorWithMessage;
    
    if (err.name === 'ValidationError' && err.errors) {
      const errors = Object.values(err.errors).map(err => err.message);
      console.log(errors)
      return NextResponse.json(
        { success: false, error: errors.join(', ') },
        { status: 400 }
      );
    }
    
    console.error(err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}