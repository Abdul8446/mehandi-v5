// import mongoose, { Document } from 'mongoose';

// export enum UserRole {
//   USER = 'user',
//   ADMIN = 'admin'
// }

// interface IUser extends Document {
//   phone: string;
//   name?: string;
//   role: UserRole;
//   wishlist: mongoose.Types.ObjectId[]; // Array of product references
//   createdAt: Date;
//   updatedAt: Date;
// }

// const userSchema = new mongoose.Schema({
//   phone: { type: String, required: true, unique: true },
//   name: { type: String },
//   role: { type: String, enum: Object.values(UserRole), default: UserRole.USER }
// }, { timestamps: true, collection: 'user' });

// export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);

import mongoose, { Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

interface IUser extends Document {
  phone: string;
  name: string;
  password: string;
  role: UserRole;
  wishlist: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  phone: { 
    type: String, 
    required: true, 
    unique: true, // Enforces uniqueness (no need for separate index)
    validate: {
      validator: function(v: string) {
        return /^[6-9]\d{9}$/.test(v);
      },
      message: (props: any) => `${props.value} is not a valid Indian phone number!`
    }
  },
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: [2, 'Name must be at least 2 characters']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.USER 
  },
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }]
}, { 
  timestamps: true, 
  collection: 'users'
});

// Password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password') || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Password comparison
userSchema.methods.comparePassword = async function(
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Index for text search (only if needed)
userSchema.index({ name: 'text' });

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
export default mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);