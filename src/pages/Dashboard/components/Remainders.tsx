import { useState } from "react";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import weekday from "dayjs/plugin/weekday";
import { ConfirmDelete } from "../modals/ConfirmDelete";
import { ReminderModal } from "../modals/RemainderModal";
import BloodCount from "./BloodCount";
dayjs.extend(isToday);
dayjs.extend(weekday);

export default function Remainders() {
  const [reminders, setReminders] = useState<{ [key: string]: string }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"set" | "edit" | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const today = dayjs();
  const startOfWeek = today.startOf("week").add(1, "day");
  const week = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, "day"));

  const openSetModal = () => {
    setModalType("set");
    setShowModal(true);
  };

  const openEditModal = () => {
    setModalType("edit");
    setShowModal(true);
  };

  const handleSave = (note: string) => {
    if (selectedDate) {
      setReminders({ ...reminders, [selectedDate]: note });
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (selectedDate) {
      const updated = { ...reminders };
      delete updated[selectedDate];
      setReminders(updated);
    }
    setShowDeleteModal(false);
  };

  return (
    <>
      <div className="flex flex-col items-start space-y-6 w-full md:w-[65%]  p-6">
        <h1 className="font-bold text-xl">Medication Reminders</h1>

        <div className="flex space-x-3">
          <button
            className="w-20 h-10 border rounded hover:bg-primary hover:text-white"
            onClick={openSetModal}
            disabled={!selectedDate}
          >
            Set
          </button>
          <button
            className="w-20 h-10 border rounded hover:bg-yellow-400"
            onClick={openEditModal}
            disabled={!selectedDate || !reminders[selectedDate]}
          >
            Edit
          </button>
          <button
            className="w-20 h-10 border rounded hover:bg-red-400"
            onClick={() => setShowDeleteModal(true)}
            disabled={!selectedDate || !reminders[selectedDate]}
          >
            Delete
          </button>
        </div>

        <div className="grid grid-cols-7 gap-4 w-full">
          {week.map((day) => {
            const dateStr = day.format("YYYY-MM-DD");
            const isCurrentDay = day.isToday();
            const isSelected = selectedDate === dateStr;

            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`flex flex-col items-center p-2.5 rounded-lg cursor-pointer border ${
                  isCurrentDay ? "bg-secondary/60 text-white" : "bg-gray-100"
                } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
              >
                <div className="text-sm font-medium">{day.format("ddd")}</div>
                <div className="text-xl font-bold">{day.format("D")}</div>
                {reminders[dateStr] && (
                  <div className="mt-1 text-xs text-green-600">💊</div>
                )}
              </div>
            );
          })}
        </div>

        {selectedDate && reminders[selectedDate] && (
          <div className="mt-4 text-sm text-gray-700">
            <strong>Reminder for {selectedDate}:</strong>{" "}
            {reminders[selectedDate]}
          </div>
        )}

        <ReminderModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          title={modalType === "set" ? "Set Reminder" : "Edit Reminder"}
          initialValue={
            modalType === "edit" && selectedDate ? reminders[selectedDate] : ""
          }
        />

        <ConfirmDelete
          isOpen={showDeleteModal}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
        <BloodCount />
      </div>
    </>
  );
}
