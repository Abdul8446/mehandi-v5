// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  await dbConnect();

  const { orderId } = await params; 
  console.log(orderId, 'orderId');
  
  try {
    const order = await Order.findOne({ orderId: orderId }).lean();
    
    if (!order) {
      console.log(order, 'no order');
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error: any) {
    console.log(error, 'error')
    return NextResponse.json(
      { message: 'Failed to fetch order', error: error.message },
      { status: 500 }
    );
  }
}
