// import { NextResponse } from 'next/server';
// import axios from 'axios';
// import phonepeConfig from '@/lib/phonepe.config';
// import { PaymentData, PaymentResponse } from '@/types/payment';
// import { Phone } from 'lucide-react';

// const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production' 
//   ? 'https://api.phonepe.com/apis/identity-manager'
//   : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

// export async function POST(request: Request) {
//   try {
//     const paymentData: PaymentData = await request.json();
  
//     // Call internal auth API endpoint
//     const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/auth`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       // Include any required auth data in the body
//       body: JSON.stringify({ 
//         merchantId: phonepeConfig.merchantId 
//       }),
//       mode: 'cors',
//     });

//     if (!authResponse.ok) {
//       throw new Error('Failed to fetch authentication token');
//     }

//     const authData = await authResponse.json();
//     const accessToken = authData.accessToken;


//     const payload = {
//       // merchantId: phonepeConfig.merchantId,
//       merchantOrderId: paymentData.orderId || `ORDER_${Date.now()}`,
//       amount: paymentData.amount * 100, // Convert to paise
//       expireAfter: 1200,
//       // metaInfo: {
//       //   udf1: paymentData.full_name,
//       //   udf2: paymentData.email,
//       //   udf3: paymentData.phone,
//       //   udf4: paymentData.pincode,
//       //   udf5: 'Additional Info',
//       // },
//       paymentFlow: {
//         type: 'PG_CHECKOUT',
//         message: 'Payment message',
//         merchantUrls: {
//           redirectUrl: process.env.PHONEPE_REDIRECT_URL,
//           callbackUrl: process.env.PHONEPE_WEBHOOK_URL, 
//         },
//       },
//     };


//     console.log('redirectUrl:', process.env.PHONEPE_REDIRECT_URL);
//     console.log('webhookUrl:', process.env.PHONEPE_WEBHOOK_URL);

//     const response = await axios.post(
//       `${PHONEPE_BASE_URL}/checkout/v2/pay`,
//       payload,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `O-Bearer ${accessToken}`,
//         },
//       }
//     );

//     // Return successful response
//     return NextResponse.json(
//       {
//         success: true,
//         data: {
//           orderId: response.data.orderId,
//           state: response.data.state,
//           expireAt: response.data.expireAt,
//           redirectUrl: response.data.redirectUrl,
//         },
//       },   
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error('Error creating payment:', error?.response?.data || error.message || error);
    
//     return NextResponse.json(
//       { 
//         success: false,
//         message: error?.response?.data?.message || error.message || 'Payment creation failed'
//       },
//       { status: error?.response?.status || 500 }
//     );
//   }
// }




import { NextResponse } from 'next/server';
import axios from 'axios';
import phonepeConfig from '@/lib/phonepe.config';
import { PaymentData, PaymentResponse } from '@/types/payment';
import { Phone } from 'lucide-react';
import { StandardCheckoutClient, Env, StandardCheckoutPayRequest } from 'pg-sdk-node';

const PHONEPE_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.phonepe.com/apis/identity-manager'
  : 'https://api-preprod.phonepe.com/apis/pg-sandbox';

export async function POST(request: Request) {
  try {
    const paymentData: PaymentData = await request.json();
  
    // Call internal auth API endpoint
    const authResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Include any required auth data in the body
      body: JSON.stringify({ 
        merchantId: phonepeConfig.merchantId 
      }),
      mode: 'cors',
    });

    if (!authResponse.ok) {
      throw new Error('Failed to fetch authentication token');
    }

    const authData = await authResponse.json();
    const accessToken = authData.accessToken;


    const payload = {
      // merchantId: phonepeConfig.merchantId,
      merchantOrderId: paymentData.orderId || `ORDER_${Date.now()}`,
      amount: paymentData.amount * 100, // Convert to paise
      expireAfter: 1200,
      // metaInfo: {
      //   udf1: paymentData.full_name,
      //   udf2: paymentData.email,
      //   udf3: paymentData.phone,
      //   udf4: paymentData.pincode,
      //   udf5: 'Additional Info',
      // },
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Payment message',
        merchantUrls: {
          redirectUrl: process.env.PHONEPE_REDIRECT_URL,
          callbackUrl: process.env.PHONEPE_WEBHOOK_URL, 
        },
      },
    };


    console.log('redirectUrl:', process.env.PHONEPE_REDIRECT_URL);
    console.log('webhookUrl:', process.env.PHONEPE_WEBHOOK_URL);

    const response = await axios.post(
      `${PHONEPE_BASE_URL}/checkout/v2/pay`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `O-Bearer ${accessToken}`,
        },
      }
    );

    // Return successful response
    return NextResponse.json(
      {
        success: true,
        data: {
          orderId: response.data.orderId,
          state: response.data.state,
          expireAt: response.data.expireAt,
          redirectUrl: response.data.redirectUrl,
        },
      },   
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating payment:', error?.response?.data || error.message || error);
    
    return NextResponse.json(
      { 
        success: false,
        message: error?.response?.data?.message || error.message || 'Payment creation failed'
      },
      { status: error?.response?.status || 500 }
    );
  }
}