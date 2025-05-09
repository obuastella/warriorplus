import { create } from "zustand";
import {
  collection,
  query,
  orderBy,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../components/firebase";

interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
}

interface ReminderStore {
  remindersData: Reminder[];
  fetchReminders: (userId: string) => Promise<void>;
  addReminder: (
    userId: string,
    reminder: Omit<Reminder, "id">
  ) => Promise<void>;
  deleteReminder: (userId: string, reminderId: string) => Promise<void>;
  updateReminder: (
    userId: string,
    reminderId: string,
    updatedData: Partial<Reminder>
  ) => Promise<void>;
}

export const useReminderStore = create<ReminderStore>((set) => ({
  remindersData: [],

  fetchReminders: async (userId) => {
    const q = query(
      collection(db, "Users", userId, "Reminders"),
      orderBy("date", "asc")
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Reminder[];
    set({ remindersData: data });
    console.log("Remainders: ", data);
  },

  addReminder: async (userId, reminder) => {
    const ref = collection(db, "Users", userId, "Reminders");
    await addDoc(ref, reminder);
    await useReminderStore.getState().fetchReminders(userId); // Refresh list
  },

  deleteReminder: async (userId, reminderId) => {
    const ref = doc(db, "Users", userId, "Reminders", reminderId);
    await deleteDoc(ref);
    await useReminderStore.getState().fetchReminders(userId); // Refresh list
  },
  updateReminder: async (userId, reminderId, updatedData) => {
    const ref = doc(db, "Users", userId, "Reminders", reminderId);
    await updateDoc(ref, updatedData);
    await useReminderStore.getState().fetchReminders(userId);
  },
}));
