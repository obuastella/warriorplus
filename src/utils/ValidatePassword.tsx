export const validatePassword = (
  password: string,
  confirmPassword: string
): string => {
  if (password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must include at least one uppercase letter.";
  }
  if (!/\d/.test(password)) {
    return "Password must include at least one number.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return "";
};
