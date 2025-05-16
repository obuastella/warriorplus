import { useState } from "react";
import { Info, ShieldAlert, Users, Pencil } from "lucide-react";
import BloodCountModal from "../modals/BloodCountModal";
import { useNavigate } from "react-router-dom";
import { useTrackerStore } from "../../../store/trackerStore";
import useTrackerData from "../../../hooks/useTrackerData";

export default function HydrationTracker({ onBloodCountUpdate }: any) {
  const { tracker } = useTrackerStore();
  useTrackerData();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const Tracker = [
    {
      title: "Community",
      icon: <Info color="white" />,
      status: tracker.community,
    },
    {
      title: "Blood Count",
      icon: <Users color="white" />,
      status:
        tracker && Array.isArray(tracker.bloodCount)
          ? tracker.bloodCount.length === 0
            ? "None"
            : "Registered"
          : "None",
    },
  ];
  const handleEmergency = () => {
    navigate("/sos");
  };
  const handleSaveBloodCount = (updatedMetrics: any) => {
    // Pass the updated metrics to the parent component
    onBloodCountUpdate(updatedMetrics);
    setShowModal(false);
  };

  return (
    <div className="w-full md:w-[35%] p-6 rounded-xl mb-8 md:mb-0">
      <h1 className="font-bold text-xl"> Tracker</h1>
      <div className="mt-6 space-y-4 flex gap-x-4 gap-y-12">
        <div
          className={`flex justify-center items-center p-2.5 w-16 h-16 rounded-sm bg-blue-400`}
        >
          <ShieldAlert color="white" />
        </div>
        <div>
          <h2 className="font-semibold text-base">Emergency SOS</h2>
          <button
            className="rounded-lg bg-secondary/80 text-white text-sm px-5 p-2 cursor-pointer"
            onClick={handleEmergency}
          >
            {tracker.emergencyContact === "None" ? "Set" : "Alert Contacts"}
          </button>
        </div>
      </div>
      {Tracker.map((track, id) => (
        <div key={id} className="mt-6 space-y-4 flex gap-x-4 gap-y-12">
          <div
            className={`flex justify-center items-center p-2.5 w-16 h-16 rounded-sm ${
              track.title === "Emergency SOS"
                ? "bg-secondary/70"
                : track.title === "Community"
                ? "bg-purple-600/70"
                : track.title === "Blood Count"
                ? "bg-blue-700/70"
                : ""
            } `}
          >
            {track.icon}
          </div>
          <div>
            <h2 className="">{track.title}</h2>
            <p className="font-bold text-xl">{track.status}</p>
          </div>
        </div>
      ))}
      <div className="mt-6 space-y-4 flex gap-x-4 gap-y-12">
        <div
          className={`flex justify-center items-center p-2.5 w-16 h-16 rounded-sm bg-blue-400`}
        >
          <Pencil color="white" />
        </div>
        <div>
          <h2 className="font-semibold text-base">Blood Count</h2>
          <button
            className="rounded-lg bg-primary text-white text-sm px-5 p-2 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            {Array.isArray(tracker?.bloodCount) &&
            tracker.bloodCount.length === 0
              ? "Record"
              : "Edit"}
          </button>
        </div>
      </div>

      <BloodCountModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveBloodCount}
      />
    </div>
  );
}
