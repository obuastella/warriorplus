//@ts-nocheck
import { useState, useRef, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";

import { auth, db } from "../../../components/firebase";
import { toast } from "react-toastify";

export default function ChangeAvatar() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user avatar from Firestore when component mounts
  useEffect(() => {
    const loadUserAvatar = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "Users", auth.currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists() && userSnap.data().avatar) {
            const avatarData = userSnap.data().avatar;
            setSelectedImage(avatarData);
            setPreviewImage(avatarData);
            // Also cache in localStorage for offline access
            localStorage.setItem("userAvatar", avatarData);
          } else {
            // If no avatar in Firestore, try local storage as fallback
            const savedAvatar: any = localStorage.getItem("userAvatar");
            if (savedAvatar) {
              setSelectedImage(savedAvatar);
              setPreviewImage(savedAvatar);
            }
          }
        } catch (error) {
          console.error("Error loading avatar:", error);
          // Try localStorage as fallback
          const savedAvatar: any = localStorage.getItem("userAvatar");
          if (savedAvatar) {
            setSelectedImage(savedAvatar);
            setPreviewImage(savedAvatar);
          }
        }
      }
    };

    loadUserAvatar();
  }, [auth.currentUser]);

  const handleImageChange = async (event: any) => {
    setIsLoading(true);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Limit file size to 500KB to avoid Firestore document size limits
      if (file.size > 500 * 1024) {
        alert("Image too large. Please select an image under 500KB.");
        setIsLoading(false);
        return;
      }

      // Create a preview of the image
      const localPreview: any = URL.createObjectURL(file);
      setPreviewImage(localPreview);

      try {
        // Convert the image to base64 string for storage
        const base64String: any = await convertToBase64(file);

        // Log the base64 string for testing (first 50 chars)
        // console.log(
        //   "Image stored as base64:",
        //   base64String.substring(0, 50) + "..."
        // );

        // Save to localStorage for offline access
        localStorage.setItem("userAvatar", base64String);
        setSelectedImage(base64String);

        // Save to Firestore if user is logged in
        if (auth.currentUser) {
          const userRef = doc(db, "Users", auth.currentUser.uid);
          await updateDoc(userRef, {
            avatar: base64String,
          });
          // console.log("Avatar URL saved to Firestore Users collection");
          toast.success("Avatar updated successfully");
        } else {
          toast.success("Please log in to save your avatar");
        }
      } catch (error) {
        console.error("Error processing image:", error);
        toast.success("Failed to update avatar");
      } finally {
        setIsLoading(false);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  // Helper function to convert file to base64
  const convertToBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-wrap gap-y-4 justify-start items-end">
      <img
        src={previewImage || "/images/no-profile.webp"}
        alt="profile"
        className="w-40 h-40 rounded-full object-cover"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageChange}
      />

      <button
        className="cursor-pointer bg-secondary/80 px-4 p-2 text-white rounded-md hover:bg-primary"
        onClick={handleButtonClick}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Change Avatar"}
      </button>
    </div>
  );
}
