// // app/api/orders/[orderId]/process-returns/route.ts
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongoose';
// import Order, { OrderStatus, ReturnStatus } from '@/models/Order';

// export async function POST(
//   request: Request,
//   { params }: { params: { orderId: string } }
// ) {
//   await dbConnect();

//   try {
//     const { orderId } = params;
//     const { items } = await request.json();
    
//     // Find the order
//     const order = await Order.findOne({ _id: orderId });
//     if (!order) {
//       return NextResponse.json(
//         { error: 'Order not found' },
//         { status: 404 }
//       );
//     }

//     // Check if order has pending return requests
//     const hasPendingReturns = order.items.some(
//       (item: any) => item.returnRequested && item.returnStatus === 'Pending'
//     );
    
//     if (!hasPendingReturns) {
//       return NextResponse.json(
//         { error: 'No pending return requests for this order' },
//         { status: 400 }
//       );
//     }

//     // Process each item update
//     let refundAmount = 0;
//     let hasApprovedReturns = false;
//     let hasRejectedReturns = false;

//     order.items = order.items.map((item: any) => {
//       // Skip items not marked for return or already processed
//       if (!item.returnRequested || item.returnStatus !== 'Pending') {
//         return item;
//       }

//       const itemUpdate = items.find((i: any) => i.productId === item.productId);
//       if (!itemUpdate) {
//         return item; // Keep as pending if no update provided
//       }

//       if (itemUpdate.action === 'approve' && itemUpdate.approvedQty > 0) {
//         const approvedQty = Math.min(
//           itemUpdate.approvedQty, 
//           item.returnQuantity || item.quantity
//         );
        
//         refundAmount += approvedQty * (item.originalPrice || item.price);
//         hasApprovedReturns = true;

//         return {
//           ...item.toObject(),
//           returnStatus: 'Approved' as ReturnStatus,
//           returnQuantity: approvedQty,
//           quantity: item.quantity - approvedQty
//         };
//       } else if (itemUpdate.action === 'reject') {
//         hasRejectedReturns = true;
//         return {
//           ...item.toObject(),
//           returnStatus: 'Rejected' as ReturnStatus
//         };
//       }

//       return item;
//     });

//     // Determine the new order status
//     const allReturnsProcessed = !order.items.some(
//       (item:any) => item.returnRequested && item.returnStatus === 'Pending'
//     );

//     if (allReturnsProcessed) {
//       if (hasApprovedReturns) {
//         order.status = 'Returned' as OrderStatus;
//         order.paymentStatus = 'Refunded';
//       } else {
//         // All returns were rejected
//         order.status = 'Delivered' as OrderStatus;
//       }
//     } else {
//       // Some returns still pending
//       order.status = 'Return Requested' as OrderStatus;
//     }

//     const updatedOrder = await order.save();

//     return NextResponse.json({
//       order: updatedOrder.toObject(),
//       refundAmount,
//       message: 'Return processed successfully'
//     });
//   } catch (error) {
//     console.error('Error processing returns:', error);
//     return NextResponse.json(
//       { error: 'Failed to process returns' },
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
    const { items } = await request.json();
    
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Verify return window has ended
    const returnWindowEnd = order.returnWindowEnd || 
      new Date(new Date(order.deliveredAt || order.createdAt).getTime() + 48 * 60 * 60 * 1000);
    if (new Date() <= new Date(returnWindowEnd)) {
      return NextResponse.json(
        { error: 'Returns can only be processed after the return window ends' },
        { status: 400 }
      );
    }

    let refundAmount = 0;
    let hasApprovedReturns = false;
    let hasPendingReturns = false;

    const updatedItems = order.items.map((item : any)=> {
      if (!item.returnRequested || item.returnStatus !== 'Pending') {
        return item;
      }

      const itemUpdate = items.find((i: any) => i.productId === item.productId);
      if (!itemUpdate) {
        hasPendingReturns = true;
        return item;
      }

      if (itemUpdate.action === 'approve' && itemUpdate.approvedQty > 0) {
        const approvedQty = Math.min(itemUpdate.approvedQty, item.returnQuantity || 0);
        
        refundAmount += approvedQty * (item.originalPrice || item.price);
        hasApprovedReturns = true;

        return {
          ...item.toObject(),
          returnStatus: 'Approved',
          returnedQuantity: (item.returnedQuantity || 0) + approvedQty,
          returnQuantity: (item.returnQuantity || 0) - approvedQty,
          remainingQuantity: item.remainingQuantity !== undefined ? 
            item.remainingQuantity - approvedQty : 
            item.quantity - ((item.returnedQuantity || 0) + approvedQty)
        };
      } else {
        return {
          ...item.toObject(),
          returnStatus: 'Rejected',
          remainingQuantity: item.remainingQuantity
        };
      }
    });

    // Update order status
    order.items = updatedItems;
    
    // Check if all returns are processed
    const allProcessed = !order.items.some(
      (item: any) => item.returnRequested && item.returnStatus === 'Pending'
    );
    
    if (hasApprovedReturns) {
      if (allProcessed) {
        order.status = 'Returned';
        order.paymentStatus = 'Refunded';
      } else {
        order.status = 'Return Requested';
      }
    } else if (allProcessed) {
      // All pending returns were rejected
      order.status = 'Delivered';
    }

    const updatedOrder = await order.save();

    return NextResponse.json({
      order: updatedOrder,
      refundAmount,
      message: 'Return processed successfully'
    });
  } catch (error) {
    console.error('Error processing returns:', error);
    return NextResponse.json(
      { error: 'Failed to process returns' },
      { status: 500 }
    );
  }
}