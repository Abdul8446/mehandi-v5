import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import GalleryItem from '@/models/GalleryItem';
import { Types } from 'mongoose';

export async function GET() {
  await dbConnect();
  try {
    const items = await GalleryItem.find({}).sort({ createdAt: -1 });
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch gallery items' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const body = await request.json();
    const item = new GalleryItem({
      ...body,
      _id: new Types.ObjectId().toString(),
    });
    await item.save();
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { message: 'Failed to create gallery item' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { message: 'Gallery item ID is required' },
        { status: 400 }
      );
    }

    const item = await GalleryItem.findByIdAndDelete(id);
    if (!item) {
      return NextResponse.json(
        { message: 'Gallery item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Gallery item deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete gallery item' },
      { status: 400 }
    );
  }
}
