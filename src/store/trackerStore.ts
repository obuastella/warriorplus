import { create } from "zustand";

interface Tracker {
  emergencyContact: string;
  community: string;
  bloodCount: any[];
}

interface TrackerStore {
  tracker: Tracker;
  setTracker: (tracker: Tracker) => void;
}

export const useTrackerStore = create<TrackerStore>((set) => ({
  tracker: {
    emergencyContact: "",
    community: "",
    bloodCount: [],
  },
  setTracker: (tracker) => set({ tracker }),
}));
