"use client";

import {
  Circle,
  Laptop,
  LucideIcon,
  MonitorSmartphone,
  Tablet,
} from "lucide-react";

// Sample data for device mode distribution
const deviceModeData = {
  total: 27845,
  modes: [
    {
      name: "Kiosk Mode",
      count: 18645,
      percentage: 67,
      icon: MonitorSmartphone,
      color: "bg-blue-500",
    },
    {
      name: "Active Regular Mode",
      count: 7432,
      percentage: 27,
      icon: Tablet,
      color: "bg-green-500",
    },
    {
      name: "Limited Mode",
      count: 1212,
      percentage: 4,
      icon: Laptop,
      color: "bg-amber-500",
    },
    {
      name: "Unknown",
      count: 556,
      percentage: 2,
      icon: Circle,
      color: "bg-gray-500",
    },
  ],
  weeklyChange: +3.2, // Percentage increase in kiosk mode devices from last week
  insights: [
    "67% of all enrolled devices are running in kiosk mode",
    "Limited mode usage decreased by 1.8% compared to last month",
    "Active Regular Mode increased slightly by 0.5% this week",
  ],
};

type ModeCardProps = {
  name: string;
  count: number;
  percentage: number;
  Icon: LucideIcon;
  color: string;
};

function ModeCard({ name, count, percentage, Icon, color }: ModeCardProps) {
  return (
    <div className="flex items-center rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50">
      <div
        className={`rounded-full p-2 ${color} mr-4 bg-opacity-20 dark:bg-opacity-10`}
      >
        <Icon className={`h-6 w-6 ${color.replace("bg-", "text-")}`} />
      </div>
      <div className="flex-1">
        <h5 className="font-medium">{name}</h5>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{percentage}%</span>
          <span className="text-sm text-muted-foreground">
            {count.toLocaleString()} devices
          </span>
        </div>
      </div>
    </div>
  );
}

export default function DeviceModeDistribution() {
  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="text-lg font-semibold">Device Mode Distribution</h4>
        <p className="text-sm text-muted-foreground">
          Distribution of {deviceModeData.total.toLocaleString()} enrolled
          devices by operating mode
        </p>
      </div>

      {/* Donut chart placeholder - replace with VisActor chart */}
      <div className="my-6 flex justify-center">
        <div className="relative h-48 w-48">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold">
                {deviceModeData.modes[0].percentage}%
              </p>
              <p className="text-sm text-muted-foreground">Kiosk Mode</p>
            </div>
          </div>
          <svg className="h-full w-full" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth="15"
            />

            {/* Stroke dasharray uses the formula: circumference * percentage / 100 */}
            {/* Stroke dashoffset moves the start position of the dash */}
            {/* We draw arcs from largest to smallest for better visualization */}

            {/* Kiosk Mode - Blue */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="15"
              strokeDasharray={`${deviceModeData.modes[0].percentage * 2.51} ${100 * 2.51}`}
              strokeDashoffset="0"
              transform="rotate(-90 50 50)"
            />

            {/* Active Regular Mode - Green */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth="15"
              strokeDasharray={`${deviceModeData.modes[1].percentage * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`${-deviceModeData.modes[0].percentage * 2.51}`}
              transform="rotate(-90 50 50)"
            />

            {/* Limited Mode - Amber */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#f59e0b"
              strokeWidth="15"
              strokeDasharray={`${deviceModeData.modes[2].percentage * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`${-(deviceModeData.modes[0].percentage + deviceModeData.modes[1].percentage) * 2.51}`}
              transform="rotate(-90 50 50)"
            />

            {/* Unknown - Gray */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="transparent"
              stroke="#9ca3af"
              strokeWidth="15"
              strokeDasharray={`${deviceModeData.modes[3].percentage * 2.51} ${100 * 2.51}`}
              strokeDashoffset={`${-(deviceModeData.modes[0].percentage + deviceModeData.modes[1].percentage + deviceModeData.modes[2].percentage) * 2.51}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>
      </div>

      {/* Device mode cards */}
      <div className="mt-6 space-y-3">
        {deviceModeData.modes.map((mode) => (
          <ModeCard
            key={mode.name}
            name={mode.name}
            count={mode.count}
            percentage={mode.percentage}
            Icon={mode.icon}
            color={mode.color}
          />
        ))}
      </div>

      {/* Weekly change indicator */}
      <div className="mt-6 rounded-lg border p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Weekly Kiosk Mode Trend</span>
          <div
            className={`text-sm font-medium ${deviceModeData.weeklyChange > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {deviceModeData.weeklyChange > 0 ? "↑" : "↓"}{" "}
            {Math.abs(deviceModeData.weeklyChange)}%
          </div>
        </div>
      </div>
    </div>
  );
}
