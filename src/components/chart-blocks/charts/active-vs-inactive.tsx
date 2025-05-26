"use client";

import { Activity, Tablet } from "lucide-react";
import { useDeviceStore } from "@/store/deviceStore";

// Bar component remains the same
const Bar = ({
  value,
  total,
  color,
}: {
  value: number;
  total: number;
  color: string;
}) => {
  const percentage = (value / total) * 100;
  return (
    <div className="mb-4 h-6 w-full rounded-full bg-gray-100 dark:bg-gray-700">
      <div
        className={`h-6 rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default function ActiveVsInactiveDevices() {
  // Get metrics from Zustand store
  const { metrics } = useDeviceStore();
  const {
    totalDevices = 0,
    kioskModeDevices = 0,
    accessibilityEnabled = 0,
    accessibilityWithKiosk = 0,
  } = metrics || {};

  // Calculate active/inactive devices
  // Note: Since we don't have direct active devices count, we'll need to make an assumption
  // or adjust this based on your actual data structure
  const activeDevices = accessibilityEnabled; // Adjust this based on your actual data
  const inactiveDevices = Math.max(0, totalDevices - activeDevices);

  // Calculate percentages
  const activePercentage =
    totalDevices > 0 ? Math.round((activeDevices / totalDevices) * 100) : 0;
  const inactivePercentage = 100 - activePercentage;

  return (
    <div className="p-4">
      <div className="mb-6">
        <h4 className="mb-2 text-lg font-semibold">
          Device Status Distribution
        </h4>
        <p className="text-sm text-muted-foreground">
          Active vs Inactive devices across {totalDevices.toLocaleString()}{" "}
          total devices.
        </p>
      </div>

      <div className="space-y-6">
        {/* Active Devices */}
        <div>
          <div className="mb-1 flex justify-between">
            <div className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Active Devices</span>
            </div>
            <span className="text-sm font-medium">
              {activeDevices.toLocaleString()} ({activePercentage}%)
            </span>
          </div>
          <Bar
            value={activeDevices}
            total={totalDevices || 1} // Prevent division by zero
            color="bg-green-500"
          />
        </div>

        {/* Inactive Devices */}
        <div>
          <div className="mb-1 flex justify-between">
            <div className="flex items-center">
              <Tablet className="mr-2 h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Inactive Devices</span>
            </div>
            <span className="text-sm font-medium">
              {inactiveDevices.toLocaleString()} ({inactivePercentage}%)
            </span>
          </div>
          <Bar
            value={inactiveDevices}
            total={totalDevices || 1} // Prevent division by zero
            color="bg-gray-500"
          />
        </div>

        {/* Additional info section */}
        <div className="mt-6 border-t pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded bg-gray-50 p-3 dark:bg-gray-800">
              <h5 className="mb-1 text-sm font-medium">Kiosk Mode</h5>
              <p className="text-xl font-bold">
                {kioskModeDevices.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalDevices > 0
                  ? Math.round((kioskModeDevices / totalDevices) * 100)
                  : 0}
                % of total
              </p>
            </div>
            <div className="rounded bg-gray-50 p-3 dark:bg-gray-800">
              <h5 className="mb-1 text-sm font-medium">Accessibility</h5>
              <p className="text-xl font-bold">
                {accessibilityWithKiosk.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalDevices > 0
                  ? Math.round((accessibilityWithKiosk / totalDevices) * 100)
                  : 0}
                % with Kiosk
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
