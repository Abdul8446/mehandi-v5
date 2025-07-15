// app/api/check-status/route.ts
import { NextResponse } from 'next/server';
import { getClient } from '@/lib/pg-client';
import Order from '@/models/Order';
const redirectUrl = process.env.PHONEPE_ENV === "UAT" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_BASE_URL;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantOrderId = searchParams.get('merchantOrderId');
    const errorCode = searchParams.get('errorCode');

    if (!merchantOrderId) {
      return redirectToErrorPage('missing_order_id');
    }

    const client = getClient();
    
    // Handle explicit payment errors
    if (errorCode) {
      await updateOrderStatus(merchantOrderId, 'Failed');
      return redirectToFailurePage(merchantOrderId, errorCode);
    }

    // Normal status check flow
    const response = await client.getOrderStatus(merchantOrderId);
    const paymentStatus = response.state === "COMPLETED" ? 'Paid' : 'Failed';
    await updateOrderStatus(merchantOrderId, paymentStatus);

    // Only allow redirect to order page for Paid or Failed statuses
    if (paymentStatus === 'Paid') {
      return redirectToOrderPage(merchantOrderId);
    }

     // Handle failed payments
    if (paymentStatus === 'Failed') {
      return redirectToFailurePage(merchantOrderId, response.errorCode);
    }

    // For any other status, redirect to a pending page or error page
    return redirectToPendingPage(merchantOrderId);

  } catch (error: any) {
    console.error("Error in check-status:", error);
    return redirectToErrorPage('server_error', error.message);
  }
}

// Helper functions
async function updateOrderStatus(orderId: string, status: string) {
  await Order.findOneAndUpdate(
    { orderId },
    { 
      paymentStatus: status,
    }
  );
}

function redirectToOrderPage(orderId: string) {
  const url = new URL(`/order-confirmation/${orderId}`, redirectUrl);
  url.searchParams.set('clearCart', 'true');
  return NextResponse.redirect(url);
}

function redirectToPendingPage(orderId: string) {
  const url = new URL('/payment-pending', redirectUrl);
  url.searchParams.set('orderId', orderId);
  return NextResponse.redirect(url);
}

function redirectToFailurePage(orderId: string, errorCode?: string) {
  const url = new URL('/payment-failed', redirectUrl);
  url.searchParams.set('orderId', orderId);
  if (errorCode) {
    url.searchParams.set('errorCode', errorCode);
  }
  return NextResponse.redirect(url);
}

function redirectToErrorPage(errorType: string, message?: string) {
  const url = new URL('/payment-error', process.env.NEXT_PUBLIC_BASE_URL);
  url.searchParams.set('error', errorType);
  if (message) {
    url.searchParams.set('message', encodeURIComponent(message));
  }
  return NextResponse.redirect(url);
}