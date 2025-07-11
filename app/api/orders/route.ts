// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order, { IOrder, OrderStatus } from '@/models/Order';
import { Types } from 'mongoose';

export async function GET(request: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log(userId, 'userId');
  
  try {
    if (!userId) {
      const orders = await Order.find({}).sort({ createdAt: -1 }).exec();
      console.log(orders, 'orders');
      return NextResponse.json(orders);
    }

    const orders: IOrder[] = await Order.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error: any) {
    console.log(error, 'error')
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    console.log(body, 'body');

    // Validate required fields
    if (!body.totalAmount || !body.customer?.name || !body.customer?.email || !body.customer?.phone) {
      return NextResponse.json(
        { message: 'Missing required customer fields' },
        { status: 400 }
      );
    }

    // Validate shipping address fields
    if (!body.shippingAddress?.address || 
        !body.shippingAddress?.city || 
        !body.shippingAddress?.state || 
        !body.shippingAddress?.postalCode || 
        !body.shippingAddress?.country) {
      return NextResponse.json(
        { message: 'Missing required shipping address fields' },
        { status: 400 }
      );
    }

    // Transform items to match schema
    const items = body.items.map((item: any) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image
    }));

    // Generate sequential order ID
    const lastOrder = await Order.findOne({}, {}, { sort: { 'createdAt': -1 } });
    let nextId = 1001;
    if (lastOrder && lastOrder.orderId) {
      const lastId = parseInt(lastOrder.orderId.split('-')[1]);
      nextId = lastId + 1;
    }
    const orderId = `ORD-${nextId}`;

    // Create order with generated ID and default statuses
    const orderData = {
      orderId,
      userId: body.userId,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone
      },
      items,
      shippingCost: body.shippingCost,
      totalAmount: body.totalAmount,
      paymentStatus: 'Paid', // Default status
      status: 'Confirmed', // Default status
      shippingAddress: {
        address: body.shippingAddress.address,
        city: body.shippingAddress.city,
        state: body.shippingAddress.state,
        postalCode: body.shippingAddress.postalCode,
        country: body.shippingAddress.country
      },
      // paymentMethod: body.paymentMethod || 'razorpay',
      createdAt: new Date(),
      updatedAt: new Date()
    };



    // Save to database
    const order = new Order(orderData);
    console.log(order, 'order');
    await order.save();
   
    return NextResponse.json(order, { status: 201 });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { message: 'Failed to create order', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  
  try {
    const { orderId, status, trackingId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const updateData: Partial<IOrder> = { status };

    if (status === 'Shipped') {
      if (!trackingId) {
        return NextResponse.json(
          { message: 'Tracking ID is required for shipping' },
          { status: 400 }
        );
      }
      updateData.trackingId = trackingId;
      updateData.shippedAt = new Date();
    } else if (status === 'Delivered') {
      updateData.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      updateData,
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { message: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json(
      { message: 'Failed to update order', error: error.message },
      { status: 400 }
    );
  }
}