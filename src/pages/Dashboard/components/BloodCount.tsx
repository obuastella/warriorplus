export default function BloodCount() {
  const bloodMetrics = [
    {
      title: "Hemoglobin",
      values: {
        Low: "5.6",
        Platelets: "Normal",
        White: "High",
      },
      progress: 35,
    },
    {
      title: "Iron",
      values: {
        Low: "Normal",
        Platelets: "Low",
        White: "Normal",
      },
      progress: 65,
    },
    {
      title: "White Blood Cells",
      values: {
        Low: "High",
        Platelets: "Low",
        White: "High",
      },
      progress: 90,
    },
  ];

  const statusColor: any = {
    Low: "text-red-500",
    Normal: "text-green-500",
    High: "text-yellow-500",
  };

  return (
    <div className="mt-10 w-full  mx-auto space-y-6">
      {/* Header with labels */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Blood Count</h1>
        <div className="flex gap-6 text-sm font-medium text-gray-600">
          <p>Low</p>
          <p>Platelets</p>
          <p>White</p>
        </div>
      </div>

      {/* Blood metrics */}
      {bloodMetrics.map((item, idx) => (
        <div key={idx} className="space-y-2">
          {/* Title */}
          <div className="flex justify-between ">
            <p className="text-sm font-semibold text-gray-700">{item.title}</p>
            {/*  */}
            <div className="flex justify-between gap-x-8 text-sm mt-1">
              <span className={statusColor[item.values.Low]}>
                {item.values.Low}
              </span>
              <span className={statusColor[item.values.Platelets]}>
                {item.values.Platelets}
              </span>
              <span className={statusColor[item.values.White]}>
                {item.values.White}
              </span>
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary/40 transition-all"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
