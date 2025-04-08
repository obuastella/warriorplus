import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import PasswordInput from "../../../components/PasswordInput";
import { ValidateSignlePassword } from "../../../utils/ValidateSinglePassword";

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
    try {
      toast.success("Password updated successfully");
      setIsLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordError("");
    } catch (e: any) {
      toast.error(e?.response?.data?.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <h3 className="text-xl mt-8 mb-4 font-semibold">Change Password</h3>
      <form onSubmit={handleSubmit}>
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
                : "bg-primary/90 cursor-not-allowed"
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
