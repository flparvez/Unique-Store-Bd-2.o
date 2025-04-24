import { connectToDb } from "@/lib/db";
import { Product } from "@/models/Product";
import {  NextRequest, NextResponse } from "next/server";






export async function GET(
request: NextRequest,
{params}: {params : Promise<{slug: string}>} 
) {


const {slug} = (await params)
console.log("tests",slug)
  connectToDb();
  try {


    const product = await Product.findOne({ slug: slug })
      .populate("")
  

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product: product
    });
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
