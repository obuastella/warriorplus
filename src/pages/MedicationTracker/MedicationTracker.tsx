//@ts-nocheck
import { useState, useEffect } from "react";
import {
  PlusCircle,
  Trash2,
  Star,
  AlertCircle,
  X,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";

// This would come from your database in a real app
const INITIAL_MEDICATIONS = [
  {
    id: 1,
    name: "Hydroxyurea",
    frequency: "Daily",
    dosage: "500mg",
    effectiveness: 4,
    sideEffects: "Mild nausea",
    notes: "Works well for pain prevention",
  },
  {
    id: 2,
    name: "Ibuprofen",
    frequency: "As needed",
    dosage: "400mg",
    effectiveness: 3,
    sideEffects: "None",
    notes: "Good for mild pain",
  },
];

export default function MedicationTracker() {
  const [medications, setMedications] = useState(INITIAL_MEDICATIONS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: "",
    frequency: "",
    dosage: "",
    effectiveness: 0,
    sideEffects: "",
    notes: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [filterOption, setFilterOption] = useState("all");
  const [showEffectivenessGuide, setShowEffectivenessGuide] = useState(false);

  // For tracking the most effective medication
  const [mostEffectiveMed, setMostEffectiveMed] = useState(null);

  useEffect(() => {
    // Find most effective medication when medications change
    if (medications.length > 0) {
      const mostEffective: any = [...medications].sort(
        (a, b) => b.effectiveness - a.effectiveness
      )[0];
      setMostEffectiveMed(mostEffective);
    } else {
      setMostEffectiveMed(null);
    }
  }, [medications]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({ ...prev, [name]: value }));
  };

  const handleEffectivenessSelect = (rating: any) => {
    setNewMedication((prev) => ({ ...prev, effectiveness: rating }));
  };

  const handleAddMedication = () => {
    if (
      !newMedication.name ||
      !newMedication.frequency ||
      !newMedication.dosage
    ) {
      toast.warning("Please fill in required fields");
      return;
    }

    if (editingId) {
      // Update existing medication
      setMedications(
        medications.map((med) =>
          med.id === editingId ? { ...newMedication, id: editingId } : med
        )
      );
      setEditingId(null);
    } else {
      // Add new medication
      const newId = Math.max(0, ...medications.map((m) => m.id)) + 1;
      setMedications([...medications, { ...newMedication, id: newId }]);
    }

    // Reset form
    setNewMedication({
      name: "",
      frequency: "",
      dosage: "",
      effectiveness: 0,
      sideEffects: "",
      notes: "",
    });
    setShowAddForm(false);
  };

  const handleEditMedication = (med: any) => {
    setNewMedication(med);
    setEditingId(med.id);
    setShowAddForm(true);
  };

  const handleDeleteMedication = (id: any) => {
    if (confirm("Are you sure you want to remove this medication?")) {
      setMedications(medications.filter((med) => med.id !== id));
    }
  };

  // Filter medications based on selected option
  const filteredMedications = () => {
    switch (filterOption) {
      case "effective":
        return medications.filter((med) => med.effectiveness >= 4);
      case "ineffective":
        return medications.filter((med) => med.effectiveness <= 2);
      case "daily":
        return medications.filter((med) =>
          med.frequency.toLowerCase().includes("daily")
        );
      case "asneeded":
        return medications.filter((med) =>
          med.frequency.toLowerCase().includes("as needed")
        );
      default:
        return medications;
    }
  };

  return (
    <div className=" p-4 bg-white">
      <div className="mb-6 border-b border-foreground pb-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          My Medications
        </h2>
        <p className="text-gray-600">
          Track and manage your medications, noting which ones work best for you
        </p>
      </div>
      {/* Summary Section */}
      <div className=" mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-foreground">
            <div className="text-sm text-gray-500">Total Medications</div>
            <div className="text-2xl font-bold text-gray-900">
              {medications.length}
            </div>
          </div>
          <div className=" p-4 rounded-lg border border-foreground">
            <div className="text-sm text-gray-500">Daily Medications</div>
            <div className="text-2xl font-bold text-gray-900">
              {
                medications.filter((med) =>
                  med.frequency.toLowerCase().includes("daily")
                ).length
              }
            </div>
          </div>
          <div className=" p-4 rounded-lg border border-foreground">
            <div className="text-sm text-gray-500">As-Needed Medications</div>
            <div className="text-2xl font-bold text-gray-900">
              {
                medications.filter((med) =>
                  med.frequency.toLowerCase().includes("as needed")
                ).length
              }
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-y-4 justify-between items-center mb-4">
        <div className="flex items-center">
          <label
            htmlFor="filterMeds"
            className="mr-2 text-sm font-medium text-gray-700"
          >
            Filter:
          </label>
          <select
            id="filterMeds"
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
            className="p-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Medications</option>
            <option value="effective">Most Effective</option>
            <option value="ineffective">Least Effective</option>
            <option value="daily">Daily Medications</option>
            <option value="asneeded">As-Needed Medications</option>
          </select>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 cursor-pointer"
        >
          {showAddForm ? (
            <X className="h-4 w-4 mr-2" />
          ) : (
            <PlusCircle className="h-4 w-4 mr-2" />
          )}

          {showAddForm ? "Cancel" : "Add Medication"}
        </button>
      </div>

      {/* Add Medication Form */}
      {showAddForm && (
        <div className=" p-4 rounded-lg mb-6 border border-gray-200">
          <h3 className="text-lg font-medium mb-4">
            {editingId ? "Edit Medication" : "Add New Medication"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medication Name*
              </label>
              <input
                type="text"
                name="name"
                value={newMedication.name}
                onChange={handleInputChange}
                placeholder="e.g., Hydroxyurea"
                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Frequency*
              </label>
              <input
                type="text"
                name="frequency"
                value={newMedication.frequency}
                onChange={handleInputChange}
                placeholder="e.g., Daily, Twice daily, As needed"
                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosage*
              </label>
              <input
                type="text"
                name="dosage"
                value={newMedication.dosage}
                onChange={handleInputChange}
                placeholder="e.g., 500mg"
                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Side Effects (if any)
              </label>
              <input
                type="text"
                name="sideEffects"
                value={newMedication.sideEffects}
                onChange={handleInputChange}
                placeholder="e.g., Nausea, Dizziness"
                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Effectiveness Rating
                </label>
                <button
                  type="button"
                  className="text-blue-600 text-xs flex items-center"
                  onClick={() =>
                    setShowEffectivenessGuide(!showEffectivenessGuide)
                  }
                >
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {showEffectivenessGuide
                    ? "Hide guide"
                    : "What does this mean?"}
                </button>
              </div>
              {showEffectivenessGuide && (
                <div className="bg-blue-50 p-2 mb-2 rounded text-xs text-blue-800">
                  <p>
                    <strong>1 star:</strong> Not effective at all
                  </p>
                  <p>
                    <strong>2 stars:</strong> Slightly effective
                  </p>
                  <p>
                    <strong>3 stars:</strong> Moderately effective
                  </p>
                  <p>
                    <strong>4 stars:</strong> Very effective
                  </p>
                  <p>
                    <strong>5 stars:</strong> Extremely effective
                  </p>
                </div>
              )}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleEffectivenessSelect(rating)}
                    className="mr-1"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        rating <= newMedication.effectiveness
                          ? "text-yellow-500 fill-yellow-500"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                value={newMedication.notes}
                onChange={handleInputChange}
                placeholder="Any additional notes about this medication"
                rows={3}
                className="p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="mr-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddMedication}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-400 hover:bg-purple-700"
            >
              {editingId ? "Update Medication" : "Add Medication"}
            </button>
          </div>
        </div>
      )}

      {/* Medications List */}
      {filteredMedications().length === 0 ? (
        <div className="text-center py-8 border border-foreground rounded-lg ">
          <p className="text-gray-500">
            No medications found. Add your medications to track which ones work
            best for you.
          </p>
        </div>
      ) : (
        <div className="mb-20 md:mb-0 grid grid-cols-1 gap-4">
          {filteredMedications().map((med) => (
            <div
              key={med.id}
              className="border border-foreground rounded-lg p-4 bg-white shadow-sm hover:shadow transition"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {med.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{med.frequency}</span>
                    <span className="mx-2">•</span>
                    <span>{med.dosage}</span>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEditMedication(med)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="Edit medication"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteMedication(med.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="Delete medication"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Effectiveness
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < med.effectiveness
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {med.sideEffects && (
                  <div>
                    <div className="text-xs text-gray-500 mb-1">
                      Side Effects
                    </div>
                    <div className="text-sm text-red-600">
                      {med.sideEffects}
                    </div>
                  </div>
                )}
              </div>

              {med.notes && (
                <div className="mt-3 text-sm text-gray-600">
                  <div className="text-xs text-gray-500 mb-1">Notes</div>
                  <p>{med.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
