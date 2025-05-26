import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { auth, db } from "../../../components/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function EmergencyConfirm({
  isOpen,
  onClose,
  isLoading,
  onConfirm,
}: any) {
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

  const fetchUserData = async () => {
    const user = auth.currentUser;
    if (user) {
      const colRef = collection(db, "Users", user.uid, "EmergencyContacts");
      const querySnapshot = await getDocs(colRef);

      const contacts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setEmergencyContacts(contacts);
      console.log("Emergency contacts: ", contacts);
    } else {
      console.log("No user is signed in.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  console.log("Emergency contacts: ", emergencyContacts);

  return (
    <>
      {isOpen && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen  bg-gray-50 p-4"
          >
            <div className="m-auto mt-32 bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h2 className="text-2xl font-bold text-red-600 mb-6">
                Confirm Emergency
              </h2>

              <p className="mb-6 text-gray-700">
                Are you sure you want to send an emergency alert to your
                contacts? This action cannot be undone.
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={onClose}
                  className="text-xs md:text-base cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="text-xs md:text-base cursor-pointer px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  {isLoading ? (
                    <Loader size={24} className="animate-spin mx-auto" />
                  ) : (
                    "Confirm Emergency"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
