// app/api/orders/[orderId]/approve-return/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order, { OrderItem } from '@/models/Order';

export async function POST(
  request: NextRequest,
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

    // Update all requested items to approved
    order.items = order.items.map((item:OrderItem) => {
      if (item.returnRequested && item.returnStatus === 'Pending') {
        return {
          ...item,
          returnStatus: 'Approved'
        };
      }
      return item;
    });

    // Update order status
    order.status = 'Returned';
    order.paymentStatus = 'Refunded';

    const updatedOrder = await order.save();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error approving return:', error);
    return NextResponse.json(
      { error: 'Failed to approve return' },
      { status: 500 }
    );
  }
}

