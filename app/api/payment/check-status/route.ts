// // app/api/check-status/route.ts
// import { NextResponse } from 'next/server';
// import { getClient } from '@/lib/pg-client';

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const merchantOrderId = searchParams.get('merchantOrderId');

//     if (!merchantOrderId) {
//       return NextResponse.json(
//         { 
//           success: false,
//           error: "MerchantOrderId is required" 
//         },
//         { status: 400 }
//       );
//     }

//     const client = getClient();
//     const response = await client.getOrderStatus(merchantOrderId);
    
//     // Format response to match frontend expectations
//     return NextResponse.json({
//       success: true,
//       data: {
//         status: response.state === "COMPLETED" ? "SUCCESS" : "FAILED",
//         orderId: merchantOrderId,
//         // paymentId: response.paymentId,
//         amount: response.amount
//       }
//     });

//   } catch (error) {
//     console.error("Error getting order status:", error);
//     return NextResponse.json(
//       { 
//         success: false,
//         error: "Error getting status" 
//       },
//       { status: 500 }
//     );
//   }
// }



// app/api/check-status/route.ts
import { NextResponse } from 'next/server';
import { getClient } from '@/lib/pg-client';
import { redirect } from 'next/navigation';
import Order from '@/models/Order';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantOrderId = searchParams.get('merchantOrderId');

    if (!merchantOrderId) {
      return NextResponse.json(
        { 
          success: false,
          error: "MerchantOrderId is required" 
        },
        { status: 400 }
      );
    }

    const client = getClient();
    const response = await client.getOrderStatus(merchantOrderId);
    
    // Update payment status in database
    const paymentStatus = response.state === "COMPLETED" ? 'Paid' : 'Failed';
    await Order.findOneAndUpdate({ orderId: merchantOrderId }, { paymentStatus });

    // Redirect to confirmation page with order ID
    return NextResponse.redirect(
      new URL(`/order-confirmation/${merchantOrderId}`, request.url)
    );

  } catch (error: any) {
    console.error("Error getting order status:", error.message || error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message || error || "Error getting status"
      },
      { status: 500 }
    );
  }
}