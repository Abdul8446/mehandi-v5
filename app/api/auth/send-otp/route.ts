import { NextResponse } from 'next/server';
import { SendOtpRequest, SendOtpResponse } from '@/types/otp';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  const { phone }: SendOtpRequest = await request.json();

  if (!phone || phone.length !== 10) {
    return NextResponse.json(
      { error: 'Invalid phone number' },
      { status: 400 }   
    );
  }

  try {
    const response = await fetch(
      `https://2factor.in/API/V1/${process.env.NEXT_PUBLIC_2FACTOR_API_KEY}/SMS/${phone}/AUTOGEN/YourAppName`,
      { method: "GET" }
    );

    const data: SendOtpResponse = await response.json();

    if (data.Status === "Success") {
      return NextResponse.json({
        success: true,
        sessionId: data.Details,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send OTP" },
        { status: 400 }
      );
    }

    // For demo, we'll just return success
    // return NextResponse.json(
    //   { success: true, message: 'OTP sent successfully' },
    //   { status: 200 }
    // );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}