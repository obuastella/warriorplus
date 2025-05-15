import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { auth, db } from "../../../components/firebase";
import { toast } from "react-toastify";
import { useTrackerStore } from "../../../store/trackerStore";

interface Contact {
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  relation?: string;
}

export default function AddEmergencyContact() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { setTracker }: any = useTrackerStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  // Fetch existing contacts
  useEffect(() => {
    const fetchContacts = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const contactsRef = collection(
          db,
          "Users",
          user.uid,
          "EmergencyContacts"
        );
        const snapshot = await getDocs(contactsRef);
        const fetched: Contact[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Contact[];

        setContacts(fetched);
      } catch (error) {
        toast.error("Failed to fetch emergency contacts");
      }
    };

    fetchContacts();
  }, []);

  const handleInputChange = (
    index: number,
    field: keyof Contact,
    value: string
  ) => {
    const updated = [...contacts];
    updated[index][field] = value;
    setContacts(updated);
  };

  const addContact = () => {
    setContacts([
      ...contacts,
      { fullName: "", email: "", phone: "", relation: "" },
    ]);
  };

  const deleteContact = async (index: number) => {
    const user = auth.currentUser;
    if (!user) return;

    const contact = contacts[index];
    // If it exists in Firestore, delete it there
    if (contact.id) {
      try {
        setIsDeleteLoading(true);
        await deleteDoc(
          doc(db, "Users", user.uid, "EmergencyContacts", contact.id)
        );
        toast.success("Contact deleted");
        setIsDeleteLoading(false);
      } catch {
        toast.error("Failed to delete contact");
        setIsDeleteLoading(false);
      }
      setIsDeleteLoading(false);
    }

    // Remove from local state
    const updated = [...contacts];
    updated.splice(index, 1);
    setContacts(updated);

    // If no contacts left, update tracker to "None"
    if (updated.length === 0) {
      try {
        const trackerRef = doc(db, "Users", user.uid, "tracker", "data");
        await setDoc(trackerRef, { emergencyContact: "None" }, { merge: true });

        setTracker((prev: any) => ({
          ...prev,
          emergencyContact: "None",
        }));
      } catch {
        toast.error("Failed to update tracker");
      }
    }
  };

  const saveContacts = async (e: any) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    // Validate that all contact fields are filled
    const hasEmptyFields = contacts.some(
      (contact: any) =>
        contact.fullName.trim() === "" ||
        contact.email.trim() === "" ||
        contact.phone.trim() === ""
    );

    if (hasEmptyFields) {
      toast.error("Please fill out all contact fields before saving.");
      return;
    }

    try {
      setIsLoading(true);
      const updatedList: Contact[] = [];

      for (const contact of contacts) {
        if (contact.id) {
          // Update existing
          const ref = doc(
            db,
            "Users",
            user.uid,
            "EmergencyContacts",
            contact.id
          );
          await setDoc(ref, contact);
        } else {
          // Add new
          const ref = await addDoc(
            collection(db, "Users", user.uid, "EmergencyContacts"),
            contact
          );
          contact.id = ref.id;
        }

        updatedList.push(contact);
      }

      setContacts(updatedList);
      toast.success("Contacts saved");
      setIsLoading(false);

      // Update tracker
      const emergencyContactSummary = updatedList.map(
        ({ fullName, phone }) => ({
          fullName,
          phone,
        })
      );

      const trackerRef = doc(db, "Users", user.uid, "tracker", "data");
      await setDoc(
        trackerRef,
        { emergencyContact: emergencyContactSummary },
        { merge: true }
      );

      setTracker((prev: any) => ({
        ...prev,
        emergencyContact: emergencyContactSummary,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Failed to save contacts");
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex-wrap w-full flex justify-between items-center">
        <h3 className="text-xl mt-8 mb-4 font-semibold">Emergency Contacts</h3>
        <button
          onClick={addContact}
          className="cursor-pointer px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          Add Another Contact +
        </button>
      </div>
      {contacts.length === 0 && (
        <p className="my-8 text-sm text-center text-primary">
          No Emergency Contact Set
        </p>
      )}
      {contacts.map((contact, index) => (
        <div
          key={contact.id || index}
          className="space-y-4 rounded-lg mt-6 mb-6"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-secondary font-semibold">
              Contact {index + 1}
            </h4>
            <button
              disabled={isDeleteLoading}
              onClick={() => deleteContact(index)}
              className="text-red-600 hover:underline text-sm"
            >
              {isDeleteLoading ? "Loading..." : "Delete"}
            </button>
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Full Name <span className="text-secondary">*</span>
            </label>
            <input
              type="text"
              value={contact.fullName}
              onChange={(e) =>
                handleInputChange(index, "fullName", e.target.value)
              }
              className="border-gray-300 w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Email <span className="text-secondary">*</span>
            </label>
            <input
              type="email"
              value={contact.email}
              onChange={(e) =>
                handleInputChange(index, "email", e.target.value)
              }
              className="border-gray-300 w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Phone Number</label>
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) =>
                handleInputChange(index, "phone", e.target.value)
              }
              placeholder="+234 000 000 000"
              className="border-gray-300 w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Relation</label>
            <input
              type="text"
              value={contact.relation}
              onChange={(e) =>
                handleInputChange(index, "relation", e.target.value)
              }
              placeholder="Mother, Friend, etc."
              className="border-gray-300 w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <button
          disabled={isLoading}
          onClick={saveContacts}
          className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700/70"
        >
          {isLoading ? "Loading..." : "Save All Contacts"}
        </button>
      </div>
    </div>
  );
}
