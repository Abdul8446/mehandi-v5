'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const PaymentProcessing = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Prevent back navigation
    const handleBackButton = (e: PopStateEvent) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.pathname);
      // Show message to user
      alert('Payment is processing. Please do not navigate away. Refresh the page if payment is taking too long.');
    };

    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600 mb-4">
            Your payment is being processed. Please do not navigate away or close this page.
          </p>
          <p className="text-gray-600 mb-6">
            If the payment is taking too long, you can refresh the page to check the status.
          </p>
          <button
            onClick={handleRefresh}
            className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-800 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcessing;