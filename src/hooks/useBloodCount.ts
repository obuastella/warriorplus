//@ts-nocheck
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../components/firebase";

export const useBloodCount = () => {
  const user = auth.currentUser;
  const [bloodCount, setBloodCount] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setBloodCount([]);
      setLoading(false);
      return;
    }

    const userDocRef = doc(db, "Users", user.uid);

    // Set up real-time listener
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setBloodCount(userData.bloodCount || []);
        } else {
          setBloodCount([]);
        }
        setLoading(false);
        setError(null);
      },
      (error: any) => {
        console.error("Error fetching blood count:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, db]);

  // Get the latest blood count entry
  const getLatestBloodCount = () => {
    if (bloodCount.length === 0) return null;
    return bloodCount.sort(
      (a: any, b: any) => new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  };

  // Get blood count history
  const getBloodCountHistory = () => {
    return bloodCount.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  };

  return {
    bloodCount,
    loading,
    error,
    getLatestBloodCount,
    getBloodCountHistory,
    hasBloodCount: bloodCount.length > 0,
  };
};
