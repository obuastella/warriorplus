import { Bell } from "lucide-react";
import { useState } from "react";
import EmergencyConfirm from "./modals/EmergencyConfirm";
import { toast } from "react-toastify";

export default function Sos() {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirmEmergency = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("An email has been sent to your contacts");
    } catch (e: any) {
      console.log("An error occured");
    } finally {
      setIsLoading(false);
      setShowConfirmationModal(false);
    }
  };
  return (
    <>
      {!showConfirmationModal && (
        <div>
          <h1 className="mt-10 font-bold text-3xl text-center">
            Emergency SOS
          </h1>
          <p className="text-center my-2">
            Press the button below to send an alert to your emergency contact.
          </p>
          <button
            onClick={() => setShowConfirmationModal(true)}
            className="my-8 flex justify-center items-center bg-secondary w-72 h-72 rounded-full m-auto cursor-pointer"
          >
            <Bell
              fill="white"
              color="white"
              size={150}
              className="animate-pulse"
            />
          </button>
          <p className="text-center mt-40">
            A confirmation prompt will appear to ensure the alert is
            intentional.
          </p>
        </div>
      )}
      <EmergencyConfirm
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        isLoading={isLoading}
        onConfirm={handleConfirmEmergency}
      />
    </>
  );
}
