// // app/api/orders/[orderId]/return/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongoose';
// import Order, { OrderItem } from '@/models/Order';

// export async function POST(
//   request: Request,
//   { params }: { params: Promise<{ orderId: string }> }
// ) {
//   await dbConnect();

//   try {
//     const { orderId } = await params;
//     const { items: returnItems } = await request.json();
//     console.log(returnItems, 'returnItems');

//     // Find the order
//     const order = await Order.findOne({ orderId });
//     if (!order) {
//       return NextResponse.json(
//         { error: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     // Check if order is delivered
//     if (order.status !== 'Delivered') {
//       return NextResponse.json(
//         { error: 'Returns can only be requested for delivered orders' },
//         { status: 400 }
//       );
//     }

//     // Check if within return window (48 hours)
//     const returnWindowEnd = order.returnWindowEnd || 
//       new Date(new Date(order.deliveredAt || order.createdAt).getTime() + 48 * 60 * 60 * 1000);
//     if (new Date() > new Date(returnWindowEnd)) {
//       return NextResponse.json(
//         { error: 'Return window has expired (48 hours from delivery)' },
//         { status: 400 }
//       );
//     }

//     // Process each return item
//     let hasReturnItems = false;
//     for (const returnItem of returnItems) {
//       const { productId, quantity, reason } = returnItem;

//       // Skip if no quantity or reason
//       if (!quantity || !reason) continue;

//       // Find the item in the order
//       const itemIndex = order.items.findIndex((item: OrderItem) => item.productId === productId);
//       if (itemIndex === -1) {
//         continue; // Skip if product not found
//       }

//       // Check if return already requested
//       if (order.items[itemIndex].returnRequested) {
//         continue; // Skip if already requested
//       }

//       // Validate quantity
//       if (quantity > order.items[itemIndex].quantity) {
//         continue; // Skip if requested quantity exceeds purchased quantity
//       }

//       // Update the item with return request
//       order.items[itemIndex].returnRequested = true;
//       order.items[itemIndex].returnQuantity = quantity;
//       order.items[itemIndex].returnReason = reason;
//       order.items[itemIndex].returnStatus = 'Pending';
//       order.items[itemIndex].originalPrice = order.items[itemIndex].price; // Store original price
      
//       hasReturnItems = true;
//       console.log(order.items, 'Updated order items with return requests');
//     }

//     // If no valid return items were processed
//     if (!hasReturnItems) {
//       return NextResponse.json(
//         { error: 'No valid items to return' },
//         { status: 400 }
//       );
//     }

//     // Update order status if not already set
//     if (order.status === 'Delivered') {
//       order.status = 'Return Requested';
//     }


//     const updatedOrder = await order.save();

//     return NextResponse.json(updatedOrder);
//   } catch (error) {
//     console.error('Error processing return request:', error);
//     return NextResponse.json(
//       { error: 'Failed to process return request' },
//       { status: 500 }
//     );
//   }
// }


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
    const { items: returnItems } = await request.json();

    const order = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify order is eligible for returns
    if (order.status !== 'Delivered' && order.status !== 'Return Requested') {
      return NextResponse.json(
        { error: 'Returns can only be requested for delivered orders' },
        { status: 400 }
      );
    }

    // Check return window
    const returnWindowEnd = order.returnWindowEnd || 
      new Date(new Date(order.deliveredAt || order.createdAt).getTime() + 48 * 60 * 60 * 1000);
    if (new Date() > new Date(returnWindowEnd)) {
      return NextResponse.json(
        { error: 'Return window has expired (48 hours from delivery)' },
        { status: 400 }
      );
    }

    // Process each return item
    let hasValidReturns = false;
    const updatedItems = order.items.map((item : any)=> {
      const returnItem = returnItems.find((ri: any) => ri.productId === item.productId);
      if (!returnItem || !returnItem.quantity || !returnItem.reason) {
        return item;
      }

      // Calculate remaining quantity that can be returned
      const remainingQty = item.remainingQuantity !== undefined ? 
        item.remainingQuantity : 
        item.quantity - (item.returnedQuantity || 0);

      if (returnItem.quantity > remainingQty || remainingQty <= 0) {
        return item;
      }

      hasValidReturns = true;

      return {
        ...item.toObject(),
        returnRequested: true,
        returnQuantity: (item.returnQuantity || 0) + returnItem.quantity,
        returnReason: returnItem.reason,
        returnDetails: returnItem.reasonDetails,
        returnStatus: 'Pending',
        remainingQuantity: remainingQty - returnItem.quantity,
        originalPrice: item.originalPrice || item.price
      };
    });

    if (!hasValidReturns) {
      return NextResponse.json(
        { error: 'No valid items to return or quantities exceed remaining amounts' },
        { status: 400 }
      );
    }

    // Update order
    order.items = updatedItems;
    order.status = 'Return Requested';
    const updatedOrder = await order.save();

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error processing return request:', error);
    return NextResponse.json(
      { error: 'Failed to process return request' },
      { status: 500 }
    );
  }
}