
import { NextRequest, NextResponse } from 'next/server';
import { connectToDb } from '@/lib/db';
import Category from '@/models/Category';


export async function GET(
  request: NextRequest
) {
  await connectToDb();
  try {

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ data: category }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
export async function PUT(
  request: Request,

) {
  await connectToDb();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();
    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ data: category }, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to update category';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
 
){
  await connectToDb();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}