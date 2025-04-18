import { useState } from "react";

interface Contact {
  fullName: string;
  email: string;
  phone?: string;
  relation?: string;
}

export default function AddEmergencyContact() {
  const [contacts, setContacts] = useState<Contact[]>([
    { fullName: "", email: "", phone: "", relation: "" },
  ]);

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

  const saveContacts = (e: any) => {
    e.preventDefault();
    console.log("Saved contacts:", contacts);
    // You can send to backend or store locally here
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
      {contacts.map((contact, index) => (
        <div key={index} className="space-y-4  rounded-lg mb-6">
          <h4 className="mt-8 md:mt-0 text-secondary font-semibold">
            Contact {index + 1}
          </h4>

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
              placeholder=""
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
              placeholder="example@info.com"
              className="border-gray-300 w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">
              Phone Number <span className="text-secondary">*</span>
            </label>
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
          onClick={saveContacts}
          className="cursor-pointer px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-700/70"
        >
          Save All Contacts
        </button>
      </div>
    </div>
  );
}
