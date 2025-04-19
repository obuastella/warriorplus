import { useState } from "react";
import { Users, Calendar, Lock, Unlock, UserPlus } from "lucide-react";

export default function CommunityList() {
  const [communities, setCommunities] = useState([
    {
      id: 1,
      name: "Fitness Warriors",
      description:
        "A community for fitness enthusiasts sharing workout tips and motivation.",
      bannerImage: "/images/header.jpg",
      creatorName: "Sarah Johnson",
      creatorImage: "/images/user.jpg",
      memberCount: 345,
      createdDate: "March 12, 2025",
      isPrivate: false,
      joined: false,
    },
    {
      id: 2,
      name: "Healthy Cooking Club",
      description:
        "Share your favorite healthy recipes and cooking techniques with others.",
      bannerImage: "/images/user.jpg",
      creatorName: "Mike Williams",
      creatorImage: "/images/no-profile.webp",
      memberCount: 187,
      createdDate: "January 05, 2025",
      isPrivate: true,
      joined: true,
    },
    {
      id: 3,
      name: "Diabetes Support",
      description:
        "A supportive space for people managing diabetes to share tips and encouragement.",
      bannerImage: "/images/header.jpg",
      creatorName: "Dr. Emily Chen",
      creatorImage: "/images/user.jpg",
      memberCount: 432,
      createdDate: "February 19, 2025",
      isPrivate: false,
      joined: false,
    },
    {
      id: 4,
      name: "Diabetes Support",
      description:
        "A supportive space for people managing diabetes to share tips and encouragement.",
      bannerImage: "/images/header.jpg",
      creatorName: "Dr. Emily Chen",
      creatorImage: "/images/user.jpg",
      memberCount: 432,
      createdDate: "February 19, 2025",
      isPrivate: false,
      joined: false,
    },
    {
      id: 5,
      name: "Diabetes Support",
      description:
        "A supportive space for people managing diabetes to share tips and encouragement.",
      bannerImage: "/images/header.jpg",
      creatorName: "Dr. Emily Chen",
      creatorImage: "/images/user.jpg",
      memberCount: 432,
      createdDate: "February 19, 2025",
      isPrivate: false,
      joined: false,
    },
    {
      id: 6,
      name: "Diabetes Support",
      description:
        "A supportive space for people managing diabetes to share tips and encouragement.",
      bannerImage: "/images/header.jpg",
      creatorName: "Dr. Emily Chen",
      creatorImage: "/images/user.jpg",
      memberCount: 432,
      createdDate: "February 19, 2025",
      isPrivate: false,
      joined: false,
    },
  ]);

  const toggleJoin = (id: any) => {
    setCommunities(
      communities.map((community) =>
        community.id === id
          ? { ...community, joined: !community.joined }
          : community
      )
    );
  };

  return (
    <div className="mt-8 mb-20 md:mb-0">
      <h2 className="text-2xl font-bold mb-6">Communities</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {communities.map((community) => (
          <div
            key={community.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Banner Image */}
            <div className="relative h-40 w-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={community.bannerImage}
                alt={`${community.name} banner`}
              />

              {/* Privacy Badge */}
              <div className="absolute top-3 right-3 bg-white bg-opacity-90 p-1.5 rounded-full">
                {community.isPrivate ? (
                  <Lock size={16} className="text-gray-700" />
                ) : (
                  <Unlock size={16} className="text-green-600" />
                )}
              </div>
            </div>

            <div className="p-4">
              {/* Community Name */}
              <h3 className="font-bold text-lg">{community.name}</h3>

              {/* Community Description */}
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {community.description}
              </p>

              {/* Creator Info */}
              <div className="flex items-center mt-4">
                <img
                  src={community.creatorImage}
                  alt={community.creatorName}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
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

              {/* Join Button */}
              <button
                onClick={() => toggleJoin(community.id)}
                className={`cursor-pointer mt-4 w-full py-2 px-4 rounded-md flex items-center justify-center ${
                  community.joined
                    ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                <UserPlus size={16} className="mr-2" />
                {community.joined ? "Joined" : "Join Community"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
