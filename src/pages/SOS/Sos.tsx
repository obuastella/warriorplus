import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import EmergencyConfirm from "./modals/EmergencyConfirm";
import { toast } from "react-toastify";
import NoContact from "./NoContact";
import useTrackerData from "../../hooks/useTrackerData";
import { useTrackerStore } from "../../store/trackerStore";
import emailjs from "emailjs-com";
// import { sendSms } from "../../utils/sendSms";

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

  // const handleConfirmEmergency = async () => {
  //   setIsLoading(true);
  //   try {
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //     toast.success("An email has been sent to your contacts");
  //   } catch (e: any) {
  //     console.log("An error occured");
  //   } finally {
  //     setIsLoading(false);
  //     setShowConfirmationModal(false);
  //   }
  // };
  // added
  const sendEmergencyEmail = (
    to_email: string,
    fullName: string,
    locationUrl: string
  ) => {
    emailjs
      .send(
        "service_cr4n2q6", // Your EmailJS Service ID
        "template_g5gy2qs", // Your EmailJS Template ID for emergency
        {
          to_email, // recipient's email
          full_name: fullName, // recipient's name
          location_url: locationUrl, // the Google Maps link with coordinates
        },
        "4xPiL1wQeLNDbAqoI" // Your EmailJS public key
      )
      .then(
        (response) => {
          console.log("Emergency email sent:", response.status, response.text);
        },
        (error) => {
          console.error("Error sending emergency email:", error);
        }
      );
  };

  const handleConfirmEmergency = async (
    contacts: { email: string; fullName: string; phone: string }[]
  ) => {
    setIsLoading(true);

    try {
      // Get user location from browser
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject)
      );

      const { latitude, longitude } = position.coords;
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

      // Send email to each emergency contact
      await Promise.all(
        contacts.map((contact) =>
          sendEmergencyEmail(contact.email, contact.fullName, locationUrl)
        )
      );
      // this includes the email  *sms* feature --make sure you have your backend running
      // await Promise.all([
      //   ...contacts.map((contact) =>
      //     sendEmergencyEmail(contact.email, contact.fullName, locationUrl)
      //   ),
      //   ...contacts.map((contact) =>
      //     sendSms(
      //       contact.phone,
      //       `Emergency Alert from Warrior+:\nYour loved one may be in crisis.\nLocation: ${locationUrl}`
      //     )
      //   ),
      // ]);

      // end added
      toast.success("Emergency emails sent to your contacts!");
    } catch (error) {
      console.error("Failed to send emergency emails", error);
      toast.error("Failed to send emergency emails.");
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
