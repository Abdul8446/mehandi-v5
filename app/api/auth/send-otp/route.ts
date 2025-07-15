import { NextResponse } from 'next/server';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  const { phone } = await request.json();

  if (!phone || phone.length !== 10) {
    return NextResponse.json(
      { error: 'Invalid phone number' },
      { status: 400 }   
    );
  }

  try {
    // In production, you would send a real OTP
    // const verification = await client.verify.v2
    //   .services(process.env.TWILIO_SERVICE_SID)
    //   .verifications.create({ to: `+91${phone}`, channel: 'sms' });

    // For demo, we'll just return success
    return NextResponse.json(
      { success: true, message: 'OTP sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}