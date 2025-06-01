//@ts-nocheck
import { useEffect, useState } from "react";
import {
  Users,
  Calendar,
  CreditCard,
  Crown,
  MessageCircle,
} from "lucide-react";
import PaymentModal from "../modals/PaymentModal";
import CommunityChat from "./CommunityChat";
import useCommunitiesStore from "../../../store/useCommunitiesStore";
import { auth } from "../../../components/firebase";
import { toast } from "react-toastify";

// export default function CommunitySystem() {
//   const user = auth.currentUser;
//   const {
//     communities,
//     loading,
//     fetchCommunities,
//     checkAllMemberships,
//     joinCommunity,
//     leaveCommunity,
//   } = useCommunitiesStore();

//   const [showCommunityChat, setShowCommunityChat] = useState(false);
//   const [showLeaveModal, setShowLeaveModal] = useState(false);
//   const [selectedCommunity, setSelectedCommunity] = useState(null);
//   const [showPaymentModal, setShowPaymentModal] = useState(false);
//   const [selectedCommunityId, setSelectedCommunityId] = useState(null);

//   const [selectedCommunityForPayment, setSelectedCommunityForPayment] =
//     useState(null);

//   useEffect(() => {
//     const loadCommunities = async () => {
//       await fetchCommunities();
//     };

//     loadCommunities();
//   }, [fetchCommunities]);

//   useEffect(() => {
//     // Check membership status for all communities when user and communities are loaded
//     if (user && communities.length > 0) {
//       checkAllMemberships(user.uid);
//     }
//   }, [user, communities.length, checkAllMemberships]);

//   // Check if user is a member of a specific community
//   const isUserMember = (community) => {
//     if (!user) return false;
//     return community.members?.includes(user.uid) || false;
//   };

//   // Handle leaving a community

//   const handleLeaveClick = (communityId: string) => {
//     setSelectedCommunityId(communityId);
//     setShowLeaveModal(true);
//   };

//   const confirmLeaveCommunity = async () => {
//     if (!user || !selectedCommunityId) return;

//     try {
//       await leaveCommunity(selectedCommunityId, user.uid);
//       console.log("Successfully left community!");
//       toast.success("You have left the community, please reload your page!");
//     } catch (error) {
//       console.error("Failed to leave community:", error);
//     } finally {
//       setShowLeaveModal(false);
//       setSelectedCommunityId(null);
//     }
//   };
//   // Handle upgrade/payment for premium communities
//   const handleUpgradeClick = (community: any) => {
//     setSelectedCommunityForPayment(community);
//     setShowPaymentModal(true);
//     console.log("Community clicked: ", community.id);
//     // setSelectedCommunity(community);

//     // setSelectedCommunity(community);
//   };

//   // Handle successful payment
//   const handlePaymentSuccess = async () => {
//     if (selectedCommunityForPayment && user) {
//       try {
//         await joinCommunity(selectedCommunityForPayment.id, user.uid);
//         console.log("Successfully joined premium community!");
//         setShowPaymentModal(false);
//         setSelectedCommunityForPayment(null);
//       } catch (error) {
//         console.error("Failed to join community after payment:", error);
//       }
//     }
//   };

//   const handleClosePaymentModal = () => {
//     setShowPaymentModal(false);
//     setSelectedCommunityForPayment(null);
//   };

//   const openCommunityChat = (community: any) => {
//     // console.log("Selected community: ", community);

//     // Check if user is a member before opening chat
//     if (!isUserMember(community)) {
//       console.log("You must be a member to access this community chat");
//       return;
//     }

//     setSelectedCommunity(community);
//     setShowCommunityChat(true);
//   };

//   const closeCommunityChat = () => {
//     setShowCommunityChat(false);
//     setSelectedCommunity(null);
//   };

//   // Determine button text and action for each community
//   const getCommunityButtonConfig = (community: any) => {
//     const isMember = isUserMember(community);

//     if (isMember) {
//       return {
//         text: "Chat",
//         icon: MessageCircle,
//         className: "bg-green-500 text-white hover:bg-green-600",
//         onClick: () => openCommunityChat(community),
//       };
//     }

//     // if (community.requiresPayment) {
//     //   return {
//     //     text: "Upgrade to Join",
//     //     icon: CreditCard,
//     //     className: "bg-yellow-500 text-white hover:bg-yellow-600",
//     //     onClick: () => handleUpgradeClick(community),
//     //   };
//     // }

//     return {
//       text: "Upgrade to Join",
//       icon: CreditCard,
//       className: "bg-yellow-500 text-white hover:bg-yellow-600",
//       onClick: () => handleUpgradeClick(community.id),
//     };
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8 mb-20 md:mb-0">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-bold">Communities</h2>
//         {user && (
//           <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm">
//             <Users size={16} className="mr-2" />
//             {communities.filter((c: any) => isUserMember(c)).length} Joined
//           </div>
//         )}
//       </div>
//       {/* Display list of communities */}
//       <div className=" h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {communities.map((community: any) => {
//           const isMember = isUserMember(community);
//           const buttonConfig = getCommunityButtonConfig(community);
//           const ButtonIcon = buttonConfig.icon;

//           return (
//             <div
//               key={community.id}
//               className={`flex flex-col h-[300px] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
//                 isMember ? "border-green-200 bg-green-50" : "border-gray-200"
//               }`}
//             >
//               <div className="p-4 flex flex-col flex-1">
//                 {isMember && (
//                   <div className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mb-2">
//                     <Users size={12} className="mr-1" />
//                     Member
//                   </div>
//                 )}

//                 {/* FLEXIBLE SECTION */}
//                 <div className="flex-1">
//                   <h3 className="font-bold text-lg">{community.name}</h3>

//                   {community.requiresPayment && (
//                     <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs mt-2">
//                       <Crown size={12} className="mr-1" />
//                       Premium Community
//                     </div>
//                   )}

//                   <p className="text-gray-600 text-sm mt-2 line-clamp-2">
//                     {community.description || " "}
//                   </p>
//                 </div>

//                 {/* FIXED BOTTOM SECTION */}
//                 <div className="flex items-center mt-4">
//                   <div className="flex justify-center items-center text-foreground bg-gray-400 w-8 h-8 rounded-full mr-2 object-cover">
//                     {community.creatorImage}
//                   </div>
//                   <div>
//                     <p className="text-xs text-gray-500">Created by</p>
//                     <p className="text-sm font-medium">
//                       {community.creatorName}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between mt-4 text-gray-500 text-xs">
//                   <div className="flex items-center">
//                     <Users size={14} className="mr-1" />
//                     <span>{community.memberCount} members</span>
//                   </div>
//                   <div className="flex items-center">
//                     <Calendar size={14} className="mr-1" />
//                     <span>Created {community.createdDate}</span>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex space-x-2 pt-2">
//                   <button
//                     onClick={buttonConfig.onClick}
//                     className={`cursor-pointer flex-1 py-2 px-4 rounded-md flex items-center justify-center transition-colors ${buttonConfig.className}`}
//                   >
//                     <ButtonIcon size={16} className="mr-2" />
//                     {buttonConfig.text}
//                   </button>

//                   {isMember && (
//                     <button
//                       onClick={() => handleLeaveClick(community.id)}
//                       className="py-2 px-3 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
//                       title="Leave Community"
//                     >
//                       Leave
//                     </button>
//                   )}
//                   {showLeaveModal && (
//                     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//                       <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
//                         <h2 className="text-lg font-semibold mb-4">
//                           Leave Community
//                         </h2>
//                         <p className="mb-6">
//                           Are you sure you want to leave this community?
//                         </p>
//                         <div className="flex justify-end gap-4">
//                           <button
//                             onClick={() => setShowLeaveModal(false)}
//                             className="px-4 py-2 border rounded-md"
//                           >
//                             No
//                           </button>
//                           <button
//                             onClick={confirmLeaveCommunity}
//                             className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
//                           >
//                             Yes, Leave
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* Empty State */}
//       {communities.length === 0 && !loading && (
//         <div className="text-center py-12">
//           <Users size={48} className="mx-auto text-gray-400 mb-4" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">
//             No communities found
//           </h3>
//           <p className="text-gray-500">
//             Communities will appear here once they're created.
//           </p>
//         </div>
//       )}

//       {/* Modals */}
//       {showPaymentModal && selectedCommunityForPayment && (
//         <PaymentModal
//           community={selectedCommunityForPayment}
//           selectedCommunity={selectedCommunityForPayment} // Add this line
//           onClose={handleClosePaymentModal}
//           onPaymentSuccess={handlePaymentSuccess}
//         />
//       )}

//       {showCommunityChat && selectedCommunity && (
//         <CommunityChat
//           selectedCommunity={selectedCommunity}
//           setSelectedCommunity={setSelectedCommunity}
//           onClose={closeCommunityChat}
//         />
//       )}
//     </div>
//   );
// }
export default function CommunitySystem() {
  const user = auth.currentUser;
  const {
    communities,
    loading,
    fetchCommunities,
    checkAllMemberships,
    joinCommunity,
    leaveCommunity,
  } = useCommunitiesStore();

  // Existing state
  const [showCommunityChat, setShowCommunityChat] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCommunityId, setSelectedCommunityId] = useState(null);
  const [selectedCommunityForPayment, setSelectedCommunityForPayment] =
    useState(null);

  // Add search state
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCommunities = async () => {
      await fetchCommunities();
    };
    loadCommunities();
  }, [fetchCommunities]);

  useEffect(() => {
    if (user && communities.length > 0) {
      checkAllMemberships(user.uid);
    }
  }, [user, communities.length, checkAllMemberships]);

  // Filter communities based on search query
  const filteredCommunities = communities.filter((community) => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      community.name?.toLowerCase().includes(query) ||
      community.description?.toLowerCase().includes(query) ||
      community.creatorName?.toLowerCase().includes(query)
    );
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Clear search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Check if user is a member of a specific community
  const isUserMember = (community) => {
    if (!user) return false;
    return community.members?.includes(user.uid) || false;
  };

  // Handle leaving a community
  const handleLeaveClick = (communityId) => {
    setSelectedCommunityId(communityId);
    setShowLeaveModal(true);
  };

  const confirmLeaveCommunity = async () => {
    if (!user || !selectedCommunityId) return;

    try {
      await leaveCommunity(selectedCommunityId, user.uid);
      console.log("Successfully left community!");
      toast.success("You have left the community, please reload your page!");
    } catch (error) {
      console.error("Failed to leave community:", error);
    } finally {
      setShowLeaveModal(false);
      setSelectedCommunityId(null);
    }
  };

  // Handle upgrade/payment for premium communities
  const handleUpgradeClick = (community) => {
    setSelectedCommunityForPayment(community);
    setShowPaymentModal(true);
    console.log("Community clicked: ", community.id);
  };

  // Handle successful payment
  const handlePaymentSuccess = async () => {
    if (selectedCommunityForPayment && user) {
      try {
        await joinCommunity(selectedCommunityForPayment.id, user.uid);
        console.log("Successfully joined premium community!");
        setShowPaymentModal(false);
        setSelectedCommunityForPayment(null);
      } catch (error) {
        console.error("Failed to join community after payment:", error);
      }
    }
  };

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
    setSelectedCommunityForPayment(null);
  };

  const openCommunityChat = (community) => {
    if (!isUserMember(community)) {
      console.log("You must be a member to access this community chat");
      return;
    }
    setSelectedCommunity(community);
    setShowCommunityChat(true);
  };

  const closeCommunityChat = () => {
    setShowCommunityChat(false);
    setSelectedCommunity(null);
  };

  // Determine button text and action for each community
  const getCommunityButtonConfig = (community) => {
    const isMember = isUserMember(community);

    if (isMember) {
      return {
        text: "Chat",
        icon: MessageCircle,
        className: "bg-green-500 text-white hover:bg-green-600",
        onClick: () => openCommunityChat(community),
      };
    }

    return {
      text: "Upgrade to Join",
      icon: CreditCard,
      className: "bg-yellow-500 text-white hover:bg-yellow-600",
      onClick: () => handleUpgradeClick(community),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-20 md:mb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Communities</h2>

        {/* Search Form */}
        <div className="w-full md:w-96">
          <label
            htmlFor="community-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only"
          >
            Search Communities
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="community-search"
              value={searchQuery}
              onChange={handleSearchChange}
              className="block w-full p-2.5 ps-10 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search communities..."
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {user && (
          <div className="flex items-center bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm">
            <Users size={16} className="mr-2" />
            {communities.filter((c) => isUserMember(c)).length} Joined
          </div>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="mb-4 text-sm text-gray-600">
          {filteredCommunities.length}{" "}
          {filteredCommunities.length === 1 ? "community" : "communities"} found
          for "{searchQuery}"
        </div>
      )}

      {/* Display list of filtered communities */}
      <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => {
          const isMember = isUserMember(community);
          const buttonConfig = getCommunityButtonConfig(community);
          const ButtonIcon = buttonConfig.icon;

          return (
            <div
              key={community.id}
              className={`flex flex-col h-[300px] rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${
                isMember ? "border-green-200 bg-green-50" : "border-gray-200"
              }`}
            >
              <div className="p-4 flex flex-col flex-1">
                {isMember && (
                  <div className="inline-flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs mb-2">
                    <Users size={12} className="mr-1" />
                    Member
                  </div>
                )}

                {/* FLEXIBLE SECTION */}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{community.name}</h3>

                  {community.requiresPayment && (
                    <div className="inline-flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs mt-2">
                      <Crown size={12} className="mr-1" />
                      Premium Community
                    </div>
                  )}

                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {community.description || " "}
                  </p>
                </div>

                {/* FIXED BOTTOM SECTION */}
                <div className="flex items-center mt-4">
                  <div className="flex justify-center items-center text-foreground bg-gray-400 w-8 h-8 rounded-full mr-2 object-cover">
                    {community.creatorImage}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Created by</p>
                    <p className="text-sm font-medium">
                      {community.creatorName}
                    </p>
                  </div>
                </div>

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

                <div className="mt-4 flex space-x-2 pt-2">
                  <button
                    onClick={buttonConfig.onClick}
                    className={`cursor-pointer flex-1 py-2 px-4 rounded-md flex items-center justify-center transition-colors ${buttonConfig.className}`}
                  >
                    <ButtonIcon size={16} className="mr-2" />
                    {buttonConfig.text}
                  </button>

                  {isMember && (
                    <button
                      onClick={() => handleLeaveClick(community.id)}
                      className="py-2 px-3 rounded-md border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                      title="Leave Community"
                    >
                      Leave
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State for Search Results */}
      {searchQuery && filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No communities found
          </h3>
          <p className="text-gray-500">
            No communities match your search for "{searchQuery}". Try a
            different search term.
          </p>
          <button
            onClick={clearSearch}
            className="mt-4 text-blue-500 hover:text-blue-600 text-sm"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Empty State for No Communities */}
      {!searchQuery && communities.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No communities found
          </h3>
          <p className="text-gray-500">
            Communities will appear here once they're created.
          </p>
        </div>
      )}

      {/* Leave Community Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Leave Community</h2>
            <p className="mb-6">
              Are you sure you want to leave this community? If you leave you
              would have to pay to join.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLeaveModal(false)}
                className="px-4 py-2 border rounded-md"
              >
                No
              </button>
              <button
                onClick={confirmLeaveCommunity}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showPaymentModal && selectedCommunityForPayment && (
        <PaymentModal
          community={selectedCommunityForPayment}
          selectedCommunity={selectedCommunityForPayment}
          onClose={handleClosePaymentModal}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

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
