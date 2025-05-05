import { create } from "zustand";

interface UserStore {
  firstName: string;
  lastName: string;
  email: any;
  setUser: (user: { firstName: string; lastName: string; email: any }) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  firstName: "",
  lastName: "",
  email: "",
  setUser: (user) =>
    set({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }),
}));
