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
import Summary from "./components/Summary";
import { auth, db } from "../../components/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default function MedicationTracker() {
  const [medications, setMedications] = useState<any>([]);
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMedications = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const medsRef = collection(db, "Users", user.uid, "medications");
        const snapshot = await getDocs(medsRef);
        const data: any = snapshot.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMedications(data);
      } catch (err) {
        console.error("Error fetching medications:", err);
      }
    };

    fetchMedications();
  }, []);
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewMedication((prev) => ({ ...prev, [name]: value }));
  };

  const handleEffectivenessSelect = (rating: any) => {
    setNewMedication((prev) => ({ ...prev, effectiveness: rating }));
  };

  const handleAddMedication = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("User not authenticated.");
      return;
    }

    const { name, frequency, dosage, effectiveness, sideEffects } =
      newMedication;

    if (!name || !frequency || !dosage) {
      toast.warning("Please fill in required fields");
      return;
    }

    const medicationsRef = collection(db, "Users", user.uid, "medications");

    try {
      if (editingId) {
        setIsLoading(true);

        const medDocRef = doc(medicationsRef, editingId);
        const originalMedSnapshot = await getDoc(medDocRef);

        if (!originalMedSnapshot.exists()) {
          toast.error("Original medication not found.");
          setIsLoading(false);
          return;
        }

        const originalMed = originalMedSnapshot.data();

        // Update user's medication
        await updateDoc(medDocRef, newMedication);

        // Update local state
        setMedications((prev: any) =>
          prev.map((med: any) =>
            med.id === editingId ? { ...newMedication, id: editingId } : med
          )
        );

        if (originalMed.name !== newMedication.name) {
          // ↓ Decrement old stats
          await decrementGlobalMedicationStats(
            originalMed.name,
            originalMed.effectiveness,
            originalMed.sideEffects
          );

          // ↑ Increment new stats
          await updateGlobalMedicationStats(
            newMedication.name,
            newMedication.effectiveness,
            newMedication.sideEffects
          );
        } else {
          // Normal update
          await updateGlobalMedicationStatsOnEdit(
            newMedication.name,
            originalMed.effectiveness,
            newMedication.effectiveness,
            originalMed.sideEffects,
            newMedication.sideEffects
          );
        }

        toast.success("Medication updated!");
        setIsLoading(false);
        setEditingId(null);
      } else {
        setIsLoading(true);

        // Add new medication to user's personal collection
        const docRef = await addDoc(medicationsRef, {
          ...newMedication,
          createdAt: new Date(),
          userId: user.uid,
        });

        // Update local state with Firestore-generated ID
        setMedications((prev: any) => [
          ...prev,
          { ...newMedication, id: docRef.id },
        ]);

        // Update global medication tracking
        await updateGlobalMedicationStats(name, effectiveness, sideEffects);

        // Update admin stats
        const adminStats = doc(db, "Admin", "stats");
        await updateDoc(adminStats, {
          medicationsRecorded: increment(1),
        });

        toast.success("Medication added!");
        setIsLoading(false);
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
    } catch (error) {
      console.error("Error saving medication:", error);
      toast.error("Something went wrong.");
      setIsLoading(false);
    }
  };

  // Helper function to update global medication statistics
  const updateGlobalMedicationStats = async (
    medicationName,
    effectiveness,
    sideEffects
  ) => {
    const globalMedRef = doc(
      db,
      "GlobalMedications",
      medicationName.toLowerCase().replace(/\s+/g, "-")
    );

    try {
      const medDoc = await getDoc(globalMedRef);

      if (medDoc.exists()) {
        // Update existing medication stats
        const currentData = medDoc.data();
        const newPatientCount = currentData.patientCount + 1;
        const newTotalEfficacy =
          currentData.totalEfficacy + (effectiveness || 0);
        const newAvgEfficacy = Math.round(newTotalEfficacy / newPatientCount);

        // Count side effects (assuming sideEffects is a string, count if not empty)
        const hasSideEffects = sideEffects && sideEffects.trim() !== "";
        const newSideEffectCount =
          currentData.sideEffectCount + (hasSideEffects ? 1 : 0);
        const newSideEffectPercentage = Math.round(
          (newSideEffectCount / newPatientCount) * 100
        );

        await updateDoc(globalMedRef, {
          patientCount: newPatientCount,
          totalEfficacy: newTotalEfficacy,
          avgEfficacy: newAvgEfficacy,
          sideEffectCount: newSideEffectCount,
          sideEffectPercentage: newSideEffectPercentage,
          lastUpdated: new Date(),
        });
      } else {
        // Create new medication entry
        const hasSideEffects = sideEffects && sideEffects.trim() !== "";
        await setDoc(globalMedRef, {
          name: medicationName,
          patientCount: 1,
          totalEfficacy: effectiveness || 0,
          avgEfficacy: effectiveness || 0,
          sideEffectCount: hasSideEffects ? 1 : 0,
          sideEffectPercentage: hasSideEffects ? 100 : 0,
          createdAt: new Date(),
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      console.error("Error updating global medication stats:", error);
    }
  };
  // end added
  const decrementGlobalMedicationStats = async (
    medicationName,
    effectiveness,
    sideEffects
  ) => {
    const globalMedRef = doc(
      db,
      "GlobalMedications",
      medicationName.toLowerCase().replace(/\s+/g, "-")
    );

    try {
      const medDoc = await getDoc(globalMedRef);
      if (!medDoc.exists()) return;

      const data = medDoc.data();
      const updatedPatientCount = data.patientCount - 1;
      const updatedTotalEfficacy = data.totalEfficacy - (effectiveness || 0);

      const hadSideEffects = sideEffects && sideEffects.trim() !== "";
      const updatedSideEffectCount =
        data.sideEffectCount - (hadSideEffects ? 1 : 0);

      // Delete the global record if no more patients
      if (updatedPatientCount <= 0) {
        await deleteDoc(globalMedRef);
      } else {
        const avgEfficacy = Math.round(
          updatedTotalEfficacy / updatedPatientCount
        );
        const sideEffectPercentage = Math.round(
          (updatedSideEffectCount / updatedPatientCount) * 100
        );

        await updateDoc(globalMedRef, {
          patientCount: updatedPatientCount,
          totalEfficacy: updatedTotalEfficacy,
          avgEfficacy,
          sideEffectCount: updatedSideEffectCount,
          sideEffectPercentage,
          lastUpdated: new Date(),
        });
      }
    } catch (error) {
      console.error("Error decrementing global stats:", error);
    }
  };

  const handleEditMedication = (med: any) => {
    setNewMedication(med);
    setEditingId(med.id);
    setShowAddForm(true);
  };
  const updateGlobalMedicationStatsOnEdit = async (
    medicationName,
    oldEffectiveness,
    newEffectiveness,
    oldSideEffects,
    newSideEffects
  ) => {
    const globalMedRef = doc(
      db,
      "GlobalMedications",
      medicationName.toLowerCase().replace(/\s+/g, "-")
    );

    try {
      const medDoc = await getDoc(globalMedRef);

      if (!medDoc.exists()) return;

      const currentData = medDoc.data();
      const sideEffectsRemoved =
        oldSideEffects && oldSideEffects.trim() !== "" ? 1 : 0;
      const sideEffectsAdded =
        newSideEffects && newSideEffects.trim() !== "" ? 1 : 0;

      // Adjust totals
      const updatedTotalEfficacy =
        currentData.totalEfficacy -
        (oldEffectiveness || 0) +
        (newEffectiveness || 0);

      const updatedSideEffectCount =
        currentData.sideEffectCount - sideEffectsRemoved + sideEffectsAdded;

      const avgEfficacy = Math.round(
        updatedTotalEfficacy / currentData.patientCount
      );

      const sideEffectPercentage = Math.round(
        (updatedSideEffectCount / currentData.patientCount) * 100
      );

      await updateDoc(globalMedRef, {
        totalEfficacy: updatedTotalEfficacy,
        avgEfficacy,
        sideEffectCount: updatedSideEffectCount,
        sideEffectPercentage,
        lastUpdated: new Date(),
      });
    } catch (error) {
      console.error("Error updating global stats on edit:", error);
    }
  };

  const handleDeleteMedication = async (id: string) => {
    setIsLoading(true);

    if (!confirm("Are you sure you want to remove this medication?")) return;

    const user = auth.currentUser;
    if (!user) return;

    try {
      const medRef = doc(db, "Users", user.uid, "medications", id);
      const medSnap = await getDoc(medRef);

      if (!medSnap.exists()) {
        console.warn("Medication not found.");
        setIsLoading(false);
        return;
      }

      const medicationData = medSnap.data();
      const { name, effectiveness, sideEffects } = medicationData;

      // Update global medication stats
      const globalMedRef = doc(
        db,
        "GlobalMedications",
        name.toLowerCase().replace(/\s+/g, "-")
      );
      const globalMedSnap = await getDoc(globalMedRef);

      if (globalMedSnap.exists()) {
        const globalData = globalMedSnap.data();
        const newPatientCount = globalData.patientCount - 1;
        const newTotalEfficacy =
          globalData.totalEfficacy - (effectiveness || 0);
        const hadSideEffects = sideEffects && sideEffects.trim() !== "";
        const newSideEffectCount =
          globalData.sideEffectCount - (hadSideEffects ? 1 : 0);

        if (newPatientCount <= 0) {
          // If no more patients, delete the global record
          await deleteDoc(globalMedRef);
        } else {
          const newAvgEfficacy = Math.round(newTotalEfficacy / newPatientCount);
          const newSideEffectPercentage = Math.round(
            (newSideEffectCount / newPatientCount) * 100
          );

          await updateDoc(globalMedRef, {
            patientCount: newPatientCount,
            totalEfficacy: newTotalEfficacy,
            avgEfficacy: newAvgEfficacy,
            sideEffectCount: newSideEffectCount,
            sideEffectPercentage: newSideEffectPercentage,
            lastUpdated: new Date(),
          });
        }
      }

      // Delete medication from user's personal list
      await deleteDoc(medRef);

      // Update local state
      setMedications((prev: any) => prev.filter((med: any) => med.id !== id));

      // Update admin stats
      const adminStats = doc(db, "Admin", "stats");
      await updateDoc(adminStats, {
        medicationsRecorded: increment(-1),
      });

      toast.success("Medication deleted.");
    } catch (error) {
      console.error("Failed to delete medication:", error);
      toast.error("An error occurred while deleting the medication.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMedications = () => {
    switch (filterOption) {
      case "effective":
        return medications.filter((med: any) => med.effectiveness >= 4);
      case "ineffective":
        return medications.filter((med: any) => med.effectiveness <= 2);
      case "daily":
        return medications.filter((med: any) =>
          med.frequency.toLowerCase().includes("daily")
        );
      case "asneeded":
        return medications.filter((med: any) =>
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
      <Summary medications={medications} />

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
              disabled={isLoading}
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
          {filteredMedications().map((med: any) => (
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
                    disabled={isLoading}
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
