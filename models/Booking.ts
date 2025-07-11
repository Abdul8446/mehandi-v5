import { IPlan } from '@/types/plan';
import mongoose, { Document, Schema } from 'mongoose';


export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  plan: IPlan;
  date: Date;
  bookingDetails: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    occasion: string;
    numberOfPeople: number;
    specialRequirements?: string;
  };
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  plan: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    price: Number,
    image: String, // Add image field
  },
  date: { type: Date, required: true },
  bookingDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    occasion: { type: String, required: true },
    numberOfPeople: { type: Number, required: true, min: 1 },
    specialRequirements: { type: String, default: '' }
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'rejected'], 
    default: 'pending' 
  }
}, {
  timestamps: true
});

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);