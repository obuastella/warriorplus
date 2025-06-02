import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../components/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { Loader } from "lucide-react";
import { useUserStore } from "../store/userStore";
import { doc, getDoc } from "firebase/firestore";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { role, setUserRole }: any = useUserStore();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user data from Firestore when user is authenticated
        try {
          const userRef = doc(db, "Users", currentUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserRole(userData.role || ""); // Set the role in store
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setUserDataLoaded(true);
      } else {
        setUserRole(""); // Clear role when no user
        setUserDataLoaded(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUserRole]);
  if (loading || (user && !userDataLoaded)) {
    return (
      <div>
        <Loader
          size={40}
          className="mx-auto animate-spin h-screen text-primary"
        />
      </div>
    );
  }

  // Check if user exists and either is admin or user2 or  has verified email
  if (
    !user ||
    !(
      role === "admin" ||
      role === "user2" ||
      (role === "user" && user.emailVerified)
    )
  ) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;
