// app/not-found.tsx

import Link from 'next/link';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-red-900 font-bold text-9xl">404</div>
          <h1 className="text-3xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h1>
          <p className="text-gray-600">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/" className="btn-primary flex items-center justify-center px-4 py-2 rounded-md bg-brown-800 text-white hover:bg-brown-700">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
          <Link href="/shop" className="btn-outline flex items-center justify-center px-4 py-2 rounded-md border border-brown-700 text-brown-700 hover:bg-red-50">
            <ArrowLeft size={18} className="mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

