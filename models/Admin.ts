import mongoose, { Document } from 'mongoose';

interface IAdmin extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true }
  }, 
  { 
    timestamps: true,
    collection: 'admin', // 👈 match Atlas collection name exactly
  }   
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', adminSchema);