//@ts-nocheck

import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import { useTrackerStore } from "../../../store/trackerStore";
import useTrackerData from "../../../hooks/useTrackerData";
import { useBloodCount } from "../../../hooks/useBloodCount";

const BloodCount = forwardRef((props, ref) => {
  const { tracker } = useTrackerStore();
  useTrackerData();

  // Use the Firebase hook to get blood count data
  const {
    bloodCount,
    loading: bloodCountLoading,
    hasBloodCount,
    getLatestBloodCount,
  } = useBloodCount();

  const [bloodMetrics, setBloodMetrics] = useState<any[]>([]);

  // Memoize the latest blood count to prevent unnecessary re-renders
  const latestBloodCount = useCallback(() => {
    return hasBloodCount ? getLatestBloodCount() : null;
  }, [hasBloodCount, bloodCount]); // Remove getLatestBloodCount from deps

  useEffect(() => {
    // Priority: Use Firebase data if available, fallback to tracker store
    if (hasBloodCount) {
      const latest = latestBloodCount();
      if (latest && latest.metrics) {
        setBloodMetrics(latest.metrics);
      }
    } else if (tracker?.bloodCount && tracker.bloodCount.length > 0) {
      // Fallback to tracker store data if Firebase data not available
      setBloodMetrics(tracker.bloodCount);
    } else {
      // No data available
      setBloodMetrics([]);
    }
  }, [bloodCount, hasBloodCount, tracker?.bloodCount, latestBloodCount]); // Use latestBloodCount instead of getLatestBloodCount

  const statusColor: any = {
    Low: "text-red-500",
    Normal: "text-green-500",
    High: "text-yellow-500",
  };

  // Allow parent to manually update metrics
  useImperativeHandle(ref, () => ({
    updateMetrics: (newMetrics: any) => {
      setBloodMetrics(newMetrics);
    },
    // Expose the latest blood count data
    getLatestData: () => latestBloodCount(),
    // Expose loading state
    isLoading: () => bloodCountLoading,
  }));

  // Show loading state while fetching data
  if (bloodCountLoading) {
    return (
      <div className="mt-10 w-full mx-auto space-y-6">
        <h1 className="text-lg font-bold text-gray-800">Blood Count</h1>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          <span className="ml-2 text-gray-600">
            Loading blood count data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-gray-800">Blood Count</h1>

        {/* Show last update info if data exists */}
        {hasBloodCount && (
          <div className="text-xs text-gray-500">
            Last updated:{" "}
            {new Date(latestBloodCount()?.updatedAt).toLocaleDateString()}
          </div>
        )}
      </div>

      {bloodMetrics == "None" ? (
        <div className="text-center text-gray-500 border border-dashed border-gray-300 py-6 rounded-lg">
          <div className="space-y-2">
            <p className="font-medium">No blood count data recorded yet.</p>
            <p className="text-sm">
              Use the "Record" button to add your first blood count results.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="flex gap-6 justify-end text-sm font-medium text-gray-600">
            <p>Low</p>
            <p>Platelets</p>
            <p>White</p>
          </div>

          {bloodMetrics &&
            Array.isArray(bloodMetrics) &&
            bloodMetrics.map((item, idx) => (
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
                    className="h-full bg-secondary/70 transition-all duration-300"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}

          {/* Show history count if available */}
          {bloodCount.length > 1 && (
            <div className="text-xs text-gray-500 text-center pt-2">
              {bloodCount.length} blood count records • Showing latest
            </div>
          )}
        </>
      )}
    </div>
  );
});

export default BloodCount;
