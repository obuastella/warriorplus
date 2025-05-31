//@ts-nocheck
import { useState } from "react";
import {
  Users,
  Calendar,
  CreditCard,
  Crown,
  MessageCircle,
} from "lucide-react";
import PaymentModal from "../modals/PaymentModal";
import CommunityChat from "./CommunityChat";

export default function CommunitySystem() {
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "Fitness Warriors",
      description:
        "A community for fitness enthusiasts sharing workout tips and motivation.",
      bannerImage: "F",
      creatorName: "Sarah Johnson",
      creatorImage: "S",
      memberCount: 345,
      createdDate: "March 12, 2025",
      joined: false,
      requiresPayment: true,
      subscriptionTier: "basic",
      messages: [
        {
          id: 1,
          user: "Sarah Johnson",
          message: "Welcome everyone! Let's start strong today! 💪",
          time: "10:30 AM",
          avatar: "/api/placeholder/32/32",
        },
        {
          id: 2,
          user: "Mike Davis",
          message: "Just finished my morning run. Feeling great!",
          time: "10:45 AM",
          avatar: "/api/placeholder/32/32",
        },
        {
          id: 3,
          user: "Lisa Chen",
          message: "Any tips for beginner strength training?",
          time: "11:00 AM",
          avatar: "/api/placeholder/32/32",
        },
      ],
    },
    {
      id: 2,
      name: "Healthy Cooking Club",
      description:
        "Share your favorite healthy recipes and cooking techniques with others.",
      bannerImage: "H",
      creatorName: "Mike Williams",
      creatorImage: "M",
      memberCount: 187,
      createdDate: "January 05, 2025",

      joined: true,
      requiresPayment: true,
      subscriptionTier: "premium",
      messages: [
        {
          id: 1,
          user: "Mike Williams",
          message: "Today's recipe: Quinoa Buddha Bowl! 🥗",
          time: "9:15 AM",
          avatar: "/api/placeholder/32/32",
        },
        {
          id: 2,
          user: "Emma Watson",
          message: "Love this! Can you share the dressing recipe?",
          time: "9:30 AM",
          avatar: "/api/placeholder/32/32",
        },
      ],
    },
  ]);
  const [user, setUser] = useState({
    hasPaidSubscription: true, // Change this to true to test paid user experience
    subscriptionType: null, // 'basic', 'premium', 'vip'
  });

  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showPaymentModal, setshowPaymentModal] = useState(false);

  const toggleJoin = (communityId: any) => {
    const community: any = communities.find((c: any) => c.id === communityId);

    if (community.requiresPayment && !user.hasPaidSubscription) {
      setshowPaymentModal(true);
      return;
    }

    setCommunities(
      communities.map((c) =>
        c.id === communityId ? { ...c, joined: !c.joined } : c
      )
    );
  };
  const handleClosePaymentModal = () => {
    setshowPaymentModal(false);
  };

  const openCommunityChat = (community: any) => {
    if (!community.joined) {
      toggleJoin(community.id);
      return;
    }
    setSelectedCommunity(community);
    setShowCommunityChat(true);
  };
  const closeCommunityChat = () => {
    setShowCommunityChat(false);
  };
  return (
    <div className="mt-8 mb-20 md:mb-0">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Communities</h2>
        {user.hasPaidSubscription && (
          <div className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm">
            <Crown size={16} className="mr-2" />
            Premium Member
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Banner Image --might remove this to save our resources */}
            {/* <div className="relative h-40 w-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={community.bannerImage}
                alt={`${community.name} banner`}
              />

             
              <div className="absolute top-3 right-3 flex space-x-2">
                {community.requiresPayment && (
                  <div className="bg-yellow-500 text-white p-1.5 rounded-full">
                    <CreditCard size={16} />
                  </div>
                )}
              </div>
            </div> */}

            <div className="p-4">
              {/* Community Name */}
              <h3 className="font-bold text-lg">{community.name}</h3>

              {/* Payment Badge */}
              {community.requiresPayment && (
                <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs mt-2">
                  <Crown size={12} className="mr-1" />
                  Premium Community
                </div>
              )}

              {/* Community Description */}
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {community.description}
              </p>

              {/* Creator Info */}
              <div className="flex items-center mt-4">
                <div className="flex justify-center items-center text-foreground bg-gray-400 w-8 h-8 rounded-full mr-2 object-cover">
                  {community.creatorImage}
                </div>
                <div>
                  <p className="text-xs text-gray-500">Created by</p>
                  <p className="text-sm font-medium">{community.creatorName}</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center justify-between mt-4 text-gray-500 text-xs">
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  <span>{community.memberCount} members</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  <span>Created {community.createdDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  // onClick={() => toggleJoin(community.id)}
                  className={`cursor-pointer flex-1 py-2 px-4 rounded-md flex items-center justify-center ${
                    community.requiresPayment && !user.hasPaidSubscription
                      ? "bg-yellow-500 text-white hover:bg-yellow-600"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                >
                  {community.requiresPayment && !user.hasPaidSubscription ? (
                    <span
                      onClick={() => toggleJoin(community.id)}
                      className="w-full flex items-center justify-center"
                    >
                      <CreditCard size={16} className="mr-2" />
                      Upgrade to Join
                    </span>
                  ) : (
                    <span
                      className="w-full flex items-center justify-center"
                      onClick={() => openCommunityChat(community)}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Chat
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showPaymentModal && <PaymentModal onClose={handleClosePaymentModal} />}
      {showCommunityChat && selectedCommunity && (
        <CommunityChat
          selectedCommunity={selectedCommunity}
          setSelectedCommunity={setSelectedCommunity}
          onClose={closeCommunityChat}
        />
      )}
    </div>
  );
}
