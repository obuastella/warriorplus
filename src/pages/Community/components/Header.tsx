import { Globe, Upload, X, Lock, Users } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log("Form submitted:", formData);
    setIsOpen(false);
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  return (
    <div className="mt-8 flex gap-y-4 flex-wrap justify-between items-center">
      <div className="flex flex-wrap gap-y-4 justify-start items-center gap-x-2">
        <h2>Search for communities:</h2>
        <form className="w-full md:w-xl">
          <label
            htmlFor="default-search"
            className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
          >
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              className="block w-full p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg  focus:ring-blue-500 focus:border-blue-500"
              placeholder="Search..."
              required
            />
          </div>
        </form>
      </div>

      <div className="flex flex-row-reverse md:flex-row justify-start items-center gap-x-4">
        <div className="hidden md:flex justify-start items-center gap-x-4">
          <p>Filter by:</p>
          <select className="border border-gray-400 rounded-md p-2">
            <option value="">Today</option>
            <option value="">Last Week</option>
            <option value="">Last Month</option>
          </select>
        </div>
        <div>
          <button
            onClick={openModal}
            className=" cursor-pointer bg-purple-500 rounded-xl p-2 px-5 text-white"
          >
            Create +
          </button>
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className=" overflow-scroll fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
          {/* Modal Content */}
          <div className="mb-10 bg-white rounded-xl max-w-xl w-full mx-4 flex flex-col h-[80%] shadow-xl">
            {/* Modal Header - Fixed */}
            <div className="flex justify-between items-center p-4 border-b border-gray-300 shrink-0">
              <h2 className="text-xl font-semibold">Create New Community</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="p-6 space-y-6 overflow-y-auto flex-grow">
                {/* Banner Image Upload */}
                <div className="space-y-2">
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
                </div>

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

                {/* Privacy Setting */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Privacy Setting
                  </label>
                  <div className="flex flex-col space-y-3">
                    <label className="flex items-center space-x-3 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="isPrivate"
                        checked={!formData.isPrivate}
                        onChange={() =>
                          setFormData({ ...formData, isPrivate: false })
                        }
                        className="h-4 w-4 text-purple-600"
                      />
                      <Globe size={18} className="text-gray-500" />
                      <div>
                        <p className="font-medium">Open</p>
                        <p className="text-xs text-gray-500">
                          Anyone can join and view content
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center space-x-3 p-2 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="isPrivate"
                        checked={formData.isPrivate}
                        onChange={() =>
                          setFormData({ ...formData, isPrivate: true })
                        }
                        className="h-4 w-4 text-purple-600"
                      />
                      <Lock size={18} className="text-gray-500" />
                      <div>
                        <p className="font-medium">Private</p>
                        <p className="text-xs text-gray-500">
                          Request to join required, content only visible to
                          members
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer - Fixed */}
              <div className="rounded-md bg-gray-50 px-6 py-4 flex justify-end space-x-3 border-t  border-gray-300 shrink-0">
                <button
                  type="button"
                  onClick={closeModal}
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
      )}
    </div>
  );
}
