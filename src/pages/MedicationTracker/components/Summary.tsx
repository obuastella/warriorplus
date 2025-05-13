export default function Summary({ medications }: { medications: any[] }) {
  const totalMeds = medications.length;
  const dailyMeds = medications.filter((m) =>
    m.frequency?.toLowerCase().includes("daily")
  ).length;
  const asNeededMeds = medications.filter((m) =>
    m.frequency?.toLowerCase().includes("as needed")
  ).length;

  return (
    <div className=" mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-foreground">
          <div className="text-sm text-gray-500">Total Medications</div>
          <div className="text-2xl font-bold text-gray-900">{totalMeds}</div>
        </div>
        <div className=" p-4 rounded-lg border border-foreground">
          <div className="text-sm text-gray-500">Daily Medications</div>
          <div className="text-2xl font-bold text-gray-900">{dailyMeds}</div>
        </div>
        <div className=" p-4 rounded-lg border border-foreground">
          <div className="text-sm text-gray-500">As-Needed Medications</div>
          <div className="text-2xl font-bold text-gray-900">{asNeededMeds}</div>
        </div>
      </div>
    </div>
  );
}
