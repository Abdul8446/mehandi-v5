import { NextResponse } from 'next/server';
import twilio from 'twilio';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';
import { UserRole } from '@/models/User';
import { generateToken } from '@/lib/authUtils';

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

export async function POST(request: Request) {
  const { phone, otp, name } = await request.json();
  await connectDB();

  if (!phone || phone.length !== 10) {
    return NextResponse.json(
      { error: 'Invalid phone number' },
      { status: 400 }
    );
  }

  if (!otp || otp.length !== 4) {
    return NextResponse.json(
      { error: 'Invalid OTP' },
      { status: 400 }
    );
  }

  try {
    // In production, verify the OTP with Twilio
    // const verificationCheck = await client.verify.v2
    //   .services(process.env.TWILIO_SERVICE_SID)
    //   .verificationChecks.create({ to: `+91${phone}`, code: otp });

    // For demo, we'll accept any 4-digit OTP as valid
    // if (verificationCheck.status !== 'approved') {
    //   return NextResponse.json(
    //     { error: 'Invalid OTP' },
    //     { status: 400 }
    //   );
    // }

    // Find or create user
    let user = await User.findOne({ phone });

    if (!user && !name) {
      return NextResponse.json(
        { error: 'User not found. Registration required.' },
        { status: 404 }
      );
    }

    if (!user) {
      user = await User.create({ 
        phone, 
        name,
        role: UserRole.USER 
      });
    }

    // Generate a simple token (in production, use JWT)
    const token = generateToken(user._id.toString());

    return NextResponse.json(
      { success: true, user: { id: user._id, phone: user.phone, name: user.name }, token, type: 'user'},
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}