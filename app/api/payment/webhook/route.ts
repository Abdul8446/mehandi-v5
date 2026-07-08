import { NextResponse } from 'next/server';
import { getClient } from '@/lib/pg-client';
import Order from '@/models/Order';
import dbConnect from '@/lib/mongoose';

import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const rawBodyText = await request.text();
    let bodyData;
    try {
      bodyData = JSON.parse(rawBodyText);
    } catch (e) {
      return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
    }

    const xVerify = request.headers.get('x-verify');
    
    if (xVerify && bodyData.response) {
      // Retrieve the correct credentials (sandbox vs prod)
      const clientSecret = process.env.PHONEPE_ENV === "UAT" ? process.env.PHONEPE_UAT_CLIENT_SECRET : process.env.PHONEPE_CLIENT_SECRET;
      const clientVersion = 1;

      if (!clientSecret) {
         console.error("Missing PhonePe client secret in .env");
         return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
      }

      // Checksum = sha256(base64Payload + saltKey) + "###" + saltIndex
      const expectedHash = crypto.createHash('sha256').update(bodyData.response + clientSecret).digest('hex');
      const expectedXVerify = `${expectedHash}###${clientVersion}`;

      if (xVerify !== expectedXVerify) {
        console.error("PhonePe Webhook X-Verify Validation Failed");
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
      }
    } else {
      console.warn("Webhook unauthorized attempt missing x-verify header");
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Decode the base64 PhonePe response payload
    const decodedResponse = Buffer.from(bodyData.response, 'base64').toString('utf-8');
    const parsedPayload = JSON.parse(decodedResponse);
    
    // Extract data depending on API version structure
    const payload = parsedPayload.data || parsedPayload.payload || parsedPayload;
    
    const orderId = payload.merchantTransactionId || payload.merchantOrderId || payload.orderId;
    const paymentStatus = (parsedPayload.code === 'PAYMENT_SUCCESS' || payload.state === 'COMPLETED' || payload.state === 'PAYMENT_SUCCESS') ? 'Paid' : 'Failed';

    if (!orderId) {
      console.error("PhonePe Webhook Invalid Payload:", parsedPayload);
      return NextResponse.json({ success: false, error: 'Invalid payload, missing orderId' }, { status: 400 });
    }

    // Idempotent update: Even if /check-status ran first, this is safe and will just overwrite identically.
    await Order.findOneAndUpdate(
      { orderId: orderId },
      { paymentStatus: paymentStatus },
      { new: true }
    );

    console.log(`✅ Webhook successfully processed order ${orderId} as ${paymentStatus}`);
    
    // Always return 200 OK so PhonePe knows we received it
    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });

  } catch (error: any) {
    console.error("PhonePe Webhook Internal Error:", error);
    // Return 500 so PhonePe retries if it's a server/DB issue
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
