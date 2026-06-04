import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlockedRange {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  label?: string;
}

export interface IBookingSettings extends Document {
  labelText: string;
  durationDays: number;
  blockedDates: string[]; // YYYY-MM-DD strings
  blockedRanges: IBlockedRange[];
  blockedDaysOfWeek: number[]; // 0 (Sun) to 6 (Sat)
}

const blockedRangeSchema = new Schema<IBlockedRange>({
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  label: { type: String, default: '' },
}, { _id: false });

const bookingSettingsSchema = new Schema<IBookingSettings>(
  {
    labelText: {
      type: String,
      default: 'Available Dates (Next 30 Days)',
      required: true,
    },
    durationDays: {
      type: Number,
      default: 30,
      required: true,
    },
    blockedDates: {
      type: [String],
      default: [],
    },
    blockedRanges: {
      type: [blockedRangeSchema],
      default: [],
    },
    blockedDaysOfWeek: {
      type: [Number],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

if (mongoose.models.BookingSettings) {
  delete mongoose.models.BookingSettings;
}

export const BookingSettings: Model<IBookingSettings> =
  mongoose.model<IBookingSettings>('BookingSettings', bookingSettingsSchema);

