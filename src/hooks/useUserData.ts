import { useEffect } from "react";
import { auth } from "../components/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../components/firebase";
import { useUserStore } from "../store/userStore";

const useUserData = () => {
  const { setUser }: any = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: user.email,
          });
        }
      }
    };

    fetchUserData();
  }, [setUser]);

  return;
};

export default useUserData;
