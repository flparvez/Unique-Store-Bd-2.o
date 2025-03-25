import { connectToDb } from '@/lib/db';
import { Review } from '@/models/Review';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

connectToDb();



export async function POST(
  request: Request,

) {
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
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    if (!body.comment || body.comment.length < 2) {
      return NextResponse.json(
        { success: false, error: 'Reply must be at least 2 characters' },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndUpdate(
      id,
      {
        $push: {
          replies: {
            user: session.user.id,
            comment: body.comment
          }
        }
      },
      { new: true }
    ).populate('replies.user', 'name image');

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review.replies[review.replies.length - 1] // Return the newly added reply
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add reply' },
      { status: 500 }
    );
  }
}