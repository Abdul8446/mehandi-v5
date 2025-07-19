import mongoose, { Schema, Document, Types } from 'mongoose'

export interface Review {
  userId: string
  user: string
  rating: number
  comment: string
  avatar: string
  createdAt: Date
  updatedAt?: Date
}

interface Specifications {
  weight: number;  // Required (in grams)
  'shelf life'?: string;
  origin?: string;
  ingredients?: string[];
  certification?: string;
  contents?: string;
  material?: string;
}

export interface IProduct extends Document {
  // _id: Types.ObjectId;
  _id: string
  name: string
  slug: string
  price: number
  discount: number
  originalPrice: number
  images: string[]
  category: string
  description: string
  features?: string[]
  specifications: Specifications
  rating?: number
  reviewsCount: number
  reviews: Review[]
  inStock: boolean
  stock: number
  reserved: number
  isFeatured: boolean
  sku: string
  tags: string[]
  status: string
}

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  user: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, minlength: 10, maxlength: 500 },
  avatar: { type: String },
}, { timestamps: true });

const ProductSchema: Schema = new Schema({
  _id: String,
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  discount: { type: Number },
  originalPrice: { type: Number },
  images: [{ type: String, required: true }],
  category: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  specifications: { 
    weight: { type: Number, required: true }, // Weight is now required
    "shelf life": String,
    origin: String,
    ingredients: [String], // Array for multiple ingredients
    certification: String,
    contents: String,
    material: String,
  },
  rating: { type: Number },
  reviewsCount: { type: Number },
  reviews: [ReviewSchema],
  inStock: { type: Boolean },
  stock: { type: Number, default: 0 },
  reserved: { type: Number, default: 0 }, // Track reserved stock
  isFeatured: { type: Boolean, default: false },
  sku: { type: String },
  tags: [{ type: String }],
  status:{type: String, enum: ['Active', 'Disabled'], default: 'Active',}
  },
  {
    collection: 'product', timestamps: true, // 👈 match Atlas collection name exactly
  }
)

// Update product rating when new reviews are added
ProductSchema.pre<IProduct>('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.rating = totalRating / this.reviews.length;
    this.reviewsCount = this.reviews.length;
  }
  next();
});
         
export default mongoose.models.Product ||
  mongoose.model<IProduct>('Product', ProductSchema)

  