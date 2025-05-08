import { connectToDb } from "@/lib/db";
import Category from "@/models/Category";
import { Product } from "@/models/Product";
import {  NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  {params}: {params : Promise<{slug: string}>} 
) {
  const {slug} = (await params)
  try {
    await connectToDb();
    await Category.find()
    // Only return necessary fields (you can customize this list)
    const product = await Product.findOne({ slug }).populate("category"); // Add specific fields if needed

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error: unknown) {
    console.error("Product API error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}
