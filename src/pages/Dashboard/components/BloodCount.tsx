//@ts-nocheck
import { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { useTrackerStore } from "../../../store/trackerStore";
import useTrackerData from "../../../hooks/useTrackerData";

const BloodCount = forwardRef((props, ref) => {
  const { tracker } = useTrackerStore();
  useTrackerData();

  const [bloodMetrics, setBloodMetrics] = useState<any[]>([]);

  useEffect(() => {
    if (!tracker?.bloodCount || tracker.bloodCount.length === 0) {
      setBloodMetrics([]);
    } else {
      // Use real tracker data if available, or dummy for now
      setBloodMetrics([
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
      ]);
    }
  }, [tracker.bloodCount]);

  const statusColor: any = {
    Low: "text-red-500",
    Normal: "text-green-500",
    High: "text-yellow-500",
  };

  // Allow parent to manually update metrics
  useImperativeHandle(ref, () => (newMetrics: any) => {
    setBloodMetrics(newMetrics);
  });

  return (
    <div className="mt-10 w-full mx-auto space-y-6">
      <h1 className="text-lg font-bold text-gray-800">Blood Count</h1>

      {bloodMetrics.length === 0 ? (
        <div className="text-center text-gray-500 border border-dashed border-gray-300 py-6 rounded-lg">
          No blood count data recorded yet.
        </div>
      ) : (
        <>
          <div className="flex gap-6 justify-end text-sm font-medium text-gray-600">
            <p>Low</p>
            <p>Platelets</p>
            <p>White</p>
          </div>

          {bloodMetrics.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm font-semibold text-gray-700">
                  {item.title}
                </p>
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
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-secondary/70 transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
});

export default BloodCount;
