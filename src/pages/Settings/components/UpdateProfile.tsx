import React, { useEffect } from "react";
import { useState } from "react";
import { Info, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { auth, db } from "../../../components/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
export default function UpdateProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "Users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData(docSnap.data());
      } else {
        console.log("User data not found in Firestore.");
      }
    } else {
      console.log("No user is signed in.");
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);
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
      const user = auth.currentUser;
      if (!user) {
        toast.error("User not authenticated.");
        setIsLoading(false);
        return;
      }

      const userRef = doc(db, "Users", user.uid);
      await updateDoc(userRef, {
        firstName: formData.firstName,
        lastName: formData.lastName,
      });

      toast.success("Profile info updated successfully!");
    } catch (e: any) {
      console.error("Error updating profile:", e);
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mt-6">
        <div className="flex w-full justify-between items-center">
          <label className="block mb-2 text-sm font-medium" htmlFor="email">
            Email<span className="text-red-600">*</span>
          </label>
          <p className="flex text-gray-400 justify-start items-center gap-x-2 text-xs">
            <Info size={15} />
            Email cannot be changed*
          </p>
        </div>
        <div className="cursor-not-allowed block p-2.5 w-full rounded-md bg-gray-50 border border-gray-300">
          {!formData.email ? "Loading..." : formData.email}
        </div>
      </div>
      <form action="">
        <div className="mt-6 grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <label
              className="block mb-2 text-sm font-medium"
              htmlFor="fullName"
            >
              First Name<span className="text-red-600">*</span>
            </label>
            <input
              id="firstName"
              className="block p-2.5 w-full rounded-md bg-gray-50 border border-gray-300"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium" htmlFor="email">
              Last Name<span className="text-red-600">*</span>
            </label>
            <input
              id="lastName"
              className="block p-2.5 w-full rounded-md bg-gray-50 border border-gray-300"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button
          disabled={isLoading}
          onClick={updateProfile}
          className="cursor-pointer bg-blue-700 px-4 p-2 text-white rounded-md hover:bg-primary"
        >
          {isLoading ? (
            <Loader size={24} className="mx-auto animate-spin" />
          ) : (
            "Update Profile"
          )}
        </button>
      </form>
    </>
  );
}
