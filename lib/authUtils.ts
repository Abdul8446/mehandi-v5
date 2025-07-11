import jwt from 'jsonwebtoken';   

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET || 'your-secret-key';

export const verifyToken = (token: string): { userId: string } => {
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error);
    throw new Error('Invalid token');
  }
};

// You might also want to add a function to generate tokens
export const generateToken = (userId: string): string => {
   if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
   } 
   return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};
