import { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function ChangeAvatar() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);

      setSelectedImage(imageUrl);

      try {
        const formData = new FormData();
        formData.append("image", file);
        setIsLoading(false);

        toast.success("Avatar updated successfully");
      } catch (error) {
        console.error("Error updating avatar:", error);
        toast.error("Failed to update avatar");
        setIsLoading(false);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-wrap gap-y-4 justify-start items-end">
      <img
        src={selectedImage || "/images/no-profile.webp"}
        alt="profile"
        className="w-40 h-40 rounded-full"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        id="profileInput"
        className="hidden"
        onChange={handleImageChange}
      />

      <button
        className="cursor-pointer bg-secondary/80 px-4 p-2 text-white rounded-md hover:bg-primary"
        onClick={() => document.getElementById("profileInput")?.click()}
        disabled={isLoading}
      >
        {isLoading ? "Updating..." : "Change Avatar"}
      </button>
    </div>
  );
}
