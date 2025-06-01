//@ts-nocheck
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import {
  doc,
  updateDoc,
  arrayUnion,
  increment,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../../../components/firebase";
import { toast } from "react-toastify";

export default function PaymentModal({
  onClose,
  onPaymentSuccess,
  community, // This is the actual prop being passed
}: any) {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const user = auth.currentUser;

  console.log("Selected community in modal: ", community);
  console.log("USER LOGGED IN ID: ", user?.uid);

  const subscriptionPlans = [
    {
      id: "basic",
      name: "basic",
      // planCode: "PLN_gk69s1ojaccqmgf",
      price: 499900, // Price in kobo (₦4,999.00)
      priceDisplay: "₦4,999/month",
      features: [
        "Access to basic Community",
        "Chat with members",
        "Weekly health tips",
      ],
      color: "bg-blue-500",
    },
    {
      id: "premium",
      name: "Premium",
      // planCode: "PLN_b4citk4cd48m53p",
      price: 899900, // Price in kobo (₦8,999.00)
      priceDisplay: "₦8,999/month",
      features: [
        "All Basic features",
        "Access to premium Community",
        "1-on-1 expert consultations",
        "Personalized meal plans",
      ],
      color: "bg-purple-500",
      popular: true,
    },
    {
      id: "vip",
      name: "VIP",
      // planCode: "PLN_gk69s1ojaccqmgf", // Note: This is the same as basic - you might want to update this
      price: 1299900, // Price in kobo (₦12,999.00)
      priceDisplay: "₦12,999/month",
      features: [
        "All Premium features",
        "Priority support",
        "Exclusive VIP Community",
        "Monthly health assessments",
      ],
      color: "bg-yellow-500",
    },
  ];
  const addUserToCommunity = async (plan: any) => {
    // Add plan parameter
    const communityId =
      typeof community === "string" ? community : community?.id;
    const communityName =
      typeof community === "string" ? "Community" : community?.name;

    console.log("Community ID:", communityId);
    console.log("Community type:", typeof community);

    if (!user || !communityId) {
      throw new Error("User not authenticated or community not selected");
    }

    try {
      const communityRef = doc(db, "Communities", communityId);

      // Add user to members array and increment member count
      await updateDoc(communityRef, {
        members: arrayUnion(user.uid),
        memberCount: increment(1),
      });

      // Create/update user subscription record
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        [`subscriptions.${communityId}`]: {
          planType: plan.name.toLowerCase(), // Use the passed plan parameter
          joinedAt: new Date(),
          isActive: true,
          communityId: communityId,
          communityName: communityName,
        },
      });

      console.log("User successfully added to community!");
    } catch (error) {
      console.error("Error adding user to community:", error);
      throw error;
    }
  };
  const logTransaction = async (paymentResponse: any, plan: any) => {
    try {
      const communityId =
        typeof community === "string" ? community : community?.id;
      const communityName =
        typeof community === "string" ? "Community" : community?.name;

      const transactionRef = doc(db, "transactions", paymentResponse.reference);
      await setDoc(transactionRef, {
        userId: user?.uid,
        userEmail: user?.email,
        communityId: communityId,
        communityName: communityName,
        planType: plan.name,
        amount: plan.price,
        currency: "NGN",
        status: "success",
        reference: paymentResponse.reference,
        createdAt: new Date(),
        paystackResponse: paymentResponse,
      });
      console.log("Transaction logged successfully");
    } catch (error) {
      console.error("Error logging transaction:", error);
      // Don't throw error here as payment was successful
    }
  };
  const handlePaymentSuccess = async (response: any, plan: any) => {
    console.log("Payment successful!", response);
    setLoading(true);

    try {
      // Add user to community immediately after successful payment
      await addUserToCommunity(plan); // Pass the plan here

      // Log the transaction for your records
      await logTransaction(response, plan);

      // Call success callback
      if (onPaymentSuccess) {
        onPaymentSuccess(plan, response);
      }

      alert(
        `Payment successful! Welcome to ${
          typeof community === "string" ? "the community" : community?.name
        }!`
      );
      onClose();
    } catch (error) {
      console.error("Error processing payment:", error);
      onClose();
      toast.success(
        `Payment successful! Welcome to ${
          typeof community === "string" ? "the community" : community?.name
        }! Please reload your page`
      );
      // alert(
      //   "Payment was successful but there was an error adding you to the community. Please contact support."
      // );
    } finally {
      setLoading(false);
    }
  };
  const handlePaymentClose = () => {
    setLoading(false);
    console.log("Payment dialog closed.");
  };

  const initializePaystack = (plan: any) => {
    if (!user) {
      alert("Please log in to continue with payment");
      return;
    }

    if (!paystackLoaded) {
      alert("Payment system is still loading. Please try again in a moment.");
      return;
    }

    if (!(window as any).PaystackPop) {
      alert(
        "Payment system not available. Please refresh the page and try again."
      );
      return;
    }

    setSelectedPlan(plan);
    setLoading(true);

    try {
      // Initialize Paystack
      const handler = (window as any).PaystackPop.setup({
        key: "pk_test_0f1b9523732a874b048286317593cc6137e3383b", // Replace with your actual Paystack public key
        email: user.email,
        amount: plan.price, // Amount in kobo
        currency: "NGN",
        ref: `${Date.now()}_${user.uid}_${
          typeof community === "string" ? community : community?.id
        }`, // Unique reference
        metadata: {
          custom_fields: [
            {
              display_name: "Community",
              variable_name: "community_name",
              value:
                typeof community === "string"
                  ? "Community"
                  : community?.name || "Unknown Community",
            },
            {
              display_name: "Plan",
              variable_name: "plan_type",
              value: plan.name,
            },
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: user.uid,
            },
            {
              display_name: "Community ID",
              variable_name: "community_id",
              value:
                typeof community === "string" ? community : community?.id || "",
            },
          ],
        },
        callback: (response: any) => handlePaymentSuccess(response, plan),
        onClose: handlePaymentClose,
      });

      handler.openIframe();
    } catch (error) {
      console.error("Error initializing Paystack:", error);
      setLoading(false);
      alert("Error initializing payment. Please try again.");
    }
  };

  // Load Paystack inline script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;

    script.onload = () => {
      setPaystackLoaded(true);
      console.log("Paystack script loaded successfully");
    };

    script.onerror = () => {
      console.error("Failed to load Paystack script");
      alert(
        "Failed to load payment system. Please check your internet connection and refresh."
      );
    };

    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              {community && (
                <p className="text-sm text-gray-600 mt-1">
                  For:{" "}
                  <span className="font-semibold">
                    {typeof community === "string"
                      ? "Selected Community"
                      : community.name}
                  </span>
                </p>
              )}
            </div>
            <button
              className="cursor-pointer disabled:opacity-50"
              onClick={onClose}
              disabled={loading}
            >
              <X size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <p className="text-gray-600 mb-8 text-center">
            Join our premium Community and unlock exclusive health features
          </p>

          {!paystackLoaded && (
            <div className="text-center text-blue-600 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p>Loading payment system...</p>
            </div>
          )}

          {loading && (
            <div className="fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p>Processing payment...</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {subscriptionPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative border-2 rounded-lg p-6 ${
                  plan.popular
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="text-3xl font-bold mb-2">
                    {plan.priceDisplay}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => initializePaystack(plan)}
                  disabled={loading || !user || !paystackLoaded}
                  className={`w-full py-3 rounded-lg text-white font-medium ${plan.color} hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading
                    ? "Processing..."
                    : !paystackLoaded
                    ? "Loading..."
                    : `Choose ${plan.name}`}
                </button>
              </div>
            ))}
          </div>

          {!user && (
            <p className="text-center text-red-500 mt-4">
              Please log in to continue with payment
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
