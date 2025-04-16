import { Info, ShieldAlert, Users } from "lucide-react";

export default function HydrationTracker() {
  const tracker = [
    {
      title: "Emergency SOS",
      icon: <ShieldAlert color="white" />,
      status: "Activated",
    },
    {
      title: "Community",
      icon: <Info color="white" />,
      status: "Joined",
    },
    {
      title: "Blood Count",
      icon: <Users color="white" />,
      status: "Recorded",
    },
  ];

  return (
    <div className="w-full md:w-[30%] p-6 rounded-xl mb-8 md:mb-0">
      <h1 className="font-bold text-xl"> Tracker</h1>
      {tracker.map((track, id) => (
        <div key={id} className="mt-6 space-y-4 flex gap-x-4 gap-y-12">
          <div className="flex justify-center items-center p-2.5 w-16 h-16 bg-primary rounded-sm">
            {track.icon}
          </div>
          <div>
            <h2 className="">{track.title}</h2>
            <p className="font-bold text-xl">{track.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
