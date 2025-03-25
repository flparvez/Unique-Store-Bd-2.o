import mongoose, { Document, Schema, models, Model } from 'mongoose';

interface IReply {
  user: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
}

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  likes: number;
  dislikes: number;
  replies: IReply[];
  createdAt: Date;
  updatedAt: Date;
}

interface IReviewModel extends Model<IReview> {
  calculateAverageRating(productId: mongoose.Types.ObjectId): Promise<void>;
}

const ReviewSchema = new Schema<IReview, IReviewModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 1000
  },
  images: [{
    type: String,
    validate: {
      validator: (v: string) => /^(https?):\/\/[^\s/$.?#].[^\s]*$/.test(v),
      message: 'Invalid image URL'
    }
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  dislikes: {
    type: Number,
    default: 0,
    min: 0
  },
  replies: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure one review per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

// Static method to calculate average rating for a product
ReviewSchema.statics.calculateAverageRating = async function(productId: mongoose.Types.ObjectId) {
  const result = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: null, averageRating: { $avg: '$rating' }, count: { $sum: 1 } } }
  ]);

  try {
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: result[0]?.averageRating || 0
    });
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
};

// Update product rating after saving a review
ReviewSchema.post<IReview>('save', async function(review) {
  const ReviewModel = this.constructor as IReviewModel;
  await ReviewModel.calculateAverageRating(review.product);
});

// Update product rating after removing a review
// ReviewSchema.post<IReview>('remove', async function(review) {
//   const ReviewModel = this.constructor as IReviewModel;
//   await ReviewModel.calculateAverageRating(review.product);
// });

export const Review = models?.Review || mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);