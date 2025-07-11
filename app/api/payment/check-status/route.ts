// // app/api/check-status/route.ts
// import { NextResponse } from 'next/server';
// import { getClient } from '@/lib/pg-client'; // Assuming you have a client setup

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const merchantOrderId = searchParams.get('merchantOrderId');

//     if (!merchantOrderId) {
//       return NextResponse.json(
//         { error: "MerchantOrderId is required" },
//         { status: 400 }
//       );
//     }

//     const client = getClient();
//     const response = await client.getOrderStatus(merchantOrderId);
//     const status = response.state;

//     const frontendBaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

//     if (status === "COMPLETED") {
//       return NextResponse.redirect(`${frontendBaseUrl}/success`);
//     } else {
//       return NextResponse.redirect(`${frontendBaseUrl}/failure`);
//     }
    
//   } catch (error) {
//     console.error("Error getting order status:", error);
//     return NextResponse.json(
//       { error: "Error getting status" },
//       { status: 500 }
//     );
//   }
// }



// app/api/check-status/route.ts
import { NextResponse } from 'next/server';
import { getClient } from '@/lib/pg-client';

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
    
    // Format response to match frontend expectations
    return NextResponse.json({
      success: true,
      data: {
        status: response.state === "COMPLETED" ? "SUCCESS" : "FAILED",
        orderId: merchantOrderId,
        // paymentId: response.paymentId,
        amount: response.amount
      }
    });

  } catch (error) {
    console.error("Error getting order status:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Error getting status" 
      },
      { status: 500 }
    );
  }
}