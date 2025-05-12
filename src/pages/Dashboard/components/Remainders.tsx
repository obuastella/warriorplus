import Calendar from "./Calendar";

export default function Remainders() {
  return (
    <>
      <div className="flex flex-col items-start space-y-6 w-full md:w-[64%] p-2">
        <h1 className="font-bold text-xl">Medication Reminders</h1>
        <Calendar />
      </div>
    </>
  );
}
