// /app/api/payment/webhook/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import phonepeConfig from '@/lib/phonepe.config';

// Simplified type definitions focusing only on order events
type PhonePeEvent = 'checkout.order.completed' | 'checkout.order.failed';

interface PaymentDetail {
  paymentMode: string;
  transactionId: string;
  timestamp: number;
  amount: number;
  state: string;
  errorCode?: string;
  detailedErrorCode?: string;
}

interface OrderPayload {
  state: 'COMPLETED' | 'FAILED';
  amount: number;
  timestamp: number;
  orderId: string;
  merchantId: string;
  merchantOrderId: string;
  expireAt: number;
  metaInfo?: {
    udf1?: string;
    udf2?: string;
    udf3?: string;
    udf4?: string;
  };
  paymentDetails: PaymentDetail[];
}

interface PhonePeWebhookBody {
  event: PhonePeEvent;
  payload: OrderPayload;
}

// Cache the auth header generation since config values won't change during runtime
const expectedAuth = crypto
  .createHash('sha256')
  .update(`${phonepeConfig.webhookUsername}:${phonepeConfig.webhookPassword}`)
  .digest('hex');

export async function POST(request: Request) {
  const authHeader = (await headers()).get('authorization');
  
  // Immediate return for unauthorized requests
  if (!authHeader || authHeader !== expectedAuth) {
    console.warn('Unauthorized webhook attempt');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json() as PhonePeWebhookBody;
    
    // Validate required fields
    if (!body.event || !body.payload?.merchantOrderId) {
      console.log('Invalid webhook payload:', body);
      return NextResponse.json(
        { error: 'Invalid webhook payload' },
        { status: 400 }
      );
    }

    const { merchantOrderId, state } = body.payload;
    const status = state === 'COMPLETED' ? 'PAID' : 'FAILED';

    // In a real implementation, you would:
    // 1. Verify the transaction with PhonePe's API
    // 2. Update your database
    // 3. Trigger any post-payment actions
    // await verifyTransactionWithPhonePe(merchantOrderId);
    // await updateOrderStatus(merchantOrderId, status);
    // await triggerPostPaymentActions(merchantOrderId);

    console.log(`Order ${merchantOrderId} updated to status: ${status}`);
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Block GET requests
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}