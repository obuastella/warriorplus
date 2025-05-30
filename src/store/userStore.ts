import { create } from "zustand";

interface Statistics {
  painJournalEntries: number;
  remindersCount: number;
  painCrisisLevel: string;
}

interface UserStore {
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  statistics: Statistics;
  setUser: (user: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  }) => void;
  setStatistics: (stats: Statistics) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  firstName: "",
  lastName: "",
  role: "",
  email: "",
  statistics: {
    painJournalEntries: 0,
    remindersCount: 0,
    painCrisisLevel: "None",
  },
  setUser: (user) =>
    set({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }),
  setUserRole: (role: any) => set({ role }),
  setStatistics: (stats) =>
    set({
      statistics: stats,
    }),
}));
