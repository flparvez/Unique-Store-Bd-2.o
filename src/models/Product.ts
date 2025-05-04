import mongoose, { Document, Schema, models, Model } from 'mongoose';
import slugify from 'slugify';

export interface IProductImage extends Document {

  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  altText?: string;
  isPrimary?: boolean;
}

export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  shortName: string;
  description: string;
  category: {
    _id: string;
    name: string;
  };
  price: number;
  originalPrice?: number;
  discount?: number;
  images: IProductImage[];
  stock: number;
  sold: number;
  popularityScore: number;
  video?: string;
  warranty: string;
  specifications: {
    key: string;
    value: string;
  }[];
  seo: string;
  reviews: mongoose.Types.ObjectId[];
  rating?: number;
  isFeatured: boolean;
  
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  lastUpdatedIndex? : number
  advanced? : number
}

interface IProductModel extends Model<IProduct> {
  findBySlug(slug: string): Promise<IProduct | null>;
  updatePopularity(productId: string, increment?: number): Promise<IProduct | null>;
}

const ProductImageSchema: Schema = new Schema({
  url: { 
    type: String, 
    required: true,
    validate: {
      validator: (v: string) => /^(https?):\/\/[^\s/$.?#].[^\s]*$/.test(v),
      message: 'Invalid image URL'
    }
  },
  publicId: { type: String, required: true },
  width: { type: Number, min: 1 },
  height: { type: Number, min: 1 },
  format: { 
    type: String,
    enum: ['jpg', 'jpeg', 'png', 'webp', 'gif']
  },
  altText: {
    type: String,
    maxlength: 125
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const productSchema = new Schema<IProduct, IProductModel>({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 150 characters']
  },
  slug: { 
    type: String, 
    required: true,
    unique: true // Remove index: true since unique: true already creates the index
  },
  shortName: {
    type: String,
    required: true,
    maxlength: [150, 'Short name cannot exceed 150 characters']
  },
  description: { 
    type: String, 
    required: true,
    minlength: [50, 'Description should be at least 50 characters'],
    maxlength: [20000, 'Description cannot exceed 10000 characters']
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: { 
    type: Number, 
    required: true,
    min: [1, 'Price must be at least 1']
  },
  originalPrice: {
    type: Number,
    min: [1, 'Original price must be at least 1'],
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  images: {
    type: [ProductImageSchema],
    validate: {
      validator: (images: IProductImage[]) => images.length >= 1 && images.length <= 10,
      message: 'Product must have between 1-10 images'
    }
  },
  stock: { 
    type: Number, 
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  sold: { 
    type: Number, 
    required: true,
    min: [0, 'Sold count cannot be negative'],
    default: 0
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  video: {
    type: String,
  
  },
  warranty: {
    type: String,
    default: '7 day warranty'
  },
  specifications: [{
    key: {
      type: String,
      required: true,
      maxlength: [50, 'Spec key cannot exceed 50 characters']
    },
    value: {
      type: String,
      required: true,
      maxlength: [100, 'Spec value cannot exceed 100 characters']
    }
  }],
  seo: {
    type: String
  },
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'Review'
  }],
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive:{
    type:Boolean,
    default:true
  },
  lastUpdatedIndex: {
    type: Number,
    default: 1, 
  },
  advanced: {
    type: Number,
    default: 100, 
  },


}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Define other indexes (remove the slug index since it's already handled by unique: true)
productSchema.index({ name: 'text', shortName: 'text', description: 'text', 'specifications.key': 'text', 'specifications.value': 'text' });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ popularityScore: 1 });
// Auto-generate slug before saving
productSchema.pre<IProduct>('save', function(next) {
  if (this.isModified('name')) {
    this.slug = slugify(`${this.name} ${this.shortName}`, {
      lower: true,
      strict: true,
      locale: 'bn'
    });
  }
  next();
});




productSchema.statics.updatePopularity = async function(productId: string, increment: number = 1) {
  return await this.findByIdAndUpdate(
    productId,
    { $inc: { popularityScore: increment } },
    { new: true }
  );
};

export const Product = models?.Product || mongoose.model<IProduct, IProductModel>('Product', productSchema);