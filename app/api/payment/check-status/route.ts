// // app/api/check-status/route.ts
// import { NextResponse } from 'next/server';
// import { getClient } from '@/lib/pg-client';
// import Order from '@/models/Order';
// const redirectUrl = process.env.PHONEPE_ENV === "UAT" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_BASE_URL;

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const merchantOrderId = searchParams.get('merchantOrderId');
//     const errorCode = searchParams.get('errorCode');

//     if (!merchantOrderId) {
//       return redirectToErrorPage('missing_order_id');
//     }

//     const client = getClient();
    
//     // Handle explicit payment errors
//     if (errorCode) {
//       await updateOrderStatus(merchantOrderId, 'Failed');
//       return redirectToFailurePage(merchantOrderId, errorCode);
//     }

//     // Normal status check flow
//     const response = await client.getOrderStatus(merchantOrderId);
//     const paymentStatus = response.state === "COMPLETED" ? 'Paid' : 'Failed';
//     await updateOrderStatus(merchantOrderId, paymentStatus);

//     // Only allow redirect to order page for Paid or Failed statuses
//     if (paymentStatus === 'Paid') {
//       return redirectToOrderPage(merchantOrderId);
//     }

//      // Handle failed payments
//     if (paymentStatus === 'Failed') {
//       return redirectToFailurePage(merchantOrderId, response.errorCode);
//     }

//     // For any other status, redirect to a pending page or error page
//     return redirectToPendingPage(merchantOrderId);

//   } catch (error: any) {
//     console.error("Error in check-status:", error);
//     const orderId = new URL(request.url).searchParams.get('merchantOrderId');
//     return await redirectToErrorPage('server_error', error.message, orderId || undefined);
//   }
// }


// async function updateOrderStatus(orderId: string, status: string) {
//   await Order.findOneAndUpdate(
//     { orderId },
//     { 
//       paymentStatus: status,
//     },
//     { new: true }
//   );
// }

// function redirectToOrderPage(orderId: string) {
//   const url = new URL(`/order-confirmation/${orderId}`, redirectUrl);
//   url.searchParams.set('clearCart', 'true');
//   return NextResponse.redirect(url);
// }

// const redirectToPendingPage = async (orderId: string) => {
//   const url = new URL('/payment-pending', redirectUrl);
//   url.searchParams.set('orderId', orderId);
//   await Order.deleteOne({ orderId });
//   return NextResponse.redirect(url);
// }

// const redirectToFailurePage = async (orderId: string, errorCode?: string) => {
//   const url = new URL('/payment-failed', redirectUrl);
//   url.searchParams.set('orderId', orderId);
//   if (errorCode) {
//     url.searchParams.set('errorCode', errorCode);
//   }

//   await Order.deleteOne({ orderId });
//   return NextResponse.redirect(url);
// }

// async function redirectToErrorPage(errorType: string, message?: string, orderId?: string) {
//   const url = new URL('/payment-error', process.env.NEXT_PUBLIC_BASE_URL);
//   url.searchParams.set('error', errorType);
//   if (message) {
//     url.searchParams.set('message', encodeURIComponent(message));
//   }

//   // Always attempt to delete the order if orderId exists
//   if (orderId) {
//     try {
//       await Order.deleteOne({ orderId });
//       console.log(`Deleted order ${orderId} due to error: ${errorType}`);
//     } catch (deleteError) {
//       console.error(`Failed to delete order ${orderId}:`, deleteError);
//       // Add error details to redirect URL
//       url.searchParams.set('deleteFailed', 'true');
//     }
//   }
//   return NextResponse.redirect(url);
// }



// app/api/check-status/route.ts
import { NextResponse } from 'next/server';
import { getClient } from '@/lib/pg-client';
import Order from '@/models/Order';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantOrderId = searchParams.get('merchantOrderId');
    const errorCode = searchParams.get('errorCode');

    if (!merchantOrderId) {
      return NextResponse.json(
        { success: false, error: 'missing_order_id' },
        { status: 400 }
      );
    }

    const client = getClient();
    
    // Handle explicit payment errors
    if (errorCode) {
      await updateOrderStatus(merchantOrderId, 'Failed');
      return NextResponse.json({
        success: false,
        redirectUrl: `/payment-failed?orderId=${merchantOrderId}&errorCode=${errorCode}`,
        status: 'Failed'
      });
    }

    // Normal status check flow
    const response = await client.getOrderStatus(merchantOrderId);
    const paymentStatus = response.state === "COMPLETED" ? 'Paid' : 'Failed';
    await updateOrderStatus(merchantOrderId, paymentStatus);

    // Return JSON with redirect URL instead of actual redirect
    if (paymentStatus === 'Paid') {
      return NextResponse.json({
        success: true,
        redirectUrl: `/order-confirmation/${merchantOrderId}?clearCart=true`,
        status: 'Paid'
      });
    }

    // Handle failed payments
    if (paymentStatus === 'Failed') {
      return NextResponse.json({
        success: false,
        redirectUrl: `/payment-failed?orderId=${merchantOrderId}${response.errorCode ? `&errorCode=${response.errorCode}` : ''}`,
        status: 'Failed'
      });
    }

    // For any other status
    return NextResponse.json({
      success: false,
      redirectUrl: `/payment-pending?orderId=${merchantOrderId}`,
      status: 'Pending'
    });

  } catch (error: any) {
    console.error("Error in check-status:", error);
    const orderId = new URL(request.url).searchParams.get('merchantOrderId');
    
    return NextResponse.json({
      success: false,
      error: 'server_error',
      message: error.message,
      redirectUrl: `/payment-error?error=server_error${orderId ? `&orderId=${orderId}` : ''}`,
      status: 'Error'
    });
  }
}

async function updateOrderStatus(orderId: string, status: string) {
  await Order.findOneAndUpdate(
    { orderId },
    { 
      paymentStatus: status,
    },
    { new: true }
  );
}