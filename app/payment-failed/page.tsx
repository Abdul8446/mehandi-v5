// app/payment-failed/page.tsx
'use client';
import { XCircle, CreditCard, RefreshCw, ShoppingCart, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { errorMessages } from '@/lib/PaymentErrors';
import Button from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('errorCode') || 'default';
  const orderId = searchParams.get('orderId') || 'unknown';
  const errorDetails = errorCode 
    ? errorMessages[errorCode] || errorMessages.default
    : errorMessages.default;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-primary">
            YourStore
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Error Header */}
          <div className="bg-red-50 p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {errorDetails.title}
            </h1>
            <p className="text-gray-600">
              {errorDetails.description}
            </p>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5 text-gray-500" />
              Order Summary
            </h2>
            {orderId && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Order Number</p>
                    <p className="font-medium">{orderId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status</span>
                <span className="font-medium text-red-600">Failed</span>
              </div>
              {errorCode && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Error Code</span>
                  <span className="font-mono">{errorCode}</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 p-6 space-y-4">
            <Link 
              href={`/checkout?orderId=${orderId || ''}`} 
              className="block"
            >
              <Button className="w-full" size="lg">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Payment Again
              </Button>
            </Link>

            <Link href="/cart" className="block">
              <Button variant="outline" className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Return to Cart
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-gray-50 p-6 border-t border-gray-200">
            <h3 className="font-medium flex items-center mb-3">
              <HelpCircle className="mr-2 h-5 w-5 text-gray-500" />
              Need help with your payment?
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                Contact our customer support team for assistance.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} YourStore. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentFailedContent />
    </Suspense>
  );
}