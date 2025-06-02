import { ArrowLeft, Send, User } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../../../components/firebase";
import { useUserStore } from "../../../store/userStore";

export default function CommunityChat({
  selectedCommunity,

  onClose,
}: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [chatMessage, setChatMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const user: any = auth.currentUser;
  const { firstName } = useUserStore();

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Set up real-time listener for messages
  useEffect(() => {
    if (!selectedCommunity?.id) return;

    const messagesRef = collection(
      db,
      "Communities",
      selectedCommunity.id,
      "messages"
    );
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date(),
        }));

        setMessages(messagesData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [selectedCommunity?.id]);

  const sendMessage = async () => {
    if (!chatMessage.trim() || !user || !selectedCommunity?.id) return;

    try {
      const messagesRef = collection(
        db,
        "Communities",
        selectedCommunity.id,
        "messages"
      );

      await addDoc(messagesRef, {
        text: chatMessage,
        userId: user.uid,
        userName: firstName || "Anonymous",
        userAvatar: user.photoURL || null,
        timestamp: serverTimestamp(),
        communityId: selectedCommunity.id,
      });

      setChatMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="text-center">
          <p>Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Chat Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center">
        <button
          onClick={onClose}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex justify-center items-center text-white bg-blue-500 w-10 h-10 rounded-full mr-3 text-lg font-semibold">
          {selectedCommunity.bannerImage || selectedCommunity.name?.charAt(0)}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {selectedCommunity.name}
          </h3>
          <p className="text-sm text-gray-500">
            {selectedCommunity.memberCount} members
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className="flex items-start space-x-3">
              <div className="flex justify-center items-center text-white bg-gray-400 w-8 h-8 rounded-full text-sm font-semibold flex-shrink-0">
                {msg.userAvatar ? (
                  <img
                    src={msg.userAvatar}
                    alt={msg.userName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User size={16} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-900 truncate">
                    {msg.userName}
                    {msg.userId === user?.uid && (
                      <span className="text-blue-500 ml-1">(You)</span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm mt-1 text-gray-700 break-words">
                  {msg.text}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyPress={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage()
            }
            disabled={!user}
          />
          <button
            onClick={sendMessage}
            disabled={!chatMessage.trim() || !user}
            className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
        {!user && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Please log in to send messages
          </p>
        )}
      </div>
    </div>
  );
}
