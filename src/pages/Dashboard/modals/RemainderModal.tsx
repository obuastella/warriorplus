// components/ReminderModal.tsx
import React from "react";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string) => void;
  initialValue?: string;
  title: string;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValue = "",
  title,
}) => {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue); // Reset when opening
  }, [initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full border rounded p-2 min-h-[100px]"
          placeholder="Enter reminder..."
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(value)}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
