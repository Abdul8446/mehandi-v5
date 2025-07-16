import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';
import { generateToken } from '@/lib/authUtils';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { phone, answers, newPassword } = await request.json();
  
  if (!phone || !answers || !newPassword) {
    return NextResponse.json(
      { error: 'Phone, answers, and new password are required' },
      { status: 400 }
    );
  }

  if (newPassword.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const user = await User.findOne({ phone }).select('+securityQuestions.answer');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isValid = await user.verifySecurityAnswers(answers);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Incorrect answers to security questions' },
        { status: 401 }
      );
    }

    console.log(user, 'new user password');

    // Update password
    // const salt = await bcrypt.genSalt(10);
    user.password = newPassword
    await user.save();

    // Generate new token
    const token = generateToken(user._id.toString());

    return NextResponse.json({ 
      success: true,
      token
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Password reset failed' },
      { status: 500 }
    );
  }
}