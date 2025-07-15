import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';
import { UserRole } from '@/models/User';
import { generateToken } from '@/lib/authUtils';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { phone, name, password } = await request.json();
  await connectDB();

  // Validate input
  if (!phone || phone.length !== 10) {
    return NextResponse.json(
      { error: 'Invalid phone number' },
      { status: 400 }
    );
  }

  if (!name || name.trim().length < 2) {
    return NextResponse.json(
      { error: 'Name must be at least 2 characters' },
      { status: 400 }
    );
  }

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters' },
      { status: 400 }
    );
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Hash password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({ 
      phone, 
      name,
      password: password,
      role: UserRole.USER 
    });

    // Generate token
    const token = generateToken(user._id.toString());

    return NextResponse.json(
      { 
        success: true, 
        user: { 
          id: user._id, 
          phone: user.phone, 
          name: user.name 
        }, 
        token 
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}