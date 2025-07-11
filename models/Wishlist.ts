import mongoose, { Document, Schema } from 'mongoose';

interface IWishlistItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  addedAt: Date;
}

interface IWishlist extends Document {
  userId: string;
  items: IWishlistItem[];
  createdAt: Date;
  updatedAt: Date;
}

const WishlistItemSchema = new Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  addedAt: { type: Date, default: Date.now }
});

const WishlistSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  items: [WishlistItemSchema]
}, { timestamps: true });

export default mongoose.models.Wishlist || 
  mongoose.model<IWishlist>('Wishlist', WishlistSchema);