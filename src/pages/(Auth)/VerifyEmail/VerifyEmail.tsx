import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../components/firebase";
import Lottie from "lottie-react";
import communityAnimation from "../../../lotties/community.json";

export default function VerifyEmail() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.emailVerified) {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="w-full gap-y-4 flex flex-col justify-center items-center">
      <div className="rounded-md mt-16 hidden lg:flex flex-col justify-center items-center bg-primary/90 w-[35%] h-full">
        <Lottie animationData={communityAnimation} loop className="w-[80%]" />
      </div>
      <div>
        <h1 className="text-center text-4xl font-semibold">
          Verify your Email
        </h1>
        <p className="text-center text-gray-400">
          We've sent a verification email to your inbox. Please verify your
          email before logging in.
        </p>
      </div>
    </div>
  );
}
