// app/payment-error/page.tsx
'use client';
import { errorMessages } from "@/lib/PaymentErrors";
import { TriangleAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get('error') || 'default';
  const message = searchParams.get('message') || 'An unexpected error occurred';
  const orderId = searchParams.get('orderId') || 'unknown';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <TriangleAlert className="h-6 w-6 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {errorType}
        </h1>
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        <div className="space-y-3">
          <a
            href="/checkout"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
          >
            Try Payment Again
          </a>
          
          <a
            href="/"
            className="block w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md border border-gray-300 transition duration-150 ease-in-out"
          >
            Return to Home
          </a>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Need help with your payment?
            </h3>
            <a 
              href="/contact" 
              className="text-sm text-blue-600 hover:underline inline-flex items-center"
            >
              Contact our support team
              <ArrowRightIcon className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentErrorContent />
    </Suspense>
  );
}

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  );
}