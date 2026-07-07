import { NextResponse } from 'next/server';
import { getClient } from '@/lib/pg-client';
import Order from '@/models/Order';
import dbConnect from '@/lib/mongoose';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      console.warn("Webhook unauthorized attempt missing header");
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const rawBody = await request.text();
    const client = getClient();
    
    const username = process.env.PHONEPE_WEBHOOK_USERNAME as string;
    const password = process.env.PHONEPE_WEBHOOK_PASSWORD as string;
    
    let callbackResponse;
    try {
      // Validate the callback securely using the SDK
      callbackResponse = client.validateCallback(
        username,
        password,
        authorization,
        rawBody
      );
    } catch (validationError: any) {
      console.error("PhonePe Webhook Validation Failed:", validationError.message);
      return NextResponse.json({ success: false, error: 'Invalid signature or credentials' }, { status: 400 });
    }

    // PhonePe callback usually contains payload.merchantOrderId or payload.orderId
    const orderId = callbackResponse?.payload?.merchantOrderId || callbackResponse?.payload?.orderId;
    const state = callbackResponse?.payload?.state;

    if (!orderId) {
      console.error("PhonePe Webhook Invalid Payload:", callbackResponse);
      return NextResponse.json({ success: false, error: 'Invalid payload, missing orderId' }, { status: 400 });
    }

    const paymentStatus = state === "COMPLETED" ? 'Paid' : 'Failed';

    // Idempotent update: Even if /check-status ran first, this is safe and will just overwrite identically.
    await Order.findOneAndUpdate(
      { orderId: orderId },
      { paymentStatus: paymentStatus },
      { new: true }
    );

    console.log(`Webhook successfully processed order ${orderId} as ${paymentStatus}`);
    
    // Always return 200 OK so PhonePe knows we received it
    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error: any) {
    console.error("PhonePe Webhook Internal Error:", error);
    // Return 500 so PhonePe retries if it's a server/DB issue
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
