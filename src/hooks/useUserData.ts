import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { auth, db } from "../components/firebase";
import { useUserStore } from "../store/userStore";

const useUserData = () => {
  const { setUser } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const user: any = auth.currentUser;
      if (user) {
        const userRef = doc(db, "Users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: user.email,
            role: userData.role,
          });
        }
      }
    };

    fetchUserData();
  }, [setUser]);

  return;
};
export default useUserData;
