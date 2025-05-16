import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import EmergencyConfirm from "./modals/EmergencyConfirm";
import { toast } from "react-toastify";
import NoContact from "./NoContact";
import useTrackerData from "../../hooks/useTrackerData";
import { useTrackerStore } from "../../store/trackerStore";

export default function Sos() {
  const { tracker } = useTrackerStore();
  useTrackerData();
  const [emergencyContact, setEmergencyContact] = useState<boolean>(false);
  useEffect(() => {
    if (tracker?.emergencyContact === "None") {
      setEmergencyContact(false);
    } else {
      setEmergencyContact(true);
    }
  }, [tracker?.emergencyContact]);

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
      {emergencyContact ? (
        <div>
          {!showConfirmationModal && (
            <div>
              <h1 className="mt-10 font-bold text-3xl text-center">
                Emergency SOS
              </h1>
              <p className=" text-gray-600 text-center my-2">
                Press the button below to send an alert to your emergency
                contact.
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
              <p className=" text-gray-600 text-center mt-40">
                A confirmation prompt will appear to ensure the alert is
                intentional.
              </p>
            </div>
          )}
        </div>
      ) : (
        <NoContact />
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
