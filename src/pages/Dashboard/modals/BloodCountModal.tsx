//@ts-nocheck
import { useState } from "react";
import { X } from "lucide-react";

// Create a new component for the modal
export default function BloodCountModal({ isOpen, onClose, onSave }: any) {
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

  const handleSubmit = () => {
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

    onSave(updatedMetrics);
  };

  const StatusSelector = ({ label, metric, category }: any) => {
    return (
      <div className="flex flex-col items-center">
        <span className="text-xs text-gray-500 mb-1">{label}</span>
        <select
          value={formData[metric][category]}
          onChange={(e) => handleStatusChange(metric, category, e.target.value)}
          className="px-2 py-1 text-sm border border-gray-500 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
            >
              Save Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
