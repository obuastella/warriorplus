import { BookHeart, NotebookPen, Smile } from "lucide-react";

export default function Statistics() {
  const Statistics = [
    {
      title: "Pain Journal",
      icon: <NotebookPen size={20} color="white" />,
      entries: "8,200",
    },
    {
      title: "Mood Tracker",
      icon: <BookHeart size={20} color="white" />,
      entries: "Positive",
    },
    {
      title: "Pain Crisis",
      icon: <Smile size={20} color="white" />,
      entries: "Severe",
    },
  ];
  return (
    <div className="w-full flex md:flex-row flex-col flex-wrap justify-between items-center">
      {Statistics.map((stats, index) => (
        <div
          key={index}
          className="shadow-sm rounded-sm flex flex-col gap-y-1 justify-center items-center md:w-[32%] bg-[#f5f5f5] h-[200px]"
        >
          <div className="rounded-sm flex justify-center items-center w-10 h-10 bg-primary">
            {stats.icon}
          </div>
          <h2 className="text-lg">{stats.title}</h2>
          <p className="font-bold text-lg">{stats.entries}</p>
        </div>
      ))}
    </div>
  );
}
