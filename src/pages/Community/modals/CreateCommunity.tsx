import { X, Users } from "lucide-react";
import { useState } from "react";

export default function CreateCommunity({ onClose }: any) {
  const [formData, setFormData] = useState({
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
    // Here you would handle the form submission
    console.log("Form submitted:", formData);
    onClose();
  };
  return (
    <div className=" overflow-scroll fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
      {/* Modal Content */}
      <div className="mb-10 bg-white rounded-xl max-w-xl w-full mx-4 flex flex-col h-fit shadow-xl">
        {/* Modal Header - Fixed */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300 shrink-0">
          <h2 className="text-xl font-semibold">Create New Community</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="p-6 space-y-6 overflow-y-auto flex-grow">
            {/* Banner Image Upload */}
            {/* For now - no banner image */}
            {/* <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Banner Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors">
                <div className="flex flex-col items-center">
                  <Upload className="w-6 h-6 text-gray-400" />
                  <p className="mt-1 text-sm text-gray-500">
                    Click to upload an image
                  </p>
                  <p className="text-xs text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  name="bannerImage"
                  onChange={(e: any) => {
                    if (e.target.files && e.target.files[0]) {
                      setFormData({
                        ...formData,
                        bannerImage: e.target.files[0],
                      });
                    }
                  }}
                />
              </div>
            </div> */}

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
                />
                <span className="text-sm font-medium flex items-center gap-2">
                  <Users size={16} />
                  {formData.maxMembers}
                  <span className="text-gray-500 text-xs">(max 256)</span>
                </span>
              </div>
            </div>
          </div>

          {/* Modal Footer - Fixed */}
          <div className="rounded-md bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t  border-gray-300 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Create Community
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
