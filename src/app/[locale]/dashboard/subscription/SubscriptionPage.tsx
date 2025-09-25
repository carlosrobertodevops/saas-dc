import { useAppContext } from "@/src/app/AppContext";
import PayPalWrapper from "@/src/app/PayPalWrapper";
import React, { useEffect, useState } from "react";
import { IoCheckmarkCircle, IoClose } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
interface PlanProps {
  title: string;
  price: string;
  features: string[];
  buttonLabel: string;
  isPro: boolean;
}

function PlanCard({ title, price, features, buttonLabel, isPro }: PlanProps) {
  const {
    isDarkModeObject: { isDarkMode },
  } = useAppContext();

  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const {
    fakeUser,
    setFakeUser,
    mainMenuItemsObject: { setMainMenuItems },
    openPaymentWindowObject: { setOpenPaymentWindow },
  } = useAppContext();
  const [{ isResolved }] = usePayPalScriptReducer();

  useEffect(() => {
    console.log("PayPal Script Status:", {
      isResolved,
    });
  }, [isResolved]);

  const createOrder = async () => {
    try {
      const response = await fetch("/api/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: "9.99" }), // Set the amount dynamically
      });

      // Check if response is OK and has a JSON body
      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Network response was not ok");
      }

      const order = await response.json();
      console.log("Order created:", order);
      return order.id;
    } catch (error) {
      console.error("Error creating order:", error);
      setError("Failed to create order. Please try again.");
      throw error;
    }
  };

  const onApprove = async () => {
    try {
      // 1 - update the fake user state
      setFakeUser((prevUser) => ({ ...prevUser, isPro: true }));

      // 2 - update the isPro property in the database
      const response = await fetch("/api/users", {
        // Adjust the URL path as needed
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: fakeUser.userId, // Assuming fakeUser has clerkUserId
          isPro: true,
          accumulatedWords: fakeUser.cumulativeWords, // Pass the current accumulated words
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user status");
      }

      const result = await response.json();
      console.log("User updated successfully:", result);

      // 3 - open the payment window
      setOpenPaymentWindow(true);
    } catch (error) {
      console.error("Error updating user:", error);
      // You might want to add error handling here, such as:
      // - Reverting the fake user state
      // - Showing an error message to the user
      // - Not opening the payment window
    }
  };

  console.log(fakeUser);

  return (
    <div
      className={` rounded-lg shadow-lg 
        ${
          isDarkMode ? "bg-slate-800" : "border-slate-100 border bg-white"
        }  px-10 flex flex-col gap-3 relative  mt-6  pt-6 pb-10   w-[351px]`}
    >
      {/* plan and price */}
      <div className="mt-5">
        <h3 className="text-xl  text-center">{title}</h3>
        <div className="text-[32px] font-semibold text-center mb-8">
          {price}
        </div>
      </div>

      {/* Features */}
      <ul className={`mb-6 flex gap-3 flex-col `}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <IoCheckmarkCircle className="text-purple-600" />
            <span
              className={`${isDarkMode ? "text-slate-300" : "text-slate-700"}`}
            >
              {feature}
            </span>
          </li>
        ))}
      </ul>
      {isPro && !isButtonClicked && (
        <button
          onClick={() => setIsButtonClicked(true)}
          className={`w-full py-2 px-4 rounded text-white ${
            isPro ? "bg-purple-600" : "bg-gray-500"
          } hover:opacity-90 transition duration-300`}
        >
          {buttonLabel}
        </button>
      )}

      {isResolved && isButtonClicked && (
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          style={{ layout: "vertical" }}
        />
      )}
    </div>
  );
}

function SubscriptionPlans() {
  const {
    isDarkModeObject: { isDarkMode },
    mainMenuItemsObject: { setMainMenuItems },
  } = useAppContext();

  function goToTheProPlanPage() {
    setMainMenuItems((prevItems) =>
      prevItems.map((singleItem) => ({
        ...singleItem,
        isSelected: singleItem.label === "Dashboard" ? true : false,
      }))
    );
  }

  return (
    <div
      className={`flex flex-col gap-6 items-center max-md:px-24 px-48 py-16 max-md:py-11   
    p-8 relative   w-full ${
      isDarkMode ? "bg-slate-700 text-white" : "bg-slate-50"
    }`}
    >
      <IoClose
        onClick={goToTheProPlanPage}
        className="absolute right-9 top-9 text-[24px] text-slate-600 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-7">
        <h3 className="text-3xl font-bold">Upgrade Your Plan</h3>
        <p
          className={`text-[13px] mt-1 leading-[22px] text-center text-slate-600 px-32 max-md:px-0 ${
            isDarkMode ? "text-slate-300" : "text-slate-700"
          } `}
        >
          Generate high-quality content effortlessly with 14 AI-powered
          templates. From blog posts to product descriptions, streamline your
          content creation process and focus on what matters.
        </p>
      </div>

      <div className="flex gap-4 max-md:flex-col flex-row">
        <PayPalWrapper>
          <PlanCard
            title="Pro Plan"
            price="$9,99"
            features={[
              "Unlimited Access to All 14 Templates",
              "Generate up to 100,000 words per month.",
              "Priority Customer Support",
              "Custom Content Tone",
              "Priority Customer Support",
            ]}
            buttonLabel="Get Started"
            isPro={true}
          />
        </PayPalWrapper>
      </div>
    </div>
  );
}

export default SubscriptionPlans;
