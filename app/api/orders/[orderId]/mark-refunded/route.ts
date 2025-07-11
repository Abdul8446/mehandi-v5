import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  await dbConnect();

  try {
    const { orderId } = await params;
    
    // Find the order
    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Check if order is returned
    if (order.status !== 'Returned') {
      return NextResponse.json(
        { error: 'Only returned orders can be marked as refunded' },
        { status: 400 }
      );
    }

    // Calculate refund amount based on approved returns
    let refundAmount = 0;
    order.items.forEach((item: any )=> {
      if (item.returnRequested && item.returnStatus === 'Approved') {
        const qty = item.returnQuantity || item.quantity;
        refundAmount += qty * (item.originalPrice || item.price);
      }
    });

    // Update payment status
    order.paymentStatus = 'Refunded';
    const updatedOrder = await order.save();

    return NextResponse.json({
      ...updatedOrder.toObject(),
      refundAmount
    });
  } catch (error) {
    console.error('Error marking as refunded:', error);
    return NextResponse.json(
      { error: 'Failed to mark as refunded' },
      { status: 500 }
    );
  }
}