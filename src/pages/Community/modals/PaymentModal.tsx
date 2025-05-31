import { X } from "lucide-react";
// import { useState } from "react";

export default function PaymentModal({ onClose }: any) {
  const subscriptionPlans = [
    {
      name: "Basic",
      price: "$9.99/month",
      features: [
        "Access to basic communities",
        "Chat with members",
        "Weekly health tips",
      ],
      color: "bg-blue-500",
    },
    {
      name: "Premium",
      price: "$19.99/month",
      features: [
        "All Basic features",
        "Access to premium communities",
        "1-on-1 expert consultations",
        "Personalized meal plans",
      ],
      color: "bg-purple-500",
      popular: true,
    },
    {
      name: "VIP",
      price: "$39.99/month",
      features: [
        "All Premium features",
        "Priority support",
        "Exclusive VIP communities",
        "Monthly health assessments",
      ],
      color: "bg-gold-500",
    },
  ];
  //   const [user, setUser] = useState({
  //     hasPaidSubscription: false, // Change this to true to test paid user experience
  //     subscriptionType: "", // 'basic', 'premium', 'vip'
  //   });
  return (
    <div className="fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Choose Your Plan</h2>
            <button className="cursor-pointer" onClick={onClose}>
              <X size={24} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>

          <p className="text-gray-600 mb-8 text-center">
            Join our premium communities and unlock exclusive health features
          </p>

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
                  <div className="text-3xl font-bold mb-2">{plan.price}</div>
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
                  onClick={onClose}
                  //   onClick={() => {
                  //     setUser({
                  //       hasPaidSubscription: true,
                  //       subscriptionType: plan.name.toLowerCase(),
                  //     });
                  //     setShowPaymentModal(false);
                  //   }}
                  className={`w-full py-3 rounded-lg text-white font-medium ${plan.color} hover:opacity-90 transition-opacity`}
                >
                  Choose {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
