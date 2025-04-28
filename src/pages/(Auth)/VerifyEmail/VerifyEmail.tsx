import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../components/firebase";
import { CheckCircle, Mail } from "lucide-react";

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
    <div className="flex min-h-screen w-full bg-gradient-to-b from-primary-50 to-primary/100">
      <div className="w-full  flex items-center justify-center p-6">
        <div className="bg-primary/80 rounded-2xl shadow-lg p-8 max-w-md  w-full">
          <div className="flex justify-center  mb-6">
            <div className="p-4 rounded-full">
              <Mail className="h-12 w-12 text-primary" />
            </div>
          </div>

          <h1 className="text-center text-3xl font-bold mb-3 text-white">
            Verify your Email
          </h1>

          <p className="text-center text-gray-900 text-sm mb-6">
            We've sent a verification email, Please check your inbox to verify
            your account.
          </p>

          <div className="bg-blue-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Make sure to check your spam folder if you don't see the email
                in your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
