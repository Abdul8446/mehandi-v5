// app/api/products/[id]/stock/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Product from '@/models/Product';
import dbConnect from '@/lib/mongoose';
import { verifyToken } from '@/lib/authUtils';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  try {
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      stock: product.stock,
      reserved: product.reserved || 0
    });
  } catch (error) {
    console.error('Error fetching product stock:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product stock' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  
  try {
    const { id } = await params;

    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    verifyToken(token); // Verify but don't need userId here
    
    const { quantity, action } = await request.json();
    const productId = id;
    
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }
    
    // if (action === 'reserve') {
    //   if (product.stock - (product.reserved || 0) < quantity) {
    //     return NextResponse.json(
    //       { error: 'Not enough stock available' },
    //       { status: 400 }
    //     );
    //   }
    //   product.reserved = (product.reserved || 0) + quantity;
    // } else if (action === 'release') {
    //   if ((product.reserved || 0) < quantity) {
    //     return NextResponse.json(
    //       { error: 'Cannot release more than reserved' },
    //       { status: 400 }
    //     );
    //   }
    //   product.reserved = Math.max(0, (product.reserved || 0) - quantity);
    // }


    switch (action) {
      case 'reserve':
        console.log('action reserve')
        // For adding to cart
        if (product.stock - (product.reserved || 0) < quantity) {
          return NextResponse.json(
            { error: 'Insufficient available stock' },
            { status: 400 }
          );
        }
        product.reserved = (product.reserved || 0) + quantity;
        break;

      case 'release':
        console.log('action release')
        // For removing from cart or expiration
        if ((product.reserved || 0) < quantity) {
          return NextResponse.json(
            { error: 'Cannot release more than reserved' },
            { status: 400 }
          );
        }
        product.reserved = Math.max(0, (product.reserved || 0) - quantity);
        break;

      case 'fulfill-order':
        console.log('action fulfill-order')
        // For completed orders
        if (product.stock < quantity) {
          return NextResponse.json(
            { error: 'Insufficient stock' },
            { status: 400 }
          );
        }
        product.stock -= quantity;
        // Note: We don't modify reserved here - that's handled by separate 'release' call
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
    
    await product.save();
    
    return NextResponse.json({
      success: true,
      stock: product.stock,
      reserved: product.reserved || 0
    });
  } catch (error) {
    console.error('Error updating product stock:', error);
    return NextResponse.json(
      { error: 'Failed to update product stock' },
      { status: 500 }
    );
  }
}