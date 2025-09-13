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