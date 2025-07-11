// app/api/orders/[orderId]/reject-return/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order, { OrderItem } from '@/models/Order';

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

    // Check if order has return requests
    if (!order.items.some((item:OrderItem) => item.returnRequested)) {
      return NextResponse.json(
        { error: 'No return requests for this order' },
        { status: 400 }
      );
    }

    // Update all requested items to rejected
    order.items = order.items.map((item:OrderItem) => {
      if (item.returnRequested && item.returnStatus === 'Pending') {
        return {
          ...item,
          returnStatus: 'Rejected'
        };
      }
      return item;
    });

    // Update order status back to delivered
    order.status = 'Delivered';

    const updatedOrder = await order.save();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error rejecting return:', error);
    return NextResponse.json(
      { error: 'Failed to reject return' },
      { status: 500 }
    );
  }
}