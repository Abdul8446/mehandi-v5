// app/api/auth/validate/route.ts
import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/authUtils';

export async function POST(request: Request) {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }

  try {
    verifyToken(token); // Will throw if invalid
    return NextResponse.json({ valid: true });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}