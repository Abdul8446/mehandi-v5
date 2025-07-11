import { NextRequest, NextResponse } from 'next/server';
import Wishlist from '@/models/Wishlist';
import dbConnect from '@/lib/mongoose';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { userId } = verifyToken(token);
    const wishlist = await Wishlist.findOne({ userId });
    
    return NextResponse.json({ items: wishlist?.items || [] });
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { userId } = verifyToken(token);
    const { product } = await request.json();

    // Check if product already exists in wishlist
    const existingWishlist = await Wishlist.findOne({ userId });
    const existingItem = existingWishlist?.items.find(
      (item: any) => item.productId === product._id
    );

    if (existingItem) {
      return NextResponse.json(
        { error: 'Product already in wishlist' },
        { status: 400 }
      );
    }

    const wishlistItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      addedAt: new Date()
    };

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { 
        userId,
        $push: { items: wishlistItem } 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(wishlist.items);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();
  
  try {
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const { userId } = verifyToken(token);
    const { productId } = await request.json();

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!wishlist) {
      return NextResponse.json(
        { error: 'Wishlist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(wishlist.items);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}