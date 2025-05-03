// import { useState, useEffect } from "react";
// import { useSearchParams, useNavigate } from "react-router-dom";
// import { confirmPasswordReset } from "firebase/auth";

// import { Loader, Lock } from "lucide-react";
// import { auth } from "../../../components/firebase";
// import { toast } from "react-toastify";

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState("");

//   const oobCode = searchParams.get("oobCode");

//   useEffect(() => {
//     if (!oobCode) {
//       setError("Invalid or expired password reset link.");
//     }
//   }, [oobCode]);

//   const handleReset = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!oobCode) {
//       toast.error("Missing reset code.");
//       return;
//     }

//     if (newPassword !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       await confirmPasswordReset(auth, oobCode, newPassword);
//       toast.success("Password reset successfully!", { position: "top-right" });
//       navigate("/login");
//     } catch (err: any) {
//       console.error(err);
//       toast.error("Failed to reset password. Try again.", {
//         position: "top-right",
//       });
//       setError(err.message || "Failed to reset password.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen w-full bg-gradient-to-b from-primary-50 to-primary/100">
//       <div className="w-full flex items-center justify-center p-6">
//         <div className="bg-primary/80 rounded-2xl shadow-lg p-8 max-w-md w-full">
//           <div className="flex justify-center mb-6">
//             <div className="bg-primary/10 p-4 rounded-full">
//               <Lock className="h-12 w-12 text-primary" />
//             </div>
//           </div>

//           <h1 className="text-center text-3xl font-bold mb-3 text-white">
//             Reset Password
//           </h1>

//           <p className="text-center text-black/70 text-sm mb-6">
//             Enter your new password below.
//           </p>

//           <form onSubmit={handleReset} className="space-y-4">
//             <div>
//               <label className="block text-sm text-white font-medium mb-1">
//                 New Password
//               </label>
//               <input
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 rounded-lg border border-foreground focus:ring-2 focus:ring-primary focus:border-primary  dark:text-white"
//               />
//             </div>

//             <div>
//               <label className="block text-sm text-white font-medium mb-1">
//                 Confirm Password
//               </label>
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-3 rounded-lg border border-foreground focus:ring-2 focus:ring-primary focus:border-primary  dark:text-white"
//               />
//             </div>

//             {error && (
//               <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
//                 {error}
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="cursor-pointer w-full flex items-center justify-center px-5 py-3 rounded-lg bg-secondary/20 shadow-lg hover:bg-secondary/40 disabled:bg-primary/10 disabled:text-gray-300 text-white font-medium transition"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader className="h-4 w-4 mr-2 animate-spin" />
//                   Resetting...
//                 </>
//               ) : (
//                 "Reset Password"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, confirmPasswordReset } from "firebase/auth";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const oobCode = urlParams.get("oobCode");

    if (!oobCode) {
      setError("Invalid or expired reset link.");
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    const oobCode = urlParams.get("oobCode");

    if (!oobCode) {
      setError("Invalid or expired reset link");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call confirmPasswordReset with the oobCode and the new password entered by the user
      await confirmPasswordReset(getAuth(), oobCode, newPassword);
      setSuccess(true);
      setError("");
      navigate("/login"); // Redirect to login after successful reset
    } catch (err: any) {
      setError(err.message || "Failed to reset password. Please try again.");
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Reset Password</h1>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div>Password reset successfully!</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
