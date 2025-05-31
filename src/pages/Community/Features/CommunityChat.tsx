import { ArrowLeft, Send, User } from "lucide-react";
import { useState } from "react";

export default function CommunityChat({
  selectedCommunity,
  setSelectedCommunity,
  onClose,
}: any) {
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
          avatar: "S",
        },
        {
          id: 2,
          user: "Mike Davis",
          message: "Just finished my morning run. Feeling great!",
          time: "10:45 AM",
          avatar: "M",
        },
        {
          id: 3,
          user: "Lisa Chen",
          message: "Any tips for beginner strength training?",
          time: "11:00 AM",
          avatar: "L",
        },
      ],
    },
    {
      id: 2,
      name: "Healthy Cooking Club",
      description:
        "Share your favorite healthy recipes and cooking techniques with others.",
      bannerImage: "/api/placeholder/400/200",
      creatorName: "Mike Williams",
      creatorImage: "H",
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
          avatar: "M",
        },
        {
          id: 2,
          user: "Emma Watson",
          message: "Love this! Can you share the dressing recipe?",
          time: "9:30 AM",
          avatar: "E",
        },
      ],
    },
  ]);
  const [chatMessage, setChatMessage] = useState("");

  const sendMessage = () => {
    if (!chatMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      user: "You",
      message: chatMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      avatar: "U",
    };

    setCommunities(
      communities.map((c: any) =>
        c.id === selectedCommunity.id
          ? { ...c, messages: [...c.messages, newMessage] }
          : c
      )
    );

    setSelectedCommunity({
      ...selectedCommunity,
      messages: [...selectedCommunity.messages, newMessage],
    });

    setChatMessage("");
  };
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-foreground p-4 flex items-center">
        <button
          onClick={onClose}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex justify-center items-center text-foreground bg-gray-400 w-8 h-8 rounded-full mr-2 object-cover">
          {selectedCommunity.bannerImage}
        </div>
        <div>
          <h3 className="font-semibold">{selectedCommunity.name}</h3>
          <p className="text-sm text-gray-500">
            {selectedCommunity.memberCount} members
          </p>
        </div>
      </div>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedCommunity.messages.map((msg: any) => (
          <div key={msg.id} className="flex items-start space-x-3">
            <div className="flex justify-center items-center text-foreground bg-primary/30 w-8 h-8 rounded-full mr-2 object-cover">
              <User size={20} className="text-foreground" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{msg.user}</span>
                <span className="text-xs text-gray-500">{msg.time}</span>
              </div>
              <p className="text-sm mt-1">{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      ~{/* Message Input */}
      <div className="border-t border-foreground p-4">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-foreground rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
