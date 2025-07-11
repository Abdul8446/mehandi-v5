import mongoose, { Document } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

interface IUser extends Document {
  phone: string;
  name?: string;
  role: UserRole;
  wishlist: mongoose.Types.ObjectId[]; // Array of product references
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.USER }
}, { timestamps: true, collection: 'user' });

export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
