"use client";

import { Clock, Zap } from "lucide-react";

// Sample data for peak access times
const peakAccessData = {
  times: [
    { hour: 8, count: 1245, percentage: 30 },
    { hour: 9, count: 2341, percentage: 55 },
    { hour: 10, count: 3210, percentage: 75 },
    { hour: 11, count: 4250, percentage: 100 },
    { hour: 12, count: 3976, percentage: 94 },
    { hour: 13, count: 3245, percentage: 76 },
    { hour: 14, count: 2876, percentage: 68 },
    { hour: 15, count: 3654, percentage: 86 },
    { hour: 16, count: 2987, percentage: 70 },
    { hour: 17, count: 2456, percentage: 58 },
    { hour: 18, count: 1542, percentage: 36 },
    { hour: 19, count: 876, percentage: 20 },
  ],
  peak: { hour: 11, count: 4250 },
  insights: [
    "Peak access time is at 11:00 AM with 4,250 access attempts",
    "School hours (9 AM - 3 PM) show highest access activity",
    "Significant drop-off occurs after 5 PM",
  ],
};

export default function PeakAccessTime() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Peak Access Times</h4>
        <p className="text-sm text-muted-foreground">
          Hourly distribution of web access attempts
        </p>
      </div>

      {/* Peak indicator */}
      <div className="mb-6 flex items-center justify-between rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-500" />
          <span className="font-medium">Peak Activity</span>
        </div>
        <div className="text-right">
          <p className="font-bold">{peakAccessData.peak.hour}:00 AM</p>
          <p className="text-sm text-muted-foreground">
            {peakAccessData.peak.count.toLocaleString()} attempts
          </p>
        </div>
      </div>

      {/* Time-based histogram placeholder */}
      <div className="mb-2 flex h-48 items-end gap-1">
        {peakAccessData.times.map((time) => (
          <div key={time.hour} className="flex flex-1 flex-col items-center">
            <div
              className={`w-full rounded-t ${time.hour === peakAccessData.peak.hour ? "bg-amber-500" : "bg-blue-500"}`}
              style={{ height: `${time.percentage}%` }}
            ></div>
          </div>
        ))}
      </div>

      {/* Hour labels */}
      <div className="mb-6 flex gap-1">
        {peakAccessData.times.map((time) => (
          <div key={time.hour} className="flex-1 text-center">
            <div className="flex items-center justify-center">
              <Clock className="mr-1 h-3 w-3" />
              <span className="text-xs">{time.hour}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-6">
        <h5 className="mb-2 text-sm font-medium">Insights</h5>
        <ul className="space-y-2">
          {peakAccessData.insights.map((insight, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-muted-foreground"
            >
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-800 dark:bg-blue-800 dark:text-blue-200">
                {index + 1}
              </span>
              {insight}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
