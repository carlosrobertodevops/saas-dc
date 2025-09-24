// app/api/create-order/route.ts

import { NextResponse } from "next/server";
import axios from "axios";

const PAYPAL_API_URL = "https://api-m.sandbox.paypal.com/v2/checkout/orders"; // Use live URL in production
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID; // Use on client-side
const PAYPAL_SECRET = process.env.PAYPAL_SECRET; // Use on server-side

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("PayPal Client ID:", PAYPAL_CLIENT_ID);
    console.log("PayPal Secret:", PAYPAL_SECRET);

    const response = await axios.post(
      PAYPAL_API_URL,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: body.value || "10.00", // Default to $10.00
            },
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`
          ).toString("base64")}`,
        },
      }
    );

    if (response.data && response.data.id) {
      return NextResponse.json({ id: response.data.id });
    } else {
      console.error("Invalid PayPal response:", response.data);
      return NextResponse.json(
        { error: "Failed to create order: Invalid response from PayPal." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}
