import { X, Users, Loader } from "lucide-react";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../../components/firebase";
import { useUserStore } from "../../../store/userStore";

export default function CreateCommunity({ onClose }: any) {
  const user = auth.currentUser;
  const { firstName } = useUserStore();

  const [loading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState<any>({
    name: "",
    description: "",
    maxMembers: 50,
    isPrivate: false,
    bannerImage: null,
  });

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!user) {
      setSubmitError("You must be logged in to create a community");
      return;
    }

    if (!formData.name.trim()) {
      setSubmitError("Community name is required");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Create the community document
      const communityData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        maxMembers: parseInt(formData.maxMembers),
        isPrivate: formData.isPrivate,
        createdBy: {
          uid: user.uid,
          email: user.email,
          displayName: firstName,
        },
        createdAt: serverTimestamp(),
        memberCount: 1, // Creator is automatically a member
        members: [user.uid], // Array of member UIDs
        isActive: true,
      };

      // Add document to Communities collection
      const docRef = await addDoc(collection(db, "Communities"), communityData);

      console.log("Community created with ID: ", docRef.id);

      // Close modal on success
      onClose();

      // Optional: Show success message
      alert("Community created successfully!");
    } catch (error) {
      console.error("Error creating community: ", error);
      setSubmitError("Failed to create community. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading if user auth is still loading
  if (loading) {
    return (
      <div className="fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 flex items-center space-x-3">
          <Loader size={20} className="animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Show error if user is not authenticated
  if (!user) {
    return (
      <div className="fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 mb-4">
            You must be logged in to create a community.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-scroll fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="mb-10 bg-white rounded-xl max-w-xl w-full mx-4 flex flex-col h-fit shadow-xl">
        {/* Modal Header - Fixed */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 shrink-0">
          <h2 className="text-xl font-semibold">Create New Community</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 space-y-6 overflow-y-auto flex-grow">
            {/* Error Message */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                {submitError}
              </div>
            )}

            {/* Group Name */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Community Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter community name"
                disabled={isSubmitting}
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="What is this community about?"
                disabled={isSubmitting}
              ></textarea>
            </div>

            {/* Max Members */}
            <div className="space-y-2">
              <label
                htmlFor="maxMembers"
                className="block text-sm font-medium text-gray-700"
              >
                Maximum Number of Members
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="maxMembers"
                  name="maxMembers"
                  min="5"
                  max="256"
                  value={formData.maxMembers}
                  onChange={handleInputChange}
                  className="w-full mr-4"
                  disabled={isSubmitting}
                />
                <span className="text-sm font-medium flex items-center gap-2">
                  <Users size={16} />
                  {formData.maxMembers}
                  <span className="text-gray-500 text-xs">(max 256)</span>
                </span>
              </div>
            </div>

            {/* Privacy Setting */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrivate"
                name="isPrivate"
                checked={formData.isPrivate}
                onChange={handleInputChange}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                disabled={isSubmitting}
              />
              <label
                htmlFor="isPrivate"
                className="text-sm font-medium text-gray-700"
              >
                Make this community private
              </label>
            </div>
          </div>

          {/* Modal Footer - Fixed */}
          <div className="rounded-md bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t border-gray-300 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Community</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
