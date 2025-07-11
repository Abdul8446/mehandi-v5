// app/api/orders/[orderId]/ship/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  await dbConnect();

  try {
    const { trackingNumber } = await request.json();
    const { orderId } = await params;
    
    const updatedOrder = await Order.findOneAndUpdate(
      {orderId:orderId},
      {
        status: 'Shipped',
        trackingId: trackingNumber,
        shippedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.log(error, 'Error updating order');
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}