// import { NextResponse } from 'next/server';
// import User from '@/models/User';
// import connectDB from '@/lib/mongoose';
// import { UserRole } from '@/models/User';
// import { generateToken } from '@/lib/authUtils';
// import bcrypt from 'bcryptjs';

// export async function POST(request: Request) {
//   const { phone, name, password } = await request.json();
//   await connectDB();

//   // Validate input
//   if (!phone || phone.length !== 10) {
//     return NextResponse.json(
//       { error: 'Invalid phone number' },
//       { status: 400 }
//     );
//   }

//   if (!name || name.trim().length < 2) {
//     return NextResponse.json(
//       { error: 'Name must be at least 2 characters' },
//       { status: 400 }
//     );
//   }

//   if (!password || password.length < 6) {
//     return NextResponse.json(
//       { error: 'Password must be at least 6 characters' },
//       { status: 400 }
//     );
//   }

//   try {
//     // Check if user already exists
//     const existingUser = await User.findOne({ phone });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: 'Phone number already registered' },
//         { status: 400 }
//       );
//     }

//     // Hash password
//     // const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const user = await User.create({ 
//       phone, 
//       name,
//       password: password,
//       role: UserRole.USER 
//     });

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
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Registration failed' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import User from '@/models/User';
import connectDB from '@/lib/mongoose';
import { UserRole } from '@/models/User';
import { generateToken } from '@/lib/authUtils';
import bcrypt from 'bcryptjs';

const SECURITY_QUESTIONS = [
  "What was your first pet's name?",
  "What city were you born in?",
  "What's your mother's maiden name?",
  "What was your first school's name?"
];

export async function POST(request: Request) {
  const { phone, name, password, securityQuestion1, securityAnswer1, securityQuestion2, securityAnswer2} = await request.json();
  await connectDB();

  console.log(securityQuestion1,'securityQuestion1 is here',securityAnswer1,'securityAnswer1 is here',securityQuestion2,'securityQuestion2 is here',securityAnswer2,'securityAnswer2 is here');

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

  if (!SECURITY_QUESTIONS.includes(securityQuestion1) || !SECURITY_QUESTIONS.includes(securityQuestion2)) {
    console.log(SECURITY_QUESTIONS.includes(securityQuestion1),'question1',securityQuestion1, SECURITY_QUESTIONS.includes(securityQuestion2),'question2',securityQuestion2);
    return NextResponse.json(
      { error: 'Invalid security questions' },
      { status: 400 }
    );
  }

  if (!securityAnswer1 || !securityAnswer2 || securityAnswer1.length < 2 || securityAnswer2.length < 2) {
    return NextResponse.json(
      { error: 'Security answers must be at least 2 characters' },
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

    // Create new user with security questions
    const user = await User.create({ 
      phone, 
      name,
      password,
      securityQuestions: [
        { question: securityQuestion1, answer: securityAnswer1 },
        { question: securityQuestion2, answer: securityAnswer2 }
      ],
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
  } catch (error: any) {
    console.log(error.message || error , 'error');
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}