import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Product from '@/models/Product';
import { Types } from 'mongoose';
// import { Types } from 'twilio/lib/rest/content/v1/content';
// import Product from '@/models/Product'

export async function GET() {
  await dbConnect()
  // const products = await Product.find().lean()
  // console.log(products)
  // return NextResponse.json(products)
  try {
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}    

export async function POST(request: Request) {
  await dbConnect();
  
  try {
    const body = await request.json();
    const product = new Product({
      ...body,
      _id: new Types.ObjectId(),
    });
    console.log(product, 'product');
    await product.save();
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate status if it's being updated
    if (body.status && !['Active', 'Disabled'].includes(body.status)) {
      return NextResponse.json(
        { message: 'Invalid status value. Must be either "Active" or "Disabled"' },
        { status: 400 }
      );
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      {$set:body}, 
      {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { message: 'Failed to update product' },
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
        { message: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to delete product' },
      { status: 400 }
    );
  }
}