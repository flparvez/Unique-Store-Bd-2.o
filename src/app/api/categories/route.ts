import { connectToDb } from '@/lib/db';
import slugify from 'slugify';
import { NextResponse } from 'next/server';
import Category, { ICategory } from '@/models/Category';
export const dynamic = 'force-dynamic';

interface CategoryResponse {
  data?: ICategory | ICategory[];
  error?: string;
}

export async function GET(){
  await connectToDb();
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse<CategoryResponse>> {
  await connectToDb();
  try {
    const body = await request.json();
    const newCategory = {
      ...body,
      slug: slugify(body.name),
    }

    const category =await  Category.create(newCategory);

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
    console.log(error)
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}