import { useEffect, useState } from "react";
import { auth, db } from "../../components/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  increment,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import useUserStatistics from "../../hooks/useUserStatistics";

interface PainEntry {
  id?: string;
  date: string;
  duration: string;
  severity: string;
  description?: string;
}

export default function Journal() {
  const { refetchStatistics } = useUserStatistics(false);
  const [form, setForm] = useState<PainEntry>({
    date: "",
    duration: "",
    severity: "",
    description: "",
  });
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const [editingEntry, setEditingEntry] = useState<PainEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const journalRef = collection(db, "Users", user.uid, "painJournal");
    const snapshot = await getDocs(journalRef);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as PainEntry[];
    setEntries(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    if (!form.date || !form.duration || !form.severity) {
      toast.error("Date, duration and severity are required.");
      return;
    }

    setIsLoading(true);
    try {
      const journalRef = collection(db, "Users", user.uid, "painJournal");

      if (editingEntry) {
        const entryDoc = doc(journalRef, editingEntry.id);
        await updateDoc(entryDoc, { ...form });
        toast.success("Entry updated");
        setIsLoading(false);
        setEditingEntry(null);
        await refetchStatistics();
      } else {
        await addDoc(journalRef, form);
        toast.success("Entry added");
        // Increment the painJournalEntries in statistics/summary
        const summaryRef = doc(db, "Users", user.uid, "statistics", "summary");
        await updateDoc(summaryRef, {
          painJournalEntries: increment(1),
        });
        await refetchStatistics();
        setIsLoading(false);
      }

      setForm({ date: "", duration: "", severity: "", description: "" });
      fetchEntries();
    } catch (error) {
      toast.error("Something went wrong");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (entry: PainEntry) => {
    setForm({
      date: entry.date,
      duration: entry.duration,
      severity: entry.severity,
      description: entry.description || "",
    });
    setEditingEntry(entry);
  };

  const handleDelete = async (entryId: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const entryDoc = doc(db, "Users", user.uid, "painJournal", entryId);
      await deleteDoc(entryDoc);
      toast.success("Entry deleted");
      fetchEntries();
      // Decrement the painJournalEntries in statistics/summary
      const summaryRef = doc(db, "Users", user.uid, "statistics", "summary");
      await updateDoc(summaryRef, {
        painJournalEntries: increment(-1),
      });
      await refetchStatistics();
    } catch (error) {
      toast.error("Failed to delete entry");
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-x-4">
      <div className="pb-8 md:pb-0 p-4 w-full md:w-[30%] bg-primary/40 h-screen overflow-y-auto">
        <h2 className="mb-4 text-lg font-semibold">Previous Entries</h2>
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="my-4 space-y-1 rounded-sm border border-[#f5f5f5] p-3 text-sm font-light bg-white"
            >
              <p>Date: {entry.date}</p>
              <p>Duration: {entry.duration}</p>
              <p>Severity: {entry.severity}</p>
              <p>Description: {entry.description || "N/A"}</p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleEdit(entry)}
                  className="cursor-pointer text-xs text-blue-600 underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(entry.id!)}
                  className="cursor-pointer text-xs text-red-600 underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm">No entries found.</p>
        )}
      </div>

      <div className="p-4 border border-[#f5f5f5] w-full md:w-[70%] h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold">Log a New Pain Episode</h2>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="">
            <label>Date</label>
            <input
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>

          <div className="mt-4">
            <label>Duration (in hours)</label>
            <input
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
          </div>

          <div className="mt-4">
            <label>Severity</label>
            <select
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              required
            >
              <option value="">Select severity</option>
              <option value="Mild">Mild</option>
              <option value="Moderate">Moderate</option>
              <option value="Severe">Severe</option>
            </select>
          </div>

          <div className="mt-4">
            <label>Description (optional)</label>
            <textarea
              className="mt-2 p-3 rounded-md w-full border border-foreground"
              cols={4}
              rows={5}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer text-white bg-primary px-4 py-2 rounded-md"
            >
              {editingEntry ? "Update Entry" : "Save Entry"}
            </button>

            {editingEntry && (
              <button
                type="button"
                className="cursor-pointer text-white bg-gray-500 px-4 py-2 rounded-md"
                onClick={() => {
                  setEditingEntry(null);
                  setForm({
                    date: "",
                    duration: "",
                    severity: "",
                    description: "",
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
