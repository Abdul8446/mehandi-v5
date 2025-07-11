import { NextResponse } from "next/server";
import { getClient, randomUUID } from "@/lib/pg-client";
import { StandardCheckoutPayRequest } from "pg-sdk-node";
import { CreateOrderRequest, CreateOrderResponse, ErrorResponse } from "@/types/payment";

export async function POST(request: Request) {
  try {
    const { amount, orderId } = (await request.json()) as CreateOrderRequest;

    if (!amount) {
      return NextResponse.json<ErrorResponse>(
        { error: "Amount is required" },
        { status: 400 }
      );
    }

    const client = getClient();
    const merchantOrderId = orderId;
    const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/check-status?merchantOrderId=${merchantOrderId}`;

    const requestBody = StandardCheckoutPayRequest.builder()
      .merchantOrderId(merchantOrderId)
      .amount(amount*100) // Convert to paise
      .redirectUrl(redirectUrl)
      .build();

    console.log("Initiating payment with request body:", requestBody);  

    const response = await client.pay(requestBody);

    console.log("Payment initiation response:", response);

    return NextResponse.json<CreateOrderResponse>({
      data: {
          success: true,
          orderId: response.orderId,
          redirectUrl: response.redirectUrl,
          callbackUrl: redirectUrl,
          checkStatusUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/check-status?merchantOrderId=${merchantOrderId}`,
      },
    });
  } catch (error: any) {
    console.error("Error creating order:", error?.message || error);
    return NextResponse.json<ErrorResponse>(
      { error: error?.message || error || "Failed to create order" },
      { status: 500 }
    );
  }
}