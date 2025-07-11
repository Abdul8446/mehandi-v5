// /app/api/test-db/route.ts
import dbConnect from '@/lib/mongoose';

export async function GET() {
  try {
    await dbConnect();
    return new Response('Connected to DB!', { status: 200 });
  } catch (error: any) {
    console.error('Database connection error:', error);
    return new Response(`DB Error: ${error.message || error.toString()}`, { status: 500 });
  }
}