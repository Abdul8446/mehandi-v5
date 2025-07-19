// // app/api/cart/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Cart from '@/models/Cart';
// import dbConnect from '@/lib/mongoose';
// import { verifyToken } from '@/lib/authUtils'; // Implement this utility

// export async function GET(request: NextRequest) {
//   await dbConnect();
  
//   try {
//     const token = request.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json(
//         { error: 'Authorization token required' },
//         { status: 401 }
//       );
//     }

//     const { userId } = verifyToken(token); // Implement proper token verification
    
//     const cart = await Cart.findOne({ userId });
//     return NextResponse.json({ items: cart?.items || [] });
//   } catch (error) {
//     console.error('Error fetching cart:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch cart' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   await dbConnect();
  
//   try {
//     const token = request.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json(
//         { error: 'Authorization token required' },
//         { status: 401 }
//       );
//     }

//     const { userId } = verifyToken(token);
//     const { items } = await request.json();

//     console.log('Updating cart for user:', userId, 'with items:', items);
    
//     const cart = await Cart.findOneAndUpdate(
//       { userId },
//       { 
//         userId,
//         $set: { items } 
//       },
//       { upsert: true, new: true }
//     );

//     return NextResponse.json(cart);
//   } catch (error) {
//     console.error('Error updating cart:', error);
//     return NextResponse.json(
//       { error: 'Failed to update cart' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request: NextRequest) {
//   await dbConnect();
  
//   try {
//     const token = request.headers.get('authorization')?.split(' ')[1];
//     if (!token) {
//       return NextResponse.json(
//         { error: 'Authorization token required' },
//         { status: 401 }
//       );
//     }

//     const { userId } = verifyToken(token);
    
//     await Cart.findOneAndDelete({ userId });
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error clearing cart:', error);
//     return NextResponse.json(
//       { error: 'Failed to clear cart' },
//       { status: 500 }
//     );
//   }
// }



// app/api/cart/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Cart from '@/models/Cart';
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
    
    const cart = await Cart.findOne({ userId });
    
    // Check if cart is expired
    if (cart?.expiresAt && new Date(cart.expiresAt) < new Date()) {
      await Cart.findOneAndDelete({ userId });
      return NextResponse.json({ items: [] });
    }
    
    return NextResponse.json({ 
      items: cart?.items || [],
      expiresAt: cart?.expiresAt 
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
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
    const { items, expiresAt } = await request.json();

    // Set expiry to 30 minutes from now if not provided
    const expiryDate = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 30 * 60000);
    
    const cart = await Cart.findOneAndUpdate(
      { userId },
      { 
        userId,
        items,
        expiresAt: expiryDate
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(cart);
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Failed to update cart' },
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
    
    await Cart.findOneAndDelete({ userId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}