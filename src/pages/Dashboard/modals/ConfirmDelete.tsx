// components/ConfirmDeleteModal.tsx
import React from "react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDelete: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80">
        <h2 className="text-lg font-semibold mb-4">Delete Reminder?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete this reminder?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
