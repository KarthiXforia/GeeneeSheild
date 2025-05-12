"use client";

import { ChevronRight } from "lucide-react";

// Sample data for enrollment funnel
const enrollmentFunnelData = {
  stages: [
    { name: "Enrollment Started", count: 28746, percentage: 100 },
    { name: "Knox MDM Installed", count: 26932, percentage: 93.7 },
    { name: "Permissions Granted", count: 24315, percentage: 84.6 },
    { name: "Activation Completed", count: 23456, percentage: 81.6 },
    { name: "Kiosk Mode Set Up", count: 18645, percentage: 64.9 },
  ],
  dropOffs: [
    { stage: "Enrollment to Knox MDM", count: 1814, percentage: 6.3 },
    { stage: "Knox MDM to Permissions", count: 2617, percentage: 9.1 },
    { stage: "Permissions to Activation", count: 859, percentage: 3.0 },
    { stage: "Activation to Kiosk Mode", count: 4811, percentage: 16.7 },
  ],
};

export default function EnrollmentFunnel() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Enrollment Flow Funnel</h4>
        <p className="text-sm text-muted-foreground">
          Tracking the device journey from enrollment to kiosk mode setup
        </p>
      </div>

      {/* Funnel visualization */}
      <div className="mb-8 space-y-2">
        {enrollmentFunnelData.stages.map((stage, index) => {
          // Calculate width based on percentage, but min width of 30%
          const width = Math.max(30, stage.percentage);
          return (
            <div key={stage.name} className="w-full">
              <div className="mb-1 flex items-center">
                <span className="flex-1 text-sm font-medium">{stage.name}</span>
                <span className="text-sm">
                  {stage.count.toLocaleString()} ({stage.percentage}%)
                </span>
              </div>
              <div className="relative h-10 w-full overflow-hidden rounded-md bg-gray-100 dark:bg-gray-800">
                <div
                  className={`h-full ${index === 0 ? "bg-green-500" : index === enrollmentFunnelData.stages.length - 1 ? "bg-blue-500" : "bg-teal-500"}`}
                  style={{ width: `${width}%` }}
                ></div>
              </div>

              {/* Drop-off indicator */}
              {index < enrollmentFunnelData.stages.length - 1 && (
                <div className="flex items-center py-1 pl-4 text-xs text-muted-foreground">
                  <ChevronRight className="mr-1 h-3 w-3" />
                  <span>
                    Drop-off:{" "}
                    {enrollmentFunnelData.dropOffs[
                      index
                    ].count.toLocaleString()}{" "}
                    ({enrollmentFunnelData.dropOffs[index].percentage}%)
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Insights section */}
      <div className="mt-8 space-y-4">
        <h5 className="font-medium">Key Insights</h5>

        <div className="rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
          <h6 className="mb-1 font-medium text-blue-700 dark:text-blue-300">
            Highest Drop-off Point
          </h6>
          <p className="text-sm text-muted-foreground">
            The transition from Activation to Kiosk Mode setup shows the highest
            drop-off at 16.7%. Consider simplifying the kiosk mode setup
            process.
          </p>
        </div>

        <div className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <h6 className="mb-1 font-medium text-green-700 dark:text-green-300">
            Best Performing Stage
          </h6>
          <p className="text-sm text-muted-foreground">
            The activation completion rate from permission stage is the
            strongest at 97%, indicating a smooth activation process once
            permissions are granted.
          </p>
        </div>
      </div>
    </div>
  );
}
