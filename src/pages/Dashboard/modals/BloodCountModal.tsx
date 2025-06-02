//@ts-nocheck
import { useState } from "react";
import { X } from "lucide-react";
import {
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { auth } from "../../../components/firebase";
import { toast } from "react-toastify";
import { useTrackerStore } from "../../../store/trackerStore";

export default function BloodCountModal({ isOpen, onClose, onSave }: any) {
  const user = auth.currentUser;
  const { setTracker }: any = useTrackerStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const db = getFirestore();

  // Form state for new blood count entry
  const [formData, setFormData] = useState({
    hemoglobin: {
      Low: "Normal",
      Platelets: "Normal",
      White: "Normal",
    },
    iron: {
      Low: "Normal",
      Platelets: "Normal",
      White: "Normal",
    },
    whiteBloodCells: {
      Low: "Normal",
      Platelets: "Normal",
      White: "Normal",
    },
  });

  const handleStatusChange = (metric, category, value) => {
    setFormData({
      ...formData,
      [metric]: {
        ...formData[metric],
        [category]: value,
      },
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error("You must be logged in to save results");
      return;
    }

    setIsSubmitting(true);

    try {
      // Calculate progress values
      const calculateProgress = (values: any) => {
        const statusToValue = { Low: 25, Normal: 75, High: 50 };
        const avg =
          Object.values(values).reduce(
            (sum, status) => sum + statusToValue[status],
            0
          ) / 3;
        return Math.round(avg);
      };

      const updatedMetrics = [
        {
          title: "Hemoglobin",
          values: formData.hemoglobin,
          progress: calculateProgress(formData.hemoglobin),
        },
        {
          title: "Iron",
          values: formData.iron,
          progress: calculateProgress(formData.iron),
        },
        {
          title: "White Blood Cells",
          values: formData.whiteBloodCells,
          progress: calculateProgress(formData.whiteBloodCells),
        },
      ];

      // Reference to user document
      const userDocRef = doc(db, "Users", user.uid);

      // Get current user document to check existing blood count entries
      const userDoc = await getDoc(userDocRef);
      const userData = userDoc.data();
      const existingBloodCount = userData?.bloodCount || [];

      let updatedBloodCount;

      if (existingBloodCount.length > 0) {
        // Update the most recent entry (last in array)
        const mostRecentIndex = existingBloodCount.length - 1;
        const updatedEntry = {
          ...existingBloodCount[mostRecentIndex],
          metrics: updatedMetrics,
          formData: formData,
          updatedAt: new Date().toISOString(),
        };

        // Create new array with updated entry
        updatedBloodCount = [...existingBloodCount];
        updatedBloodCount[mostRecentIndex] = updatedEntry;

        // Update the entire bloodCount array
        await updateDoc(userDocRef, {
          bloodCount: updatedBloodCount,
          lastUpdated: new Date().toISOString(),
        });

        toast.success("Blood count results updated successfully!");
      } else {
        // No existing entries, create a new one
        const bloodCountEntry = {
          id: Date.now().toString(),
          metrics: updatedMetrics,
          formData: formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await updateDoc(userDocRef, {
          bloodCount: arrayUnion(bloodCountEntry),
          lastUpdated: new Date().toISOString(),
        });

        toast.success("Blood count results saved successfully!");
      }

      // Update tracker after successful database operation (for both cases)
      const trackerRef = doc(db, "Users", user.uid, "tracker", "data");
      await updateDoc(trackerRef, { bloodCount: "Recorded" });

      setTracker((prev: any) => ({
        // ...prev,
        bloodCount: "Recorded",
      }));

      // Call the onSave callback for local state update
      onSave(updatedMetrics);
      onClose();

      // Reset form data
      setFormData({
        hemoglobin: {
          Low: "Normal",
          Platelets: "Normal",
          White: "Normal",
        },
        iron: {
          Low: "Normal",
          Platelets: "Normal",
          White: "Normal",
        },
        whiteBloodCells: {
          Low: "Normal",
          Platelets: "Normal",
          White: "Normal",
        },
      });
    } catch (error) {
      console.error("Error saving blood count:", error);
      onClose();

      // toast.error("Failed to save blood count results. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const StatusSelector = ({ label, metric, category }: any) => {
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">{label}</span>
        <select
          value={formData[metric][category]}
          onChange={(e) => handleStatusChange(metric, category, e.target.value)}
          className="px-2 py-1 text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isSubmitting}
        >
          <option value="Low">Low</option>
          <option value="Normal">Normal</option>
          <option value="High">High</option>
        </select>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">
            Enter Your Blood Count Results
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Enter your results from a doctor for us to keep track of your blood
          count.
        </p>

        <div className="space-y-6">
          {/* Hemoglobin */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Hemoglobin</h4>
            <div className="flex justify-between">
              <StatusSelector label="Low" metric="hemoglobin" category="Low" />
              <StatusSelector
                label="Platelets"
                metric="hemoglobin"
                category="Platelets"
              />
              <StatusSelector
                label="White"
                metric="hemoglobin"
                category="White"
              />
            </div>
          </div>

          {/* Iron */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">Iron</h4>
            <div className="flex justify-between">
              <StatusSelector label="Low" metric="iron" category="Low" />
              <StatusSelector
                label="Platelets"
                metric="iron"
                category="Platelets"
              />
              <StatusSelector label="White" metric="iron" category="White" />
            </div>
          </div>

          {/* White Blood Cells */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800">White Blood Cells</h4>
            <div className="flex justify-between">
              <StatusSelector
                label="Low"
                metric="whiteBloodCells"
                category="Low"
              />
              <StatusSelector
                label="Platelets"
                metric="whiteBloodCells"
                category="Platelets"
              />
              <StatusSelector
                label="White"
                metric="whiteBloodCells"
                category="White"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting || !user}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                "Save Results"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
