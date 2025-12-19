export interface PaymentData {
  orderId?: string; // Optional, can be generated if not provided
  amount: number;
  full_name?: string;
  email?: string;
  phone?: string;
  pincode?: string;
  // Add any other fields you need
}

export interface PaymentResponse {
  success: boolean;
  data?: {
    orderId: string;
    state: string;
    expireAt: number;
    redirectUrl: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface CreateOrderRequest {
  amount: number;
  orderId: string; // Optional, can be generated if not provided
  userId?: string;
  mobileNumber?: string;
}

export interface CreateOrderResponse {
  data: {
    success: boolean;
    orderId: string; // Optional, can be generated if not provided
    redirectUrl?: string; // URL to redirect the user for payment
    callbackUrl?: string; // Optional, for webhook or callback URL
    checkStatusUrl?: string; // Optional, URL to check payment status
  }
}

export interface ErrorResponse {
  error: string;
}