import { useEffect } from "react";
import { auth } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import { useUserStore } from "../store/userStore";

const useUserStatistics = (autoFetch = true) => {
  const { setStatistics }: any = useUserStore();

  const fetchStatistics = async () => {
    const user = auth.currentUser;
    if (user) {
      const statsRef = doc(db, "Users", user.uid, "statistics", "summary");
      const statsDoc = await getDoc(statsRef);

      if (statsDoc.exists()) {
        const statisticsData = statsDoc.data();
        setStatistics(statisticsData);
      } else {
        console.log("No statistics found for this user.");
      }
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchStatistics();
    }
  }, [setStatistics]);

  return { refetchStatistics: fetchStatistics };
};

export default useUserStatistics;
