import { useEffect } from "react";
import { auth } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import { useUserStore } from "../store/userStore";

const useUserStatistics = () => {
  const { setStatistics }: any = useUserStore();

  useEffect(() => {
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

    fetchStatistics();
  }, [setStatistics]);

  return;
};

export default useUserStatistics;
