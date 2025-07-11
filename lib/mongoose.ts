import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose || { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    console.log('🔍 Connected DB:', mongoose.connection.name);
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔌 Connecting to MongoDB...');
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: 'mehandi-mansion',
      bufferCommands: false,
    }).then((mongoose) => {
      console.log('✅ MongoDB connected');
      return mongoose;
    }).catch((err) => {
      console.error('❌ MongoDB connection error:', err);
      throw err;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

(global as any).mongoose = cached;

export default dbConnect;
