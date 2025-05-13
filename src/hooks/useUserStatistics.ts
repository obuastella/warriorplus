import { useEffect } from "react";
import { auth } from "../components/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../components/firebase";
import { useUserStore } from "../store/userStore";

const useUserStatistics = (autoFetch = true) => {
  const { setStatistics }: any = useUserStore();

  const fetchStatistics = async () => {
    const user = auth.currentUser;
    if (user) {
      // Get the summary statistics
      const statsRef = doc(db, "Users", user.uid, "statistics", "summary");
      const statsDoc = await getDoc(statsRef);

      // Fetch the latest journal entry
      let latestSeverity = "N/A";
      const painJournalRef = collection(db, "Users", user.uid, "painJournal");
      const latestEntryQuery = query(
        painJournalRef,
        orderBy("date", "desc"),
        limit(1)
      );
      const latestEntrySnapshot = await getDocs(latestEntryQuery);

      if (!latestEntrySnapshot.empty) {
        const latestEntryData = latestEntrySnapshot.docs[0].data();
        latestSeverity = latestEntryData.severity || "N/A";
      }

      if (statsDoc.exists()) {
        const statisticsData = statsDoc.data();
        setStatistics({
          ...statisticsData,
          painCrisisLevel: latestSeverity, // Inject the latest severity
        });
      } else {
        // If no stats doc, still set pain crisis severity
        setStatistics({
          painJournalEntries: 0,
          remindersCount: 0,
          painCrisisLevel: latestSeverity,
        });
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
