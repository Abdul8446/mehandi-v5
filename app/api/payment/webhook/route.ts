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
    const authorization = request.headers.get('authorization');
    
    let orderId: string | undefined;
    let paymentStatus: string | undefined;

    // SCENARIO 1: Dashboard Configured Webhook (Username / Password Auth)
    if (authorization) {
      const username = process.env.PHONEPE_WEBHOOK_USERNAME as string;
      const password = process.env.PHONEPE_WEBHOOK_PASSWORD as string;
      
      const expectedSha256 = crypto.createHash('sha256').update(username + ':' + password).digest('hex');
      // Some versions just hash username:password, some hash {username:password}. We'll use the SDK to be safe.
      
      const client = getClient();
      try {
        const callbackResponse = client.validateCallback(username, password, authorization, rawBodyText);
        const payloadData: any = callbackResponse?.payload;
        orderId = payloadData?.merchantOrderId || payloadData?.orderId;
        paymentStatus = (payloadData?.state === 'COMPLETED' || payloadData?.code === 'PAYMENT_SUCCESS') ? 'Paid' : 'Failed';
      } catch (e: any) {
        console.error("PhonePe Webhook Authorization Failed:", e.message);
        return NextResponse.json({ success: false, error: 'Invalid dashboard signature' }, { status: 400 });
      }
    } 
    // SCENARIO 2: Dynamic Webhook (X-Verify Checksum Auth)
    else if (xVerify && bodyData?.response) {
      const clientSecret = process.env.PHONEPE_ENV === "UAT" ? process.env.PHONEPE_UAT_CLIENT_SECRET : process.env.PHONEPE_CLIENT_SECRET;
      const clientVersion = 1;

      if (!clientSecret) {
         return NextResponse.json({ success: false, error: 'Server misconfigured' }, { status: 500 });
      }

      const expectedHash = crypto.createHash('sha256').update(bodyData.response + clientSecret).digest('hex');
      const expectedXVerify = `${expectedHash}###${clientVersion}`;

      if (xVerify !== expectedXVerify) {
        return NextResponse.json({ success: false, error: 'Invalid x-verify signature' }, { status: 400 });
      }

      const decodedResponse = Buffer.from(bodyData.response, 'base64').toString('utf-8');
      const parsedPayload = JSON.parse(decodedResponse);
      const payload = parsedPayload.data || parsedPayload.payload || parsedPayload;
      
      orderId = payload.merchantTransactionId || payload.merchantOrderId || payload.orderId;
      paymentStatus = (parsedPayload.code === 'PAYMENT_SUCCESS' || payload.state === 'COMPLETED' || payload.state === 'PAYMENT_SUCCESS') ? 'Paid' : 'Failed';
    } 
    else {
      console.warn("Webhook attempt missing both x-verify and authorization headers");
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    if (!orderId) {
      console.error("PhonePe Webhook Invalid Payload, could not find orderId");
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
