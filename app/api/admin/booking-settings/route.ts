import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import { BookingSettings } from '@/models/BookingSettings';
import Booking from '@/models/Booking';

export async function GET() {
  try {
    await dbConnect();
    
    // Clean up duplicate settings if any exist
    const count = await BookingSettings.countDocuments();
    if (count > 1) {
      const first = await BookingSettings.findOne().sort({ createdAt: 1 });
      if (first) {
        await BookingSettings.deleteMany({ _id: { $ne: first._id } });
      }
    }

    let settings = await BookingSettings.findOneAndUpdate(
      {},
      { $setOnInsert: { labelText: 'Available Dates (Next 30 Days)', durationDays: 30 } },
      { new: true, upsert: true }
    );
    
    // Fetch confirmed bookings
    const confirmedBookings = await Booking.find({ status: 'confirmed' }).select('date');
    const confirmedDates = confirmedBookings.map(b => {
      const d = new Date(b.date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    });
    const uniqueConfirmedDates = Array.from(new Set(confirmedDates));
    
    return NextResponse.json({
      settings,
      confirmedDates: uniqueConfirmedDates
    });
  } catch (error) {
    console.error('Error fetching booking settings:', error);
    return NextResponse.json({ error: 'Failed to load booking settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Use findOneAndUpdate with upsert to avoid Mongoose array change-tracking bugs
    const settings = await BookingSettings.findOneAndUpdate(
      {},
      {
        $set: {
          labelText: body.labelText,
          durationDays: body.durationDays ?? 30,
          blockedDates: body.blockedDates ?? [],
          blockedRanges: body.blockedRanges ?? [],
          blockedDaysOfWeek: body.blockedDaysOfWeek ?? []
        }
      },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating booking settings:', error);
    return NextResponse.json({ error: 'Failed to update booking settings' }, { status: 500 });
  }
}

