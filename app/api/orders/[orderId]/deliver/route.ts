// // app/api/orders/[orderId]/deliver/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongoose';
// import Order from '@/models/Order';
// import { use } from 'react';


// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ orderId: string }> }
// ) {
//   await dbConnect();

//   try {
//     // const { orderId } = use(params);
//     const { status } = await request.json();
//     const { orderId } = await params;

//     const updateData: any = { status };
    
//     if (status === 'Delivered') {
//       updateData.deliveredAt = new Date();
//     }

//     const updatedOrder = await Order.findOneAndUpdate(
//       { orderId: orderId },
//       updateData,
//       { new: true }
//     );

//     if (!updatedOrder) {
//       return NextResponse.json(
//         { message: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(updatedOrder);
//   } catch (error) {
//     console.error('Error updating order:', error);
//     return NextResponse.json(
//       { error: 'Failed to update order' },
//       { status: 500 }
//     );
//   }
// }




// app/api/orders/[orderId]/deliver/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Order from '@/models/Order';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  await dbConnect();

  try {
    const { orderId } = await params;
    const { status } = await request.json();

    const updateData: any = { 
      status,
      // Clear tracking info when delivered
      // trackingId: undefined,
      // shippedAt: undefined
    };
    
    if (status === 'Delivered') {
      updateData.deliveredAt = new Date();
      // Set return window to 48 hours from delivery time
      updateData.returnWindowEnd = new Date(new Date().getTime() + 48 * 60 * 60 * 1000);
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
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}