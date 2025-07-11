import { NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import dbConnect from '@/lib/mongoose';
import { verifyToken } from '@/lib/authUtils';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { userId } = verifyToken(token);

    const { id } = await params;

    const booking = await Booking.findOneAndUpdate(
      { 
        _id: id,
        user: userId,
        status: { $in: ['pending', 'confirmed'] }
      },
      { status: 'cancelled' },
      { new: true }
    );

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found or cannot be cancelled' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}