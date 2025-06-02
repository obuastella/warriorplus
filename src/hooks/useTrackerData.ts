import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../components/firebase";
import { useTrackerStore } from "../store/trackerStore";

const useTrackerData = () => {
  const { setTracker } = useTrackerStore();

  useEffect(() => {
    const fetchTracker = async () => {
      const user = auth.currentUser;
      if (user) {
        const trackerRef = doc(db, "Users", user.uid, "tracker", "data");
        const trackerSnap = await getDoc(trackerRef);
        if (trackerSnap.exists()) {
          const data = trackerSnap.data();
          setTracker({
            emergencyContact: data.emergencyContact || "",
            community: data.community || "None",
            bloodCount: data.bloodCount ? data.bloodCount : "None",
          });
        }
      }
    };
    fetchTracker();
  }, [setTracker]);

  return;
};

export default useTrackerData;
