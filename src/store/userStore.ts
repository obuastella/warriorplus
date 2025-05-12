import { create } from "zustand";

interface Statistics {
  painJournalEntries: number;
  remindersCount: number;
  painCrisisLevel: string;
}

interface UserStore {
  firstName: string;
  lastName: string;
  email: string;
  statistics: Statistics;
  setUser: (user: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;
  setStatistics: (stats: Statistics) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  firstName: "",
  lastName: "",
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
    }),
  setStatistics: (stats) =>
    set({
      statistics: stats,
    }),
}));
