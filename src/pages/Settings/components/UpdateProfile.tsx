import React from "react";
import { useState } from "react";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
export default function UpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });
  //   useEffect(() => {
  //     if (user) {
  //       setFormData({
  //         fullName: user.fullName || "",
  //         email: user.email || "",
  //         phone: user.phone || "",
  //       });
  //     }
  //   }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const updateProfile = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      toast.success("Profile info updated successfully!");
      setIsLoading(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
      setIsLoading(false);
    }
  };
  return (
    <form action="">
      <div className="mt-8 grid gap-6 mb-6 md:grid-cols-2">
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="fullName">
            Full name<span className="text-red-600">*</span>
          </label>
          <input
            id="fullName"
            className="block p-2.5 w-full rounded-md bg-gray-50 border border-gray-300"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium" htmlFor="email">
            Email<span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            className="block p-2.5 w-full rounded-md bg-gray-50 border border-gray-300"
            type="text"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mb-6">
        <label className="block mb-2 text-sm font-medium" htmlFor="phone">
          Phone number
        </label>
        <input
          id="phone"
          className="block p-2.5 w-full rounded-md bg-gray-50 border border-gray-300"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={updateProfile}
        className="cursor-pointer bg-secondary/80 px-4 p-2 text-white rounded-md hover:bg-primary"
      >
        {isLoading ? (
          <Loader size={24} className="mx-auto animate-spin" />
        ) : (
          "Update Profile"
        )}
      </button>
    </form>
  );
}
