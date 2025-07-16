// import { NextResponse } from 'next/server';
// import User from '@/models/User';
// import connectDB from '@/lib/mongoose';
// import { generateToken } from '@/lib/authUtils';
// import bcrypt from 'bcryptjs';

// export async function POST(request: Request) {
//   const { identifier, password } = await request.json();
//   console.log(identifier, password, 'identifier, password');
//   await connectDB();

//   if (!identifier || !password) {
//     return NextResponse.json(
//       { error: 'Phone/name and password are required' },
//       { status: 400 }
//     );
//   }

//   try {
//     // Find user by phone or name
//     const user = await User.findOne({
//       $or: [
//         { phone: identifier },
//         { name: identifier }
//       ]
//     });
//     console.log(user, 'user found');

//     if (!user) {
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//         console.log('Invalid password');
//       return NextResponse.json(
//         { error: 'Invalid credentials' },
//         { status: 401 }
//       );
//     }

//     // Generate token
//     const token = generateToken(user._id.toString());

//     return NextResponse.json(
//       { 
//         success: true, 
//         user: { 
//           id: user._id, 
//           phone: user.phone, 
//           name: user.name 
//         }, 
//         token 
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.log('Login error:', error.message || error);
//     return NextResponse.json(
//       { error: 'Login failed' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';
import { generateToken } from '@/lib/authUtils';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { identifier, password } = await request.json();
  console.log(identifier, password, 'identifier, password');
  await connectDB();

  if (!identifier || !password) {
    return NextResponse.json(
      { error: 'Phone/name and password are required' },
      { status: 400 }
    );
  }

  try {
    // Find user by phone or name (INCLUDING PASSWORD)
    const user = await User.findOne({
      $or: [
        { phone: identifier },
        { name: identifier }
      ]
    }).select('+password'); // <-- FIX: Explicitly include password

    console.log(user, 'user found');

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Invalid password');
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate token
    const token = generateToken(user._id.toString());

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user.toObject();

    console.log(userWithoutPassword, 'user without password');

    return NextResponse.json(
      { 
        success: true, 
        user: userWithoutPassword, 
        token 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log('Login error:', error.message || error);
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}