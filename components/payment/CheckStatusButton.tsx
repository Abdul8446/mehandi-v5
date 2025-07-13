// components/payment/CheckStatusButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CheckStatusButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const checkStatus = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/check-status?merchantOrderId=${orderId}`);
      if (res.redirected) {
        router.push(res.url);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={checkStatus}
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out flex items-center justify-center"
    >
      {isLoading ? (
        <>
          <span className="animate-spin mr-2">&#8635;</span>
          Checking...
        </>
      ) : (
        'Check Payment Status Again'
      )}
    </button>
  );
}