import { connectToDb } from '@/lib/db';
import { Review } from '@/models/Review';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

connectToDb();

export async function GET(
  request: NextRequest,
 
) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  try {
    if (!mongoose.Types.ObjectId.isValid(id!)) {
      return NextResponse.json(
        { success: false, error: 'Invalid review ID' },
        { status: 400 }
      );
    }

    const review = await Review.findById(id)
      .populate('user', 'name image')
      .populate('replies.user', 'name image');

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,

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
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if the user is the review author
    if (review.user.toString() !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own reviews' },
        { status: 403 }
      );
    }

    // Only allow updating certain fields
    const updatedReview = await Review.findByIdAndUpdate(
      id,
      {
        rating: body.rating,
        title: body.title,
        comment: body.comment,
        images: body.images
      },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: updatedReview
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update review',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
 
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

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if the user is the review author or admin
    // if (review.user.toString() !== session.user.id && !session.user.isAdmin) {
    //   return NextResponse.json(
    //     { success: false, error: 'Not authorized to delete this review' },
    //     { status: 403 }
    //   );
    // }

    await review.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete review' },
      { status: 500 }
    );
  }
}