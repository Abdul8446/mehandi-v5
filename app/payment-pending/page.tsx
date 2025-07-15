// app/payment-pending/page.tsx

'use client';
import { Suspense, use } from 'react';
import { CheckStatusButton } from '../../components/payment/CheckStatusButton';
import { useSearchParams } from 'next/navigation';

function PaymentPendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'unknown';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="animate-pulse mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <ClockIcon className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Payment Processing
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment for order #{orderId} is being processed. 
          This may take a few moments.
        </p>

        <div className="space-y-4">
          <CheckStatusButton orderId={orderId} />
          
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Need help?   
            </h3>
            <div className="flex justify-center space-x-4">
              <a href="/contact" className="text-sm text-blue-600 hover:underline">
                Contact Support
              </a>
              <a href="/orders" className="text-sm text-blue-600 hover:underline">
                View My Orders
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function PaymentPendingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPendingContent />
    </Suspense>
  );
}  

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}