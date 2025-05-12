"use client";

import { AlertTriangle, FileWarning, XCircle } from "lucide-react";

// Sample data for enrollment errors
const enrollmentErrorsData = {
  totalErrors: 427,
  byType: [
    {
      type: "Enrollment Failures",
      count: 156,
      percentage: 36.5,
      icon: XCircle,
    },
    {
      type: "Permission Issues",
      count: 187,
      percentage: 43.8,
      icon: AlertTriangle,
    },
    {
      type: "Transition Failures",
      count: 84,
      percentage: 19.7,
      icon: FileWarning,
    },
  ],
  trend: [
    { date: "2025-05-03", count: 42 },
    { date: "2025-05-04", count: 38 },
    { date: "2025-05-05", count: 32 },
    { date: "2025-05-06", count: 36 },
    { date: "2025-05-07", count: 28 },
    { date: "2025-05-08", count: 242 },
    { date: "2025-05-09", count: 21 },
  ],
};

export default function KnoxEnrollmentErrors() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Knox Enrollment Errors</h4>
        <p className="text-sm text-muted-foreground">
          Total of {enrollmentErrorsData.totalErrors} errors in the last 7 days
        </p>
      </div>

      {/* Error breakdown */}
      <div className="space-y-4">
        {enrollmentErrorsData.byType.map((error) => {
          const Icon = error.icon;
          return (
            <div
              key={error.type}
              className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
            >
              <div className="mb-2 flex justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-red-500" />
                  <span className="font-medium">{error.type}</span>
                </div>
                <span className="text-sm">
                  {error.count} ({error.percentage}%)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-2.5 rounded-full bg-red-500"
                  style={{ width: `${error.percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error trend placeholder - replace with VisActor line chart */}
      <div className="mt-6">
        <h5 className="mb-4 text-sm font-medium">Error Trend (Last 7 Days)</h5>
        <div className="flex h-32 items-end justify-between gap-1">
          {enrollmentErrorsData.trend.map((day) => {
            const height =
              (day.count /
                Math.max(...enrollmentErrorsData.trend.map((d) => d.count))) *
              100;
            return (
              <div key={day.date} className="flex flex-1 flex-col items-center">
                <div
                  className="w-full rounded-t bg-red-500"
                  style={{ height: `${height}%` }}
                ></div>
                <span className="mt-1 text-xs">{day.date.split("-")[2]}</span>
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Day of Month
        </p>
      </div>

      {/* Insight card */}
      <div className="mt-6 rounded-lg border p-4">
        <h5 className="mb-2 flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4 text-yellow-500" />
          Insight
        </h5>
        <p className="text-sm text-muted-foreground">
          Permission-related issues account for the highest percentage of
          errors. Consider revising the permission request flow to improve user
          experience.
        </p>
      </div>
    </div>
  );
}
