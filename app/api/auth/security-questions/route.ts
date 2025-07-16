import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');
  
  if (!phone) {
    return NextResponse.json(
      { error: 'Phone number is required' },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const user = await User.findOne({ phone }).select('securityQuestions.question');
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const questions = user.securityQuestions.map((q: any) => q.question);
    return NextResponse.json({ questions });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get security questions' },
      { status: 500 }
    );
  }
}