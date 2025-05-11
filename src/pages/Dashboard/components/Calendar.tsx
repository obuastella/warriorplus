//@ts-nocheck
import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../components/firebase";
import { useReminderStore } from "../../../store/useRemainderStore";

export default function CalendarWithReminders() {
  const user: any = auth.currentUser;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<any>(null);
  const [displayedMonth, setDisplayedMonth] = useState(new Date().getMonth());
  const [displayedYear, setDisplayedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [reminders, setReminders] = useState<any>([]);
  const [currentReminder, setCurrentReminder] = useState<any>({
    id: "",
    title: "",
    description: "",
    date: undefined,
  });
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // Generate list of years for the filter (current year ± 5 years)
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years: any = [];
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
      years.push(i);
    }
    setAvailableYears(years);
  }, []);
  const {
    remindersData,
    fetchReminders,
    addReminder,
    updateReminder,
    deleteReminder,
  } = useReminderStore();

  useEffect(() => {
    if (user) fetchReminders(user.uid);
  }, [user?.uid]);

  const getDaysInMonth = (month: any, year: any) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: any, year: any) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePrevMonth = () => {
    if (displayedMonth === 0) {
      setDisplayedMonth(11);
      setDisplayedYear(displayedYear - 1);
    } else {
      setDisplayedMonth(displayedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (displayedMonth === 11) {
      setDisplayedMonth(0);
      setDisplayedYear(displayedYear + 1);
    } else {
      setDisplayedMonth(displayedMonth + 1);
    }
  };

  const handleYearChange = (e: any) => {
    setDisplayedYear(parseInt(e.target.value));
  };

  const handleDateClick = (day: any) => {
    const clickedDate: any = new Date(displayedYear, displayedMonth, day);
    setSelectedDate(clickedDate);

    setCurrentReminder({
      id: "",
      title: "",
      description: "",
      date: clickedDate,
    });
    setEditMode(false);
    setShowModal(true);
    console.log("Date selected: ", clickedDate);
  };

  const hasReminder = (day: any) => {
    return reminders.some((reminder: any) => {
      const reminderDate = new Date(reminder.date);
      return (
        reminderDate.getDate() === day &&
        reminderDate.getMonth() === displayedMonth &&
        reminderDate.getFullYear() === displayedYear
      );
    });
  };

  const getRemindersForDate = (date: any) => {
    return reminders.filter((reminder: any) => {
      const reminderDate = new Date(reminder.date);
      return (
        reminderDate.getDate() === date.getDate() &&
        reminderDate.getMonth() === date.getMonth() &&
        reminderDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleEditReminder = async (reminderId: any, reminder: any) => {
    const parsedReminder = {
      ...reminder,
      date:
        reminder.date && typeof reminder.date.toDate === "function"
          ? reminder.date.toDate()
          : new Date(reminder.date),
    };

    setCurrentReminder(parsedReminder);
    setEditMode(true);
    setShowModal(true);

    const reminderToEdit: any = reminders.find((r: any) => r.id === reminderId);
    if (reminderToEdit) {
      setCurrentReminder({
        ...reminderToEdit,
        date:
          reminderToEdit.date &&
          typeof reminderToEdit.date.toDate === "function"
            ? reminderToEdit.date.toDate()
            : new Date(reminderToEdit.date),
      });
    }
  };

  const handleDeleteReminder = async (remainderId: any) => {
    const userId = user.uid;
    setIsLoading(true);

    try {
      await deleteReminder(userId, remainderId);
      // Decrement the remindersCount in statistics/summary
      const summaryRef = doc(db, "Users", user.uid, "statistics", "summary");
      await updateDoc(summaryRef, {
        remindersCount: increment(-1),
      });
      console.log("Deleted");
      setReminders(
        reminders.filter((reminder: any) => reminder.id !== remainderId)
      );
      setIsLoading(false);
    } catch (e: any) {
      console.log("An error occurred: ", e);
    }
  };

  const handleSaveReminder = async () => {
    if (!currentReminder.title.trim()) {
      alert("Please enter a reminder title");
      return;
    }
    if (editMode) {
      if (user) {
        setIsLoading(true);
        try {
          await updateReminder(user.uid, currentReminder?.id, {
            title: currentReminder.title,
            description: currentReminder.description,
            date: currentReminder.date,
          });
          setIsLoading(false);
        } catch (e: any) {
          console.log("error occured", e);
        }
      }
    } else {
      try {
        setIsLoading(true);

        await addReminder(user.uid, {
          title: currentReminder.title,
          description: currentReminder.description,
          date: currentReminder.date,
          createdAt: new Date().toISOString(),
        });

        // Increment the remindersCount in statistics/summary
        const summaryRef = doc(db, "Users", user.uid, "statistics", "summary");
        await updateDoc(summaryRef, {
          remindersCount: increment(1),
        });
        setIsLoading(false);
        setShowModal(false);
      } catch (error) {
        console.error("Error saving reminder:", error);
      }
    }
    setShowModal(false);
    setCurrentReminder({ id: null, title: "", description: "", date: null });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(displayedMonth, displayedYear);
    const firstDayOfMonth = getFirstDayOfMonth(displayedMonth, displayedYear);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Add cells for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayedYear, displayedMonth, day);
      const isToday =
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear();

      const isSelected: any =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      const hasReminderForDay = hasReminder(day);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className="p-1 text-center cursor-pointer relative"
        >
          <div
            className={`rounded-full w-8 h-8 mx-auto flex items-center justify-center
            ${isToday ? "bg-blue-500 text-white" : ""}
            ${isSelected ? "border-2 border-blue-600" : ""}
            ${!isToday && !isSelected ? "hover:bg-gray-100" : ""}`}
          >
            {day}
          </div>
          {hasReminderForDay && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></div>
          )}
        </div>
      );
    }

    return days;
  };

  const formatDate = (date: any) => {
    const options = {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  return (
    <div className="w-fit  md:w-full bg-white rounded-lg shadow">
      <div className="grid grid-cols-3">
        {/* Calendar Section */}
        <div className="p-4 w-[280px] md:w-md lg:w-xl xl:w-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold">
                {monthNames[displayedMonth]}
              </h2>
              <select
                value={displayedYear}
                onChange={handleYearChange}
                className="ml-2 p-1 border border-gray-400 rounded"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex">
              <button
                onClick={handlePrevMonth}
                className="p-1 mr-2 rounded-full hover:bg-gray-100"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-gray-500 text-sm p-1">
                {day}
              </div>
            ))}
            {renderCalendarDays()}
          </div>
        </div>
      </div>
      {/* Reminders List Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Reminders</h2>
          <button
            onClick={() => {
              setCurrentReminder({
                id: "",
                title: "",
                description: "",
                date: today,
              });
              setEditMode(false);
              setShowModal(true);
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {remindersData.length === 0 ? (
            <p className="text-gray-500 text-center">No reminders set</p>
          ) : (
            remindersData.map((reminder: any) => (
              <div
                key={reminder.id}
                className="p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{reminder.title}</p>
                    <p className="text-sm text-gray-500">
                      {formatDate(new Date(reminder?.date?.seconds * 1000))}
                    </p>
                    {reminder.description && (
                      <p className="text-sm mt-1">{reminder.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditReminder(reminder.id, reminder)}
                      className="text-gray-500 hover:text-blue-500"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      disabled={isLoading}
                      onClick={() => handleDeleteReminder(reminder.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Reminder Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-primary/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editMode ? "Edit Reminder" : "Add Reminder"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="flex items-center bg-gray-100 p-2 rounded">
                  <Calendar size={18} className="text-gray-500 mr-2" />
                  <span>
                    {currentReminder.date
                      ? currentReminder.date.toDateString()
                      : "Select a date"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={currentReminder.title}
                  onChange={(e) =>
                    setCurrentReminder({
                      ...currentReminder,
                      title: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Reminder title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  value={currentReminder.description}
                  onChange={(e) =>
                    setCurrentReminder({
                      ...currentReminder,
                      description: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                  placeholder="Add details about your reminder"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveReminder}
                  disabled={isLoading}
                  className=" disabled:bg-gray-300 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {isLoading ? "Loading..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
