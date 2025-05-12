import { CalendarDays, NotebookPen, Smile } from "lucide-react";
import useUserStatistics from "../../../hooks/useUserStatistics";
import { useUserStore } from "../../../store/userStore";

export default function Statistics() {
  const statistics = useUserStore((state) => state.statistics);

  useUserStatistics();
  const Statistics = [
    {
      title: "Pain Journal",
      icon: <NotebookPen size={20} color="white" />,
      entries: `${statistics.painJournalEntries} entries`,
    },
    {
      title: "Remainders",
      icon: <CalendarDays size={20} color="white" />,
      entries: `${statistics.remindersCount}`,
    },
    {
      title: "Pain Crisis",
      icon: <Smile size={20} color="white" />,
      entries: statistics.painCrisisLevel,
    },
  ];
  return (
    <div className="gap-y-6 w-full flex md:flex-row flex-col flex-wrap justify-between items-center">
      {Statistics.map((stats, index) => (
        <div
          key={index}
          className="shadow-sm rounded-sm flex flex-col gap-y-1 justify-center items-center w-full  md:w-[32%] bg-white h-[200px]"
        >
          <div
            className={`rounded-sm flex justify-center items-center w-10 h-10  ${
              stats.title === "Pain Journal"
                ? "bg-blue-700"
                : stats.title === "Remainders"
                ? "bg-secondary/60"
                : stats.title === "Pain Crisis"
                ? "bg-purple-600"
                : ""
            }`}
          >
            {stats.icon}
          </div>
          <h2 className="text-lg">{stats.title}</h2>
          <p className="font-bold text-lg">{stats.entries}</p>
        </div>
      ))}
    </div>
  );
}
