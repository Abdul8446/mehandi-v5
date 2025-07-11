import { NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import dbConnect from '@/lib/mongoose';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // if (!token || !token.isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Unauthorized' },
    //     { status: 401 }
    //   );
    // }

    const bookings = await Booking.find({}).sort({ date: 1 });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}