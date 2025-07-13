// lib/paymentErrors.ts
export const errorMessages: Record<string, { title: string; description: string }> = {
  missing_order_id: {
    title: "Order Missing",
    description: "We couldn't find your order details. Please try again or contact support."
  },
  server_error: {
    title: "Technical Difficulty",
    description: "We're experiencing technical issues. Please try again later."
  },
  payment_failed: {
    title: "Payment Failed",
    description: "Your payment was not successful. Please try again with a different payment method."
  },
  card_not_supported: {
    title: "Card Not Supported",
    description: "The card you used is not supported. Please try a different payment method."
  },
  default: {
    title: "Something Went Wrong",
    description: "We couldn't process your payment. Please try again."
  }
};