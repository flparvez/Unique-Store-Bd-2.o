import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import { connectToDb } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { Product } from '@/models/Product';
import { Review } from '@/models/Review';
import slugify from 'slugify';


export async function GET(
req: NextRequest,
{params}: {params : Promise<{id: string}>} 
) {
const {id} = (await params)
  
  try {
    if (!mongoose.Types.ObjectId.isValid(id!)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    connectToDb();
    const product = await Product.findById(id)
      .populate('category', 'name slug')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'name image'
        }
      });

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
}

// PATCH and DELETE handlers remain the same as in your original code
export async function PATCH(
  req: NextRequest,
  {params}: {params : Promise<{id: string}>} 
) {

const {id} = (await params)

  try {
    if (!mongoose.Types.ObjectId.isValid(id!)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    connectToDb();
    const currentProduct = await Product.findById(id);
    if (!currentProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    const body = await req.json();
    const slug = slugify(body?.slug);
    const updateData = { ...body, slug };

    // Handle price/discount logic
    if (body.price !== undefined || body.originalPrice !== undefined) {
      const newPrice = body.price ?? currentProduct.price;
      const newOriginalPrice = body.originalPrice ?? currentProduct.originalPrice;

      if (newOriginalPrice && newOriginalPrice < newPrice) {
        updateData.originalPrice = undefined;
        updateData.discount = 0;
      } else if (newOriginalPrice && newOriginalPrice >= newPrice) {
        updateData.discount = Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100);
      } else {
        updateData.discount = 0;
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Update failed' },
        { status: 500 }
      );
    }

    const responseData = {
      ...updatedProduct.toObject(),
      discountAmount: updatedProduct.originalPrice && updatedProduct.originalPrice >= updatedProduct.price 
        ? updatedProduct.originalPrice - updatedProduct.price 
        : 0,
      priceFormatted: `৳${updatedProduct.price.toLocaleString('bn-BD')}`,
      originalPriceFormatted: updatedProduct.originalPrice 
        ? `৳${updatedProduct.originalPrice.toLocaleString('bn-BD')}`
        : null
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Update failed' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,

) {

  connectToDb();
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    if (!mongoose.Types.ObjectId.isValid(id!)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    await Review.deleteMany({ product: id });
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to delete product' },
      { status: 500 }
    );
  }
}