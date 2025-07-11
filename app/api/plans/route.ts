import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import Plan from '@/models/Plan';

export async function GET() {  
  try {
    await dbConnect();
    const plans = await Plan.find({}).lean();
    return NextResponse.json(plans);  
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load plans' }, { status: 500 });
  }
}
