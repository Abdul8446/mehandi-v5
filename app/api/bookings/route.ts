import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Booking from '@/models/Booking';
import { verifyToken } from '@/lib/authUtils';


export async function GET(req: Request) {
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

    const bookings = await Booking.find({ user: userId }).sort({ date: 1 });
    
    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  console.log(request.headers.get('authorization'));

  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    
    if (!token) {
        return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
        );
    }

    const { userId } = verifyToken(token);
    
    const body = await request.json();
    
    const { plan, date, bookingDetails } = body;

    console.log(plan)

    // Validate required fields
    if (!plan || !date || !bookingDetails) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new booking
    const newBooking = new Booking({
      user: userId,
      plan: {
        id: plan._id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        image: plan.image
      },
      date: new Date(date),
      bookingDetails
    });

    await newBooking.save();

    return NextResponse.json(
      { message: 'Booking created successfully', booking: newBooking },
      { status: 201 }
    );
  } catch (error: any) {
    console.log('Error creating booking:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}