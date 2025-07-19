// app/payment-verification/page.tsx
'use client'
import { Suspense, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function PaymentVerificationContent() {
  const searchParams = useSearchParams()
  const merchantOrderId = searchParams.get('merchantOrderId')

  useEffect(() => {
    if (!merchantOrderId) return

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/payment/check-status?merchantOrderId=${merchantOrderId}`)
        const data = await response.json()
        
        if (data.redirectUrl) {
          // Perform client-side navigation
          window.location.href = data.redirectUrl
        }
      } catch (error) {
        console.error('Payment verification error:', error)
        window.location.href = `/payment-error?orderId=${merchantOrderId}&error=fetch_failed`
      }
    }

    checkPaymentStatus()
  }, [merchantOrderId])

  return (
    <div className="min-h-screen bg-gradient-to-b from-brown-50 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-24 h-24 flex items-center justify-center mb-8">
          <Loader2 className="animate-spin text-brown-600 w-16 h-16" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Verifying Payment...
        </h1>
        
        <p className="text-gray-600 mb-2">
          Please wait while we confirm your payment details
        </p>
        
        <p className="text-sm text-gray-500 mt-4">
          Order Reference: {merchantOrderId || 'N/A'}
        </p>
      </div>
    </div>
  )
}


export default function PaymentVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentVerificationContent />
    </Suspense>
  );
}