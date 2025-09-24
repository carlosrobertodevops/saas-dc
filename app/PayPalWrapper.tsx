import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useEffect } from "react";

interface PayPalWrapperProps {
  children: React.ReactNode;
}

export default function PayPalWrapper({ children }: PayPalWrapperProps) {
  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  console.log(paypalClientId);

  useEffect(() => {
    console.log("PayPal Client ID:", paypalClientId);
  }, [paypalClientId]);

  if (!paypalClientId) {
    return <div>Error: PayPal is not configured correctly.</div>;
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalClientId,
        currency: "USD",

        debug: true,
      }}
    >
      {children}
    </PayPalScriptProvider>
  );
}
