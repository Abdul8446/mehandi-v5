import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import User from '@/models/User'

export async function GET() {
  await dbConnect()
  const users = await User.find()
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()
  const newUser = await User.create(body)
  return NextResponse.json(newUser, { status: 201 })
}
