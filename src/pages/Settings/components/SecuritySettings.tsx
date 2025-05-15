import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import PasswordInput from "../../../components/PasswordInput";
import { ValidateSignlePassword } from "../../../utils/ValidateSinglePassword";
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    setPasswordError(ValidateSignlePassword(password));
  };

  const isFormValid =
    currentPassword.trim() !== "" &&
    newPassword.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    newPassword === confirmPassword &&
    passwordError === "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user || !user.email) {
      toast.error("User not authenticated.");
      setIsLoading(false);
      return;
    }

    try {
      // Step 1: Re-authenticate
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Step 2: Update password
      await updatePassword(user, newPassword);

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (error: any) {
      // console.error(error);
      if (error.code === "auth/wrong-password") {
        toast.error("Current password is incorrect.");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password should be at least 6 characters.");
      } else {
        toast.error("Incorrect Password. Try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-xl mt-8 mb-4 font-semibold">Change Password</h3>
      <form className="mb-20 md:mb-2" onSubmit={handleSubmit}>
        <div className="grid gap-3">
          <label htmlFor="current-password">Current Password</label>
          <PasswordInput
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />

          <label htmlFor="new-password">New Password</label>
          <PasswordInput
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
          {passwordError && (
            <p className="text-red-500 text-sm">{passwordError}</p>
          )}

          <label htmlFor="confirm-password">Confirm Password</label>
          <PasswordInput
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="text-red-500 text-sm">Passwords do not match</p>
          )}
        </div>
        <div className="w-full flex">
          <button
            type="submit"
            disabled={!isFormValid}
            className={`px-4 p-2 rounded-md text-white ml-auto mt-6 ${
              isFormValid
                ? "bg-secondary hover:bg-primary"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
