// import { NextApiRequest, NextApiResponse } from 'next';
// import Product, { Review } from '@/models/Product';
// import dbConnect from '@/lib/mongoose';
// import { verifyToken } from '@/lib/authUtils';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();
//   const { id } = req.query;

//   if (req.method === 'GET') {
//     try {
//       const product = await Product.findById(id).select('reviews rating reviewsCount');
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }
//       res.status(200).json({ reviews: product.reviews, rating: product.rating, reviewsCount: product.reviewsCount });
//     } catch (error) {
//       res.status(500).json({ message: 'Server error' });
//     }
//   } 
//   else if (req.method === 'POST') {
//     // Get token from authorization header
//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return res.status(401).json({ message: 'Unauthorized - No token provided' });
//     }

//     const token = authHeader.split(' ')[1];
//     let userId: string;
    
//     try {
//       const decoded = verifyToken(token);
//       userId = decoded.userId;
//     } catch (error) {
//       return res.status(401).json({ message: 'Unauthorized - Invalid token' });
//     }

//     const { rating, comment, userName, userAvatar } = req.body;
    
//     if (!rating || !comment) {
//       return res.status(400).json({ message: 'Rating and comment are required' });
//     }

//     try {
//       const product = await Product.findById(id);
//       if (!product) {
//         return res.status(404).json({ message: 'Product not found' });
//       }

//       // Check if user already reviewed this product
//       const existingReview = product.reviews.find(
//         (review: Review) => review.userId.toString() === userId
//       );

//       if (existingReview) {
//         return res.status(400).json({ message: 'You have already reviewed this product' });
//       }

//       const newReview = {
//         userId,
//         user: userName || 'Anonymous',
//         rating: Number(rating),
//         comment,
//         avatar: userAvatar || '/default-avatar.jpg'
//       };

//       product.reviews.push(newReview);
//       await product.save();

//       res.status(201).json({ message: 'Review added successfully', review: newReview });
//     } catch (error) {
//       console.error('Error adding review:', error);
//       res.status(500).json({ message: 'Server error' });
//     }
//   } 
//   else {
//     res.setHeader('Allow', ['GET', 'POST']);
//     res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }


// app/api/products/[id]/reviews/route.ts
import { NextResponse } from 'next/server';
import Product, { Review } from '@/models/Product';
import dbConnect from '@/lib/mongoose';
import { verifyToken } from '@/lib/authUtils';
import { create } from 'domain';
import User from '@/models/User';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  try {
    const product = await Product.findById(id).select('reviews rating reviewsCount');
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    const rating= product.reviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
    const reviewsCount = product.reviews.length;
  

    return NextResponse.json({ 
      reviews: product.reviews, 
      rating: rating, 
      reviewsCount: reviewsCount 
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  await dbConnect();
  const { id } = await params;

  // Get token from authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { message: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  let userId: string;
  
  try {
    const decoded = verifyToken(token);
    userId = decoded.userId;
  } catch (error) {
    return NextResponse.json(
      { message: 'Unauthorized - Invalid token' },
      { status: 401 }
    );
  }

  const { rating, comment, userName, userAvatar } = await request.json();
  
  if (!rating || !comment) {
    return NextResponse.json(
      { message: 'Rating and comment are required' },
      { status: 400 }
    );
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      (review: Review) => review.userId.toString() === userId
    );

    if (existingReview) {
      return NextResponse.json(
        { message: 'You have already reviewed this product' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }else{
      const newReview: Review = {
        userId,
        user: user.name,
        rating: Number(rating),
        comment,
        avatar: userAvatar || '/default-avatar.jpg',
        createdAt: new Date(),
      };
  
      product.reviews.push(newReview);
      await product.save();
  
      return NextResponse.json(
        { message: 'Review added successfully', review: newReview },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error('Error adding review:', error);
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    );
  }
}